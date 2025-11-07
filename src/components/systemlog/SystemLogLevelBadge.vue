<!-- src/components/systemlog/SystemLogLevelBadge.vue -->
<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="getBadgeClass(level)"
  >
    {{ level }}
  </span>
</template>

<script setup lang="ts">
import { getLogLevelColor } from '~/data/systemLogData'

defineProps<{
  level: string
}>()

const getBadgeClass = (level: string) => {
  return getLogLevelColor(level)
}
</script>