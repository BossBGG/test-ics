<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PaginationList, type PaginationListProps } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<PaginationListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <PaginationList
    v-slot="slotProps"
    data-slot="pagination-content"
    v-bind="delegatedProps"
    :class="cn('flex flex-row items-center gap-1 pagination-content', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationList>
</template>
<style scoped>
 .pagination-content {
   border: 1px solid #e5e5e5;
   padding: 5px;
   border-radius: 12px;
 }
</style>
