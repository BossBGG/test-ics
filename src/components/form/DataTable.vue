<!-- src/components/form/DataTable.vue -->
<script setup lang="ts">
import type {ColumnDef, SortingState} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {onMounted, ref, watch} from "vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {valueUpdater} from "~/components/ui/table/utils";
import {dismissPopup, showError, showProgress} from "~/composables/alert";
import {TableListApi} from "~/api/table_api";
import type {CancelTokenSource} from "axios";
import {debounce} from "lodash";

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

const emit = defineEmits(["show-filter", "search"]);

defineSlots<{
  "create-button"?: () => any;
  "cell-name"?: (ctx: any) => any;
  "cell-quantity"?: (ctx: any) => any;
  "cell-code"?: (ctx: any) => any;
}>();

onMounted(() => {
  callApi()
})

const sorting = ref<SortingState>([]);
const search = ref<string>("");
const showFilterDialog = ref(false);
const data = ref<any[]>([])
let perPage = ref(10)
let currentPage = ref(1)
const itemsPerPageOptions = [10, 25, 50, 100]

// สำหรับหน้าที่ใช้ RowPagination จะไม่ใช้ pagination ของ TanStack Table
// const shouldUsePagination = !props.isSystemLog && !props.isMaterialEquipment;

const debounceSearch = debounce(() => callApi(), 500)

watch(currentPage, callApi)
watch(perPage, callApi)
watch(search, callApi)
watch(() => props.tableApiData, () => {
  currentPage.value = 1
  debounceSearch()
}, { deep: true })

watch(() => search.value || perPage.value, () => {
  currentPage.value = 1
}, {deep: true })
const table = useVueTable({
  data,
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  initialState:  {
    pagination: {
      pageSize: 10,
      pageIndex: 0,
    },
  }
});

defineExpose({
  refresh: () => {
    callApi()
  },
  filterData: () => {
    return {
      search: search.value,
      // sort: [sortBy.value, sortDesc.value ? 'desc' : 'asc'],
      ...props.tableApiData
    }
  },
  currentData: () => {
    return data.value
  }
})

let cancelTokenSource: CancelTokenSource | null = null

function callApi() {
  showProgress()
  if (cancelTokenSource) {
    cancelTokenSource.cancel()
  }

  props.tableApi.callApi({
    search: search.value,
    sort: [],
    limit: perPage.value,
    page: currentPage.value,
    ...props.tableApiData
  })
    .then(({api, cancelToken}) => {
      cancelTokenSource = cancelToken
      return api
    })
    .then(res => {
      if (res.data && res.data.success) {
        if (res.data.data) {
          data.value = res.data.data.items || [];
          dismissPopup()
        }
      } else {
        dismissPopup()
        data.value = []
      }
    })
    .catch((error) => {
      showError(error.message)
    })
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
            <q-icon name="search"/>
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
        <q-icon name="filter_alt" size="md" style="color:#65004A"/>
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
                  <template v-if="cell.column.id === 'name'">
                    <slot name="cell-name" :ctx="cell.getContext()">
                      <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                      />
                    </slot>
                  </template>
                  <template v-else-if="cell.column.id === 'code'">
                    <slot name="cell-code" :ctx="cell.getContext()">
                      <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                      />
                    </slot>
                  </template>
                  <template v-else-if="cell.column.id === 'quantity'">
                    <slot name="cell-quantity" :ctx="cell.getContext()">
                      <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                      />
                    </slot>
                  </template>
                  <template v-else>
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </template>
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
    <div class="flex items-center justify-end mt-5">
      <div v-if="showSizePerPage" class="me-3">
        <div class="flex items-center">
          <label class="me-2">แถวต่อหน้า:</label>
          <q-select
            v-model="perPage"
            :options="itemsPerPageOptions"
            outlined
            dense
            class="items-per-page-select"
          />
        </div>
      </div>

      <div v-if="showPagination">
        <table-pagination :table="table"/>
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
