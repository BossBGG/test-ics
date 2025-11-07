<!-- src/pages/work_report/[id].vue -->
<script setup lang="ts">
import { ref, h, computed, watch } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTable from "@/components/form/DataTable.vue";
import { Plus, Filter, Download } from "lucide-vue-next";
import DataTableColumnHeader from "@/components/form/DataTableColumnHeader.vue";
import RowPagination from "@/components/ui/pagination/RowPagination.vue";
import WorkerReportFilter  from "@/components/dialog/WorkerReportFilter.vue";
import { WorkerReportDataData, type WorkerReportData } from "~/data/workreportData";
import ContentContainer from "~/layouts/ContentContainer.vue";
import { useRoute, useRouter } from "vue-router";
import { Checkbox } from "@/components/ui/checkbox";
import CardWorkReport from "~/components/ui/card/CardWorkReport.vue";
import CardTotalWorkReport from "~/components/ui/card/CardTotalWorkReport.vue";
import AllReportsChart from "~/components/work_report/AllReportsChart.vue";
import WorkingHoursChart from "~/components/work_report/WorkingHoursChart.vue";
import DownloadConfirmDialog from "~/components/alert/DownloadConfirmDialog.vue";

import "@/styles/work-report.css";

const route = useRoute();
const router = useRouter();

// Reactive data
const allWorkReportData = ref<WorkerReportData[]>(WorkerReportDataData);
const showFilterDialog = ref(false);
const showDownloadDialog = ref(false);
const selectedWorkServices = ref<string[]>([]);
const searchText = ref("");
const showWorkServiceDropdown = ref(false);
const showExportDropdown = ref(false);
const currentFilters = ref({
  startDate: "",
  endDate: "",
  workerGroup: "",
  workerName: "",
});

// Export options
const exportOptions = [
  { label: "CSV", value: "csv" },
  { label: "Excel", value: "excel" },
];

// Work service options for checkbox dropdown
const workServiceOptions = [
  { label: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า", value: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า" },
  {
    label: "ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
    value: "ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
  },
  {
    label: "ขอตรวจสอบและบำรุงรักษาเคเบิล",
    value: "ขอตรวจสอบและบำรุงรักษาเคเบิล",
  },
  {
    label: "ขอตรวจสอบและบำรุงรักษารีเลย์",
    value: "ขอตรวจสอบและบำรุงรักษารีเลย์",
  },
  { label: "ขอบำรุงรักษาหม้อแปลงไฟฟ้า", value: "ขอบำรุงรักษาหม้อแปลงไฟฟ้า" },
];

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Selected rows for bulk actions
const selectedRows = ref<number[]>([]);
const selectAll = ref(false);

// Apply filters to data
const filteredData = computed(() => {
  let data = [...allWorkReportData.value];

  // Apply search
  if (searchText.value) {
    data = data.filter(
      (item) =>
        item.electricity
          .toLowerCase()
          .includes(searchText.value.toLowerCase()) ||
        item.workerGroup
          .toLowerCase()
          .includes(searchText.value.toLowerCase()) ||
        item.workerName.toLowerCase().includes(searchText.value.toLowerCase()),
    );
  }


  // Apply filters
  if (currentFilters.value.workerGroup) {
    data = data.filter(
      (item) => item.workerGroup === currentFilters.value.workerGroup,
    );
  }

  if (currentFilters.value.workerName) {
    data = data.filter((item) => item.workerName === currentFilters.value.workerName);
  }
  return data;
});

// Computed properties for pagination
const totalItems = computed(() => filteredData.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value),
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Handle row selection
const handleRowSelect = (id: number, selected: boolean) => {
  if (selected) {
    selectedRows.value.push(id);
  } else {
    selectedRows.value = selectedRows.value.filter((rowId) => rowId !== id);
  }
  updateSelectAll();
};

const handleSelectAll = (selected: boolean) => {
  if (selected) {
    selectedRows.value = paginatedData.value.map((item) => item.id);
  } else {
    selectedRows.value = [];
  }
  selectAll.value = selected;
};

