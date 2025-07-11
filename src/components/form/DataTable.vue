<!-- src/components/form/DataTable.vue -->
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
import {h, ref} from 'vue'
import {Filter} from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {valueUpdater} from "~/components/ui/table/utils"

const props = defineProps({
  columns: {
    type: Array as () => ColumnDef<any>[],
    required: true,
  },
  data: {
    type: Array as () => any[],
    required: true,
  },
  isSystemLog: {
    type: Boolean,
    default: false,
  },
  showFilter: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['show-filter', 'toggle-status'])

const sorting = ref<SortingState>([])
const search = ref<string>('')
const showFilterDialog = ref(false)

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
  },
  initialState: {
    pagination: {
      pageSize: 10, // กำหนดจำนวนแถวเริ่มต้นต่อหน้าเป็น 10
      pageIndex: 0, // (Optional) กำหนดหน้าที่เริ่มต้นเป็นหน้าแรก
    },
  },
})

const handleFilterClick = () => {
  showFilterDialog.value = true
  emit('show-filter')
}

const handleFilterClose = () => {
  showFilterDialog.value = false
}

const handleToggleStatus = (item: any) => {
  // Toggle the status
  item.is_active = !item.is_active
  emit('toggle-status', item)
}

const handleFilterApply = (filters: any) => {
  console.log('Applied filters:', filters)
  // Handle filter application logic here
  handleFilterClose()
}
</script>

<template>
  <div class="w-full">
    <!-- Create Button Slot -->
    <slot name="createButton"></slot>

    <!-- Search and Filter Row -->
    <div class="mb-3 flex items-center space-x-3" v-if="showFilter || showSearch">
      <div class="flex-1" v-if="showSearch">
        <q-input outlined v-model="search" label="ค้นหา" debounce="500">
          <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer"></q-icon>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </div>

      <button v-if="showFilter"
              @click="handleFilterClick"
              class="filter-button flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
              style="width: 55px; height: 55px;"
              title="ตัวกรอง"
              type="button"
      >
        <Filter class="filter-icon text-gray-600" :size="25"/>
      </button>
    </div>

    <!-- Data Table -->
    <div class="rounded-[10px] border">
      <Table class="rounded-tl-[8px] rounded-tr-[8px] data-table">
        <TableHeader>
          <TableRow v-for="headerGroup in table?.getHeaderGroups()" :key="headerGroup.id">
            <TableHead class="bg-[#69306D] text-white first:rounded-tl-[8px] last:rounded-tr-[8px] p-2"
                       v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                          :props="header.getContext()"/>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <!-- Check if this cell is the status toggle column -->
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()"/>
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
                :colspan="columns.length"
                class="h-24 text-center"
            >
              ไม่พบข้อมูล
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="mt-5">
      <table-pagination :table="table"></table-pagination>
    </div>

    <!-- Filter Dialog -->
    <FilterDialog
        v-if="!isSystemLog"
        v-model="showFilterDialog"
        @apply-filters="handleFilterApply"
    />

    <!-- System Log Filter Dialog -->
    <SystemLogFilterDialog
        v-if="isSystemLog"
        v-model="showFilterDialog"
        @apply-filters="handleFilterApply"
    />
  </div>
</template>

<style scoped>
.data-table th, td {
  font-size: 16px;
}

.filter-button {
  height: 55px;
  min-width: 55px;
  cursor: pointer;
}

.filter-button:hover {
  background-color: #f9fafb;
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