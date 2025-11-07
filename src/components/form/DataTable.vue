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
import { onMounted, ref, watch } from "vue";
import type { CancelTokenSource } from "axios";
import { debounce } from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "~/components/ui/table/utils";
import { dismissPopup, showError, showProgress } from "~/composables/alert";
import type { TableListApi } from "~/api/table_api";
import TablePagination from "~/components/form/TablePagination.vue";

const props = defineProps({
  columns: {
    type: Array as () => ColumnDef<any>[],
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
  showSizePerPage: {
    type: Boolean,
    default: true,
  },
  tableApi: {
    type: Object as PropType<TableListApi>,
    required: true,
  },
  tableApiData: {
    type: [Object, Function],
    required: false,
  },
});

const emit = defineEmits(["show-filter", "search", "updateLatestAt"]);

defineSlots<{
  "create-button"?: () => any;
  "cell-name"?: (ctx: any) => any;
  "cell-quantity"?: (ctx: any) => any;
  "cell-code"?: (ctx: any) => any;
}>();

onMounted(() => {
  // รอให้ component init เสร็จก่อน
  setTimeout(() => {
    if (props.tableApi) {
      callApi();
    } else {
      console.warn("TableApi not provided to DataTable component");
    }
  }, 100);
});

const sorting = ref<SortingState>([]);
const search = ref<string>("");
const showFilterDialog = ref(false);
const data = ref<any[]>([]);
const perPage = ref(10);
const currentPage = ref(1);
const itemsPerPageOptions = [10, 25, 50, 100];

// เก็บ metadata จาก API
const totalCount = ref(0);
const totalPages = ref(0);

// สำหรับหน้าที่ใช้ RowPagination จะไม่ใช้ pagination ของ TanStack Table
// const shouldUsePagination = !props.isSystemLog && !props.isMaterialEquipment;

const debounceSearch = debounce(() => callApi(), 500);

// Watch search changes และ reset pagination
watch(search, (newSearch, oldSearch) => {
  // Reset pagination เมื่อ search เปลี่ยน
  currentPage.value = 1;
  table.setPageIndex(0); // Reset table pagination state
  debounceSearch();
});

// Watch tableApiData changes (filters) และ reset pagination
watch(
  () => props.tableApiData,
  (newData, oldData) => {
    // เปรียบเทียบว่าข้อมูลเปลี่ยนหรือไม่ (ไม่ใช่การ initialize ครั้งแรก)
    if (oldData !== undefined) {
      // Reset pagination เมื่อ filter เปลี่ยน
      currentPage.value = 1;
      table.setPageIndex(0); // Reset table pagination state
    }
    debounceSearch();
  },
  { deep: true },
);

const table = useVueTable({
  data,
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updater) => {
    const oldSorting = sorting.value;
    const newSorting = typeof updater === "function" ? updater(sorting.value) : updater;

    const sortingChanged = JSON.stringify(oldSorting) !== JSON.stringify(newSorting);

    if (sortingChanged) {
      currentPage.value = 1;
      table.setPageIndex(0);
    }
    sorting.value = newSorting;
    callApi();
  },
  getFilteredRowModel: getFilteredRowModel(),
  state: {
        get sorting() {
      return sorting.value;
    },
  },
  manualPagination: true,
  manualSorting: true,
  // สำคัญ: ปิดการ auto reset เพราะเราจะ handle เอง
  autoResetPageIndex: false,
});

defineExpose({
  refresh: () => {
    // เมื่อ refresh ให้ reset pagination ด้วย
    currentPage.value = 1;
    table.setPageIndex(0);
    callApi();
  },
  filterData: () => {
    return {
      search: search.value,
      // sort: [sortBy.value, sortDesc.value ? 'desc' : 'asc'],
      ...props.tableApiData,
    };
  },
  currentData: () => {
    return data.value;
  },
});

let cancelTokenSource: CancelTokenSource | null = null;

