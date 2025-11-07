<template>
  <div class="tree-select">
    <!-- Selected Pills -->
    <div v-if="selectedItems.length > 0" class="mb-3">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="item in selectedItems"
          :key="item.value"
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {{ item.label }}
          <button
            @click="deselectItem(item.value as string)"
            class="ml-1 text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Search Input -->
    <div class="mb-3">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="ค้นหา..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Tree View -->
    <div class="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
      <TreeNode
        v-for="node in filteredData"
        :key="node.value"
        :node="node"
        :selected="selected"
        :expanded="expanded"
        @toggle-select="(event) => toggleSelect(event.nodeId, event.isParent, event.subOptions)"
        @toggle-expand="toggleExpand"
        :search-term="searchTerm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TreeNode from './TreeNode.vue'
import { Options } from "~/api/types"

interface Props {
  data: Options[]
  modelValue: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const searchTerm = ref('')
const selected = ref<Set<string>>(new Set(props.modelValue))
const expanded = ref<Set<string>>(new Set())

// Get all leaf nodes
const getAllLeafNodes = (nodes: Options[]): Options[] => {
  const leaves: Options[] = []
  const traverse = (items: Options[]) => {
    items.forEach(item => {
      if (!item.subOptions || item.subOptions.length === 0) {
        leaves.push(item)
      } else {
        traverse(item.subOptions)
      }
    })
  }
  traverse(nodes)
  return leaves
}

// Get selected leaf items for pills display
const selectedItems = computed(() => {
  const allLeaves = getAllLeafNodes(props.data)
  return allLeaves.filter(item => selected.value.has(item.value as string))
})

// Filter data based on search term
const filteredData = computed(() => {
  if (!searchTerm.value) return props.data

  const filterNodes = (nodes: Options[]): Options[] => {
    return nodes.reduce((acc: Options[], node) => {
      const matchesSearch = node.label.toLowerCase().includes(searchTerm.value.toLowerCase())
      const filteredChildren = node.subOptions ? filterNodes(node.subOptions) : []

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          subOptions: filteredChildren.length > 0 ? filteredChildren : node.subOptions
        })
        // Auto-expand nodes that have matches
        if (filteredChildren.length > 0) {
          expanded.value.add(node.value as string)
        }
      }

      return acc
    }, [])
  }

  return filterNodes(props.data)
})

const toggleSelect = (nodeId: string, isParent: boolean, subOptions?: Options[] | undefined) => {
  if (isParent && subOptions) {
    // Toggle all children
    const allChildIds = getAllLeafNodes(subOptions).map(sub => sub.value)
    const allSelected = allChildIds.every(id => selected.value.has(id as string))

    if (allSelected) {
      allChildIds.forEach(id => selected.value.delete(id as string))
    } else {
      allChildIds.forEach(id => selected.value.add(id as string))
    }
  } else {
    // Toggle single item
    if (selected.value.has(nodeId)) {
      selected.value.delete(nodeId)
    } else {
      selected.value.add(nodeId)
    }
  }

  emit('update:modelValue', Array.from(selected.value))
}

const toggleExpand = (nodeId: string) => {
  if (expanded.value.has(nodeId)) {
    expanded.value.delete(nodeId)
  } else {
    expanded.value.add(nodeId)
  }
}

const deselectItem = (itemId: string) => {
  selected.value.delete(itemId)
  emit('update:modelValue', Array.from(selected.value))
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selected.value = new Set(newValue)
}, { deep: true })
</script>
