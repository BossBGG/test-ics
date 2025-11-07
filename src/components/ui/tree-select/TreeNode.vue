<template>
  <div class="tree-node">
    <div class="flex items-center py-2 px-3 hover:bg-gray-50">
      <!-- Checkbox -->
      <input
        :id="`checkbox-${node.value}`"
        type="checkbox"
        :checked="checkboxState.checked"
        :indeterminate="checkboxState.indeterminate"
        @change="handleToggle"
        class="mr-2"
      />

      <!-- Label with Counter -->
      <label
        :for="`checkbox-${node.value}`"
        class="flex-1 cursor-pointer select-none ml-2"
      >
        <span v-html="highlightedLabel"></span>
        <span v-if="hasChildren" class="text-gray-500 text-sm ml-1">
          ({{ selectedCount }}/{{ totalCount }})
        </span>
      </label>

      <!-- Expand/Collapse Button -->
      <button
        v-if="hasChildren"
        @click="$emit('toggle-expand', node.value)"
        class="mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
      >
        <ChevronDownIcon v-if="isExpanded" class="text-[30px]"/>
        <ChevronLeftIcon v-else class="text-[30px]"/>
      </button>
      <div v-else class="w-6"></div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="ml-6 border-l border-gray-200">
      <TreeNode
        v-for="child in node.subOptions"
        :key="child.value"
        :node="child"
        :selected="selected"
        :expanded="expanded"
        :search-term="searchTerm"
        @toggle-select="$emit('toggle-select', $event)"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDownIcon, ChevronLeftIcon } from "lucide-vue-next"
import { Options } from "~/api/types"

interface Props {
  node: Options
  selected: Set<string>
  expanded: Set<string>
  searchTerm?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'toggle-select': [event: { nodeId: string, isParent: boolean, subOptions?: Options[] }]
  'toggle-expand': [nodeId: string]
}>()

const hasChildren = computed(() => props.node.subOptions && props.node.subOptions.length > 0)
const isExpanded = computed(() => props.expanded.has(props.node.value as string))

// Get all leaf nodes under this node
const getAllLeafNodes = (node: Options): Options[] => {
  if (!node.subOptions || node.subOptions.length === 0) {
    return [node]
  }

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
  traverse(node.subOptions)
  return leaves
}

// Calculate selection counts
const leafNodes = computed(() => getAllLeafNodes(props.node))
const selectedLeafNodes = computed(() =>
  leafNodes.value.filter(leaf => props.selected.has(leaf.value as string))
)

const selectedCount = computed(() => selectedLeafNodes.value.length)
const totalCount = computed(() => leafNodes.value.length)

// Checkbox state logic
const checkboxState = computed(() => {
  if (!hasChildren.value) {
    // Leaf node - simple checked state
    return {
      checked: props.selected.has(props.node.value as string),
      indeterminate: false
    }
  }

  // Parent node - check if all, some, or none of children are selected
  const selected = selectedCount.value
  const total = totalCount.value

  if (selected === 0) {
    return { checked: false, indeterminate: false }
  } else if (selected === total) {
    return { checked: true, indeterminate: false }
  } else {
    return { checked: false, indeterminate: true }
  }
})

const highlightedLabel = computed(() => {
  if (!props.searchTerm) return props.node.label

  const regex = new RegExp(`(${props.searchTerm})`, 'gi')
  return props.node.label.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
})

const handleToggle = () => {
  console.log('props.node >>> ',props.node.value)
  emit('toggle-select', {
    nodeId: props.node.value,
    isParent: hasChildren.value,
    subOptions: props.node.subOptions
  })
}
</script>

<style scoped>
input[type="checkbox"]:indeterminate {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

input[type="checkbox"]:indeterminate::before {
  content: '';
  display: block;
  width: 8px;
  height: 2px;
  background: white;
  margin: 3px auto;
}
</style>
