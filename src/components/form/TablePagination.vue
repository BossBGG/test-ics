<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { computed } from "vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  perPage?: number;
}

const props = defineProps<DataTablePaginationProps<any>>();
const emit = defineEmits(["update:page"]);

// Computed values to ensure proper calculation with null safety
const totalItems = computed(() => {
  const count = props.totalCount ?? 0;
  return Math.max(0, count);
});

const itemsPerPage = computed(() => {
  if (props.perPage && props.perPage > 0) {
    return props.perPage;
  }
  try {
    return props.table?.getState()?.pagination?.pageSize || 10;
  } catch {
    return 10;
  }
});

const currentPageValue = computed(() => {
  const page = props.currentPage ?? 1;
  return Math.max(1, page);
});

const shouldShowPagination = computed(() => {
  try {
    if (!props.table) return false;

    // ต้องมี totalItems > itemsPerPage หรือ totalItems > 0
    const hasData = totalItems.value > 0;
    const needsPagination = totalItems.value > itemsPerPage.value;

    return hasData && (needsPagination || totalItems.value > 0);
  } catch (error) {
    console.warn("Pagination check error:", error);
    return false;
  }
});

function handlePageUpdate(page: number) {
  if (page && page > 0) {
    emit("update:page", page);
  }
}
</script>

<template>
  <div v-if="shouldShowPagination">
    <Pagination
      v-slot="{ page }"
      :items-per-page="itemsPerPage"
      :total="totalItems"
      :page="currentPageValue"
      :sibling-count="1"
      show-edges
      @update:page="handlePageUpdate"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious class="cursor-pointer"/>
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
            class="cursor-pointer"
            :class="item.value === page ? 'bg-primary text-white' : ''"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis
            v-else
            :key="item.type"
            class="h-9 w-9 flex items-center justify-center"
            :index="index"
          />
        </template>
        <PaginationNext class="cursor-pointer" />
      </PaginationContent>
    </Pagination>
  </div>
  <div v-else class="py-4 text-center text-gray-500">
    <!-- Pagination ไม่พร้อมใช้งาน -->
  </div>
</template>