function callApi() {
  let sortBy = "";
  let sortOrder = "";
  if (sorting.value.length > 0) {
    sortBy = sorting.value[0].id;
    sortOrder = sorting.value[0].desc ? "desc" : "asc";
  }

  const apiParams = {
    search: search.value,
    limit: perPage.value,
    size: perPage.value,
    page: currentPage.value,
    sortBy,
    sortOrder,
    ...props.tableApiData,
  };

  showProgress();
  if (cancelTokenSource) {
    cancelTokenSource.cancel();
  }

  props.tableApi
    .callApi(apiParams)
    .then(({ api, cancelToken }) => {
      cancelTokenSource = cancelToken;
      return api;
    })
    .then((res) => {
      if (res.data && res.data.data) {
        data.value = res.data.data.items || res.data.data.data || [];
        if (res.data.data.meta) {
          totalCount.value = res.data.data.meta.totalCount || 0;
          totalPages.value = res.data.data.meta.totalPages || 0;
        }else {
          totalCount.value = res.data.data.total || 0;
          totalPages.value = res.data.data.totalPages || 0;
        }
        emit("updateLatestAt", getCurrentDateTimeYmd());
        dismissPopup();
      }
    })
    .catch((error) => {
      showError(error.message);
    });
}

function handleFilterClick() {
  emit("show-filter");
  // showFilterDialog.value = true;
}

function handleFilterClose() {
  showFilterDialog.value = false;
}

function handleFilterApply(filters: any) {
  console.log("Applied filters:", filters);
  // Handle filter application logic here
  handleFilterClose();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  table.setPageIndex(page - 1);
  callApi();
}

function handlePageSize(size: number) {
  // Reset pagination เมื่อเปลี่ยน page size
  currentPage.value = 1;
  perPage.value = size;
  table.setPageSize(size);
  table.setPageIndex(0);
  callApi();
}

interface ColumDefMeta {
  columnDef: {
    meta?: {
      getRowClass?: (row: any) => string
    }
  }
}

function getRowClass(row: any) {
  return table
    .getAllLeafColumns()
    .map((col: ColumDefMeta) => col.columnDef.meta?.getRowClass?.(row))
    .filter(Boolean)
    .join(' ')
}
</script>

<template>
  <div class="w-full">
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
        <q-icon name="filter_alt" size="md" style="color: #65004a" />
      </button>

      <!-- Create Button Slot -->
      <div class="ml-2">
        <slot name="create-button" />
      </div>
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
              <TableRow
                :data-state="row.getIsSelected() && 'selected'"
                :class="getRowClass(row)"
              >
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
    <div class="mt-5 flex items-center justify-end">
      <div v-if="showSizePerPage" class="me-3">
        <div class="flex items-center">
          <label class="me-2">แถวต่อหน้า:</label>
          <q-select
            v-model="perPage"
            :options="itemsPerPageOptions"
            outlined
            dense
            class="items-per-page-select"
            @update:model-value="(v) => handlePageSize(v)"
          />
        </div>
      </div>

      <div v-if="showPagination && table">
        <div v-if="totalCount > 0 || data.length > 0">
          <TablePagination
            :table="table"
            :total-count="totalCount || 0"
            :total-pages="totalPages || 0"
            :current-page="currentPage || 1"
            :per-page="perPage || 10"
            @update:page="handlePageChange"
          />
        </div>
        <div v-else class="py-4 text-center text-gray-500">
          <!-- ไม่มีข้อมูลสำหรับ pagination -->
        </div>
      </div>
    </div>

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
  background-color: #f1dceb !important;
}

.filter-button:hover {
  background-color: #f1dceb !important;
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

/* Style for expired row */
:deep(.data-table .expired-row) {
  background-color: #f2f2f2 !important;
  color: #aaaaaa !important;
}

:deep(.data-table .expired-row td) {
  background-color: #f2f2f2 !important;
  color: #aaaaaa !important;
}

:deep(.data-table .expired-row td *) {
  color: #aaaaaa !important;
}

/* Keep text white for badge */
:deep(.data-table .expired-row .news-status-badge) {
  color: white !important;
}

:deep(.data-table .expired-row .news-status-badge *) {
  color: white !important;
}
</style>
