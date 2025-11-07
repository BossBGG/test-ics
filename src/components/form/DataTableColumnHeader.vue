<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import { ArrowDown, ArrowUp,ArrowUpDown } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DataTableColumnHeaderProps {
  column: Column<any, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <Button
        variant="ghost"
        size="sm"
        class="-ml-3 h-8 data-[state=open]:bg-accent text-[16px]"
        @click="column.toggleSorting()"
    >
      <span>{{ title }}</span>
      <ArrowDown v-if="column.getIsSorted() === 'desc'" class="w-4 h-4 ml-2" />
      <ArrowUp v-else-if=" column.getIsSorted() === 'asc'" class="w-4 h-4 ml-2" />
      <ArrowUpDown v-else class="w-4 h-4 ml-2" />
    </Button>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
