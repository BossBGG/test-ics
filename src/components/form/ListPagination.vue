<script lang="ts" setup>
import {Pagination} from "~/components/ui/pagination";

defineProps({
  itemsPerPage: {
    type: Number,
    default: 12
  },
  totalItems: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:page'])

function handlePageUpdate(page: number) {
  try {
    if (page && page > 0) {
      emit("update:page", page);
    }
  } catch (error) {
    console.warn("Pagination update error:", error);
  }
}
</script>
<template>
  <Pagination
    v-slot="{ page }"
    :items-per-page="itemsPerPage"
    :total="totalItems"
    :page="currentPage"
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
      <PaginationNext class="cursor-pointer"/>
    </PaginationContent>
  </Pagination>
</template>
