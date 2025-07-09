<script setup lang="ts">
import type {
  ColumnDef,
  SortingState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { h, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {valueUpdater} from "~/lib/utils";

const props = defineProps({
  columns: {
    type: Array as () => ColumnDef<any>[],
    required: true,
  },
  data: {
    type: Array as () => any[],
    required: true,
  },
  showSelect: {
    type: Boolean,
    default: true,
  },
  createButton: {
    type: Object as () => {label: string, route: string, icon?: any} | false,
    required: false
  },
})

const data = ref(props.data)
const sorting = ref<SortingState>([])
const search = ref<string>('')

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() { return sorting.value },
  },
})

</script>

<template>
  <div class="w-full">
    <template v-if="$slots.createButton">
      <slot name="createButton"></slot>
    </template>
    <div class="mb-3">
      <q-input outlined v-model="search" label="ค้นหา" debounce="500">
        <template v-slot:append>
          <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer"></q-icon>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
    </div>
    <div class="rounded-[10px] border">
      <Table class="rounded-tl-[8px] rounded-tr-[8px] data-table">
        <TableHeader>
          <TableRow v-for="headerGroup in table?.getHeaderGroups()" :key="headerGroup.id">
            <TableHead class="bg-[#69306D] text-white first:rounded-tl-[8px] last:rounded-tr-[8px] p-2"
                       v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
                :colspan="columns.length"
                class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="mt-5">
      <table-pagination></table-pagination>
    </div>
  </div>
</template>

<style scoped>
  .data-table th,td{
    font-size: 16px;
  }
</style>
<style>
.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #69306D; /* A shade of purple similar to the image */
  color: #ffffff; /* White text and icon */
  border: none;
  border-radius: 8px; /* Adjust as needed for desired roundedness */
  padding: 12px 24px; /* Adjust padding for desired size */
  font-size: 18px; /* Adjust font size for text */
  cursor: pointer;
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow */
}

.create-button:hover {
  opacity: 0.9;
}

.create-button:active {
  background-color: #5c0f88; /* Slightly darker purple when clicked */
}
</style>