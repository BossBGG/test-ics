<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {ref} from "vue";

const emit = defineEmits(['update:page'])
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 100,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  }
})

const currentPage = ref(props.page)
</script>

<template>
  <Pagination
      v-slot="{ page }"
      :items-per-page="itemsPerPage"
      :total="total"
      :sibling-count="1"
      show-edges
      v-model:page="currentPage"
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
