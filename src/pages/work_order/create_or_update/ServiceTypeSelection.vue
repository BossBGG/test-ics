<template>
  <div>
    <q-btn-dropdown
      class="w-full"
      outline
      color="grey-7"
      dropdown-icon="keyboard_arrow_down"
      :style="{ width: '100%' }"
    >
      <template #label>
        <div class="flex flex-wrap gap-1 w-full" v-if="selectedSubOptionLabels.length > 0">
          <div
            v-for="label in selectedSubOptionLabels"
            :key="label"
            class="bg-[#E4DCFF] px-2 py-1 rounded-sm text-sm"
          >
            {{ label }}
          </div>
        </div>
        <span v-else class="text-[#AAAAAA]">เลือกประเภทงานบริการ</span>
      </template>

      <q-card class="p-2">
        <TreeSelect
          :data="props.options"
          v-model="selectedValues"
          :showSelected="false"
          :searchable="false"
        />
      </q-card>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {Options} from "~/api/types.js"

interface Props {
  modelValue: string[]
  options: Options[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selectedValues = computed({
  get: () => props.modelValue,
  set: (value: string[]) => emit('update:modelValue', value)
})

const selectedSubOptionLabels = computed(() => {
  const labels: string[] = []

  const findSubOptionLabels = (options: Options[]) => {
    for (const option of options) {
      if (option.subOptions) {
        for (const subOption of option.subOptions) {
          if (props.modelValue?.includes(subOption.value as string)) {
            labels.push(subOption.label)
          }
          if (subOption.subOptions) {
            findSubOptionLabels([subOption])
          }
        }
      }
    }
  }

  findSubOptionLabels(props.options)
  return labels
})
</script>
