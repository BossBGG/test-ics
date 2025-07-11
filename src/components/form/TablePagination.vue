<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {ref ,watch} from "vue";
import { type Table } from '@tanstack/vue-table'

const emit = defineEmits(['update:page'])
interface DataTablePaginationProps<TData> {
  table: Table<TData>
}
const props = defineProps<DataTablePaginationProps<any>>()
</script>

<template>
  <Pagination
      v-slot="{ page }"
      :items-per-page="table.getState().pagination.pageSize"
      :total="table.getPageCount() * table.getState().pagination.pageSize"
      :sibling-count="1"
      show-edges
      @update:page="table.setPageIndex($event - 1)"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious/>
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
            :class="item.value === page ? 'bg-primary text-white' : ''"
        >
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis
            class="w-9 h-9 flex items-center justify-center"
            v-else
            :key="item.type"
            :index="index"/>
      </template>
      <PaginationNext/>
    </PaginationContent>
  </Pagination>
</template>
