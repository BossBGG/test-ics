<!-- src/components/news/NewsStatusBadge.vue -->
<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="getBadgeClass(status)"
  >
    {{ getStatusLabel(status) }}
  </span>
</template>

<script setup lang="ts">
import { getStatusLabel } from '~/data/newsData'

defineProps<{
  status: string
}>()

const getBadgeClass = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'expired':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>