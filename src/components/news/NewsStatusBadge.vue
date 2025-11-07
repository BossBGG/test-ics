<!-- src/components/news/NewsStatusBadge.vue -->
<template>
  <span
    class="inline-flex items-center px-2.5 py-1.5 rounded-sm text-white news-status-badge"
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
    case 'DRAFT':
    case '0':
      return 'badge-draft'
    case 'published':
    case 'PUBLISHED':
    case '1':
      return 'badge-published'
    case 'pending':
    case 'SCHEDULED':
    case '2':
      return 'badge-scheduled'
    case 'expired':
    case 'EXPIRED':
    case '3':
      return 'badge-expired'
    default:
      return 'badge-expired'
  }
}
</script>

<style lang="scss" scoped>
.news-status-badge {
  font-size: 14px;
  font-weight: 400;
  &.badge-draft {
    background-color: #C7C8CC;
  }
  &.badge-published {
    background-color: #05AB75;
  }
  &.badge-scheduled {
    background-color: #F9AC12;
  }
  &.badge-expired {
    background-color: #C40C0C;
  }
}
</style>