const updateSelectAll = () => {
  const currentPageIds = paginatedData.value.map((item) => item.id);
  selectAll.value =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedRows.value.includes(id));
};

// Handle work service checkbox
const handleWorkServiceChange = (value: string, checked: boolean) => {
  if (checked) {
    selectedWorkServices.value.push(value);
  } else {
    selectedWorkServices.value = selectedWorkServices.value.filter(
      (item) => item !== value,
    );
  }
};

const removeWorkServiceFilter = (value: string) => {
  selectedWorkServices.value = selectedWorkServices.value.filter(
    (item) => item !== value,
  );
};

const toggleWorkServiceDropdown = () => {
  showWorkServiceDropdown.value = !showWorkServiceDropdown.value;
};

const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value;
};

// Column definitions
const columns: ColumnDef<WorkerReportData>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return h(Checkbox, {
        checked: selectAll.value,
        "onUpdate:checked": handleSelectAll,
        "aria-label": "Select all",
      });
    },
    cell: ({ row }) => {
      const isSelected = selectedRows.value.includes(row.original.id);
      return h(Checkbox, {
        checked: isSelected,
        "onUpdate:checked": (value: boolean) =>
          handleRowSelect(row.original.id, value),
        "aria-label": "Select row",
      });
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "ลำดับที่",
      });
    },
    cell: ({ row }) => h("div", { class: "text-center" }, row.getValue("id")),
    enableSorting: true,
  }, 
  {
    accessorKey: "electricity",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "การไฟฟ้า" }),
    cell: ({ row }) => h("div", {}, row.getValue("electricity")),
    enableSorting: true,
  },
  {
    accessorKey: "workerGroup",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "กลุ่มผู้ปฏิบัติงาน" }),
    cell: ({ row }) =>
      h("div", { class: "font-medium" }, row.getValue("workerGroup")),
    enableSorting: true,
  },
  {
    accessorKey: "workerName",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ผู้ปฏิบัติงาน" }),
    cell: ({ row }) => h("div", {}, row.getValue("workerName")),
    enableSorting: true,
  },
  {
    accessorKey: "workCount",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "จำนวนงาน" }),
    cell: ({ row }) => h("div", {}, row.getValue("workCount")),
    enableSorting: true,
  },
  {
    accessorKey: "workHours",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "จำนวนชั่วโมง" }),
    cell: ({ row }) => h("div", {}, row.getValue("workHours")),
    enableSorting: true,
  },
  
];

