<!-- src/components/form/DataTable.vue -->
<script setup lang="ts">
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { h, ref } from "vue";
import { Filter } from "lucide-vue-next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "~/components/ui/table/utils";

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
  isMaterialEquipment: {
    type: Boolean,
    default: false,
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["show-filter", "toggle-status"]);

defineSlots<{
  "create-button"?: () => any;
}>();

const sorting = ref<SortingState>([]);
const search = ref<string>("");
const showFilterDialog = ref(false);

// สำหรับหน้าที่ใช้ RowPagination จะไม่ใช้ pagination ของ TanStack Table
const shouldUsePagination = !props.isSystemLog && !props.isMaterialEquipment;

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: shouldUsePagination
    ? getPaginationRowModel()
    : undefined,
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  initialState: shouldUsePagination
    ? {
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      }
    : undefined,
});

function handleFilterClick() {
  showFilterDialog.value = true;
  emit("show-filter");
}

function handleFilterClose() {
  showFilterDialog.value = false;
}

function handleToggleStatus(item: any) {
  // Toggle the status
  item.is_active = !item.is_active;
  emit("toggle-status", item);
}

function handleFilterApply(filters: any) {
  console.log("Applied filters:", filters);
  // Handle filter application logic here
  handleFilterClose();
}
</script>

<template>
  <div class="w-full">
    <!-- Create Button Slot -->
    <slot name="create-button" />

    <!-- Search and Filter Row -->
    <div
      v-if="showFilter || showSearch"
      class="mb-3 flex items-center space-x-3"
    >
      <div v-if="showSearch" class="flex-1">
        <q-input v-model="search" outlined label="ค้นหา" debounce="500">
          <template #append>
            <q-icon
              v-if="search !== ''"
              name="close"
              class="cursor-pointer"
              @click="search = ''"
            />
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <button
        v-if="showFilter"
        class="filter-button flex items-center justify-center border border-gray-300 rounded-md bg-white px-3 py-2 transition-colors hover:bg-gray-50"
        style="width: 55px; height: 55px"
        title="ตัวกรอง"
        type="button"
        @click="handleFilterClick"
      >
        <Filter class="filter-icon text-gray-600" :size="25" />
      </button>
    </div>

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
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <!-- Check if this cell is the status toggle column -->
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
    <div v-if="showPagination && shouldUsePagination" class="mt-5">
      <table-pagination :table="table" />
    </div>

    <!-- Filter Dialog -->
    <FilterDialog
      v-if="!isSystemLog && !isMaterialEquipment"
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />

    <!-- System Log Filter Dialog -->
    <SystemLogFilterDialog
      v-if="isSystemLog"
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />

    <MaterialEquipmentFilterDialog
      v-if="isMaterialEquipment"
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />
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
