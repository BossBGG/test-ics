<!-- src/components/form/DataTableEditor.vue -->
<script setup lang="ts">
import {ColumnDef, getSortedRowModel} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  SortingState
} from "@tanstack/vue-table";
import {ref} from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const props = defineProps({
  columns: {
    type: Array as () => ColumnDef<any>[],
    required: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(["show-filter", "search"]);

defineSlots<{
  "create-button"?: () => any;
  "cell-name"?: (ctx: any) => any;
  "cell-quantity"?: (ctx: any) => any;
  "cell-code"?: (ctx: any) => any;
}>();

const data = ref<any[]>([])
let perPage = ref(10)
let currentPage = ref(1)
const sorting = ref<SortingState>([])

const table = useVueTable({
  data,
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
  },
  autoResetPageIndex: false
});

defineExpose({
  updateData: (rowIndex: number, columnId: string, value: any) => {
    data.value = data.value.map((row, index) => {
      return index === rowIndex ? {...row, [columnId]: value} : row
    })
  },
  removeData: (rowIndex: number) => {
    data.value = data.value.filter((_,index) => index !== rowIndex)
  },
  setData: (items: any[]) => {
    data.value = items;
  },
  setLastPageIndex: () => {
    currentPage.value = Math.ceil(data.value.length / perPage.value);
    table.setPageIndex(currentPage.value - 1);
  },
  getData: () => {
    return data.value
  }
})

const handleChangePage = (page: number) => {
  currentPage.value = page;
  table.setPageIndex(page - 1);
}

</script>

<template>
  <div class="w-full">
    <!-- Data Table -->
    <div class="border rounded-[10px]">
      <Table class="data-table rounded-tl-[8px] rounded-tr-[8px]">
        <TableHeader>
          <TableRow
            v-for="headerGroup in table?.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="bg-[#69306D] p-2 text-white first:rounded-tl-[8px] last:rounded-tr-[8px]"
              :style="{
                width: header.getSize() + 'px',
                maxWidth: header.column.columnDef.maxSize + 'px',
                minWidth: header.column.columnDef.minSize + 'px',
              }"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()"
                           :key="cell.id"
                           :style="{
                              width: cell.column.getSize() + 'px',
                              maxWidth: cell.column.columnDef.maxSize + 'px',
                              minWidth: cell.column.columnDef.minSize + 'px'
                           }"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              ไม่พบข้อมูล
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Built-in Pagination (only for news page) -->
    <div class="mt-5">
      <table-pagination :table="table"
                        :total-count="data.length"
                        @update:page="handleChangePage"
                        :current-page="currentPage"
      />
    </div>
  </div>
</template>

<style scoped>
.data-table th,
td {
  font-size: 16px;
}

.filter-button {
  height: 55px;
  min-width: 55px;
  cursor: pointer;
  background-color: #F1DCEB !important;
}

.filter-button:hover {
  background-color: #F1DCEB !important;
}

.filter-button:active {
  background-color: #f3f4f6;
}

/* Center align switch column */
:deep(.data-table td:has(.flex.justify-center)) {
  text-align: center;
  padding: 8px;
}

/* Ensure proper alignment for all table cells */
:deep(.data-table td) {
  vertical-align: middle;
  height: 48px;
}

/* Style for switch component */
:deep(.data-table .q-toggle) {
  margin: 0 auto;
}
</style>