// Helper function for status styling
const getStatusClass = (status: string) => {
  switch (status) {
    case "รอเปิดใบสั่งงาน":
      return "bg-yellow-100 text-yellow-800";
    case "ปิดใบสั่งงาน":
      return "bg-green-100 text-green-800";
    case "รอเบิกพัสดุ":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Event handlers
const handleFilterShow = () => {
  showFilterDialog.value = true;
};

const handleFilterApply = (filters: WorkerReportFilter) => {
  currentFilters.value = { ...filters };
  currentPage.value = 1;
};

const handleExport = (format: string) => {
  console.log(`Exporting to ${format}`);
  showExportDropdown.value = false; 

};

const handleDownload = (id: number) => {
  showDownloadDialog.value = true;
};

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page;
  selectedRows.value = []; 
  selectAll.value = false;
};

const handleItemsPerPageChange = (items: number) => {
  itemsPerPage.value = items;
  currentPage.value = 1;
  selectedRows.value = [];
  selectAll.value = false;
};

// Watch for data changes to update select all
watch(paginatedData, () => {
  updateSelectAll();
});

// Computed properties
const lastUpdate = computed(() => new Date());

const breadcrumbs = [
  { text: "หน้าหลัก", link: "/" },
  { text: "รายงานการปฏิบัติงาน" },
];
</script>

<template>
  <ContentContainer :breadcrumbs="breadcrumbs">
    <template #menu>
      <div class="flex flex-row gap-6"> 
       <RouterLink class="header-work-report-btn" :class="{ 'active': $route.path === '/work_report/list' }" to="/work_report/list">
          ใบสั่งงาน
        </RouterLink>

        <RouterLink class="header-work-report-btn" :class="{ 'active': $route.path === '/work_report/workerlist' }" to="/work_report/workerlist">
          ผู้ปฏิบัติงาน
        </RouterLink>
      </div>
    </template>
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            
            <input
              v-model="searchText"
              type="text"
              placeholder="ค้นหาโดย เลขที่ใบคำร้อง, เลขที่ใบสั่งงาน และการไฟฟ้า"
              class="search-input"
            />
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Filter Button -->
        <button class="filter-button" @click="handleFilterShow">
          <Filter class="filter-icon" />
        </button>
      </div>

      <!-- Work Service Checkbox Dropdown Section -->
      <div class="mb-6">
        <!-- Selected filters display -->
        <div
          v-if="selectedWorkServices.length > 0"
          class="selected-filters mb-4"
        >
          <div
            v-for="service in selectedWorkServices"
            :key="service"
            class="filter-tag"
          >
            {{ service }}
            <button
              @click="removeWorkServiceFilter(service)"
              class="remove-filter-btn"
            >
              ×
            </button>
          </div>
        </div>

        <!-- Dropdown for work services -->
        <div class="work-service-dropdown">
          <div class="dropdown-header" @click="toggleWorkServiceDropdown">
            <span>งานบริการ</span>
            <svg
              class="dropdown-arrow"
              :class="{ 'rotate-180': showWorkServiceDropdown }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div v-if="showWorkServiceDropdown" class="work-service-menu">
            <div class="menu-content">
              <div
                v-for="option in workServiceOptions"
                :key="option.value"
                class="menu-item"
              >
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    :checked="selectedWorkServices.includes(option.value)"
                    @change="
                      (e) =>
                        handleWorkServiceChange(
                          option.value,
                          (e.target as HTMLInputElement).checked,
                        )
                    "
                    class="checkbox-input"
                  />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Cards Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <CardWorkReport
        title="ใบสั่งงาน"
        :count="120"
        unit="ใบ"
        backgroundColor="#ffffff"
      />
      <CardWorkReport
        title="ใบสั่งงานใหม่"
        :count="60"
        icon="/assets/images/assignment_add.png"
        unit="ใบ"
        backgroundColor="#E4F3FF"
      />
      <CardWorkReport
        title="ระหว่างดำเนินงาน"
        :count="30"
        icon="/assets/images/sync.png"
        unit="งาน"
        backgroundColor="#FBD59B"
      />
      <CardWorkReport
        title="ดำเนินงานเสร็จสิ้น"
        :count="30"
        icon="/assets/images/check_circle.png"
        unit="งาน"
        backgroundColor="#69CDAC"
      />
      <CardTotalWorkReport :total="120" :completed="30" />
    </div>

    <!-- Charts Section -->
    <div class="flex flex-col gap-8 mb-8">
      <!-- All Reports Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <AllReportsChart />
      </div>

      <!-- Working Hours Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <WorkingHoursChart />
      </div>
    </div>

    <!-- Export Section -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-end mb-4">
        <div class="export-dropdown-container">
          <div class="export-dropdown-header" @click="toggleExportDropdown">
            <img src="/assets/images/export-icon.png" alt="" class="w-5 h-6" />

            <span>Export</span>
            <svg
              class="export-dropdown-arrow"
              :class="{ 'rotate-180': showExportDropdown }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div v-if="showExportDropdown" class="export-dropdown-menu">
            <div class="export-menu-content">
              <div
                v-for="option in exportOptions"
                :key="option.value"
                class="export-menu-item"
                @click="handleExport(option.value)"
              >
                <span class="export-option-label">{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div>
        <DataTable
          :columns="columns"
          :data="paginatedData"
          :show-search="false"
          :show-filter="false"
          :show-pagination="false"
        />

        <!-- Custom Row Pagination -->
        <RowPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          @update:current-page="handlePageChange"
          @update:items-per-page="handleItemsPerPageChange"
        />
      </div>
    </div>
    <!-- Filter Dialog -->
    <WorkerReportFilter 
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />

    <!-- Download Confirmation Dialog -->
    <DownloadConfirmDialog v-model="showDownloadDialog" />
  </ContentContainer>
</template>

