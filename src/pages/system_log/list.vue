<!-- src/pages/system_log/list.vue -->
<script setup lang="ts">
import {computed, h, ref} from "vue";
import {useRouter} from "vue-router";
import type {ColumnDef} from "@tanstack/vue-table";
import {logTypeOptions} from "~/data/systemLogData";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "@/components/form/DataTableColumnHeader.vue";
import SystemLogFilterDialog from "@/components/dialog/SystemLogFilterDialog.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import {getSystemLogList, SystemLogResponseDto} from "~/api/systemLog_api";
import {convertTimeFormat, thaiFormatDate} from "~/composables/datetime";

const router = useRouter();

// Reactive data
const showFilterDialog = ref(false);
const errorMessage = ref("");
const currentFilters = ref({
  startDate: "",
  endDate: "",
  level: ""
});

const system_log_list_ref = ref()

// Column definitions
const columns: ColumnDef<SystemLogResponseDto>[] = [
  {
    accessorKey: "id",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "ลำดับ"}),
    cell: ({row}) => h("div", {class: "text-center"}, row.index + 1),
    enableSorting: true,
  },
  {
    id: "datetime",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "วันที่"}),
    cell: ({row}) => {
      const data = row.original;
      const created_at = new Date(data.createdAt)

      return h("div", {class: ""}, [
        h("div", {class: ""}, thaiFormatDate(created_at)),
        h("div", {class: "text-gray-500"}, convertTimeFormat(created_at)),
      ]);
    },
    enableSorting: true,
  },
  {
    accessorKey: "level",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "ประเภท (System Log)"}),
    cell: ({row}) => {
      const data = row.original as SystemLogResponseDto;
      const log_type = logTypeOptions.filter((type) => type.value.toLowerCase() === data.logType?.toLowerCase())
      let [type, name] = ['', '']
      if (log_type.length > 0) {
        [type, name] = log_type[0].label.split(' ')
      }

      return h("div", {class: ""}, [
        h("div", {class: ""}, type),
        h("div", {class: "text-gray-500"}, name),
      ]);
    },
    enableSorting: true,
  },
  {
    id: "username",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "ผู้ใช้งาน"}),
    cell: ({row}) => {
      return h("div", {class: "flex items-center space-x-3"}, [
        h("div", {class: ""}, row.original.username || '-'),
        // h("div", {class: ""}, `${row.original.userFirstName} ${row.original.userLastName}` || '-'),
      ]);
    },
    enableSorting: false,
  },
  {
    accessorKey: "detail",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "รายละเอียดเหตุการณ์"}),
    cell: ({row}) => {
      const detail = row.getValue("detail") as string;
      return h("div", {class: "max-w-xs truncate", title: detail}, detail);
    },
    enableSorting: false,
  },
  {
    accessorKey: "ipAddress",
    header: ({column}) =>
      h(DataTableColumnHeader, {column, title: "IP Address"}),
    cell: ({row}) => {
      const ipAddress = row.getValue("ipAddress") as string;
      return h("div", {class: "font-mono"}, ipAddress);
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => h("div", {class: "text-center w-full"}, ""),
    cell: ({row}) => {
      const item = row.original;

      return h("div", {class: "flex justify-center"}, [
        h(
          "button",
          {
            class: "p-1 hover:opacity-80 transition-opacity cursor-pointer",
            onClick: () => handleViewDetails(item.uuid || item.id.toString()),
            title: "ดูรายละเอียด",
          },
          [
            h("img", {
              src: "/assets/images/view-button.png",
              alt: "ดูรายละเอียด",
              class: "w-10 h-10",
            }),
          ],
        ),
      ]);
    },
    enableSorting: false,
  },
];

// Event handlers
function handleFilterShow() {
  showFilterDialog.value = true;
}

function handleFilterApply(filters: any) {
  currentFilters.value = {...filters};
  system_log_list_ref.value.refresh()
}

function handleViewDetails(uuid: string) {
  router.push(`/system_log/${uuid}`);
}

// Computed properties
const lastUpdate = computed(() => new Date().toISOString());

const breadcrumbs = [{text: "หน้าหลัก", link: "/"}, {text: "System Log"}];
</script>

<template>
  <ContentContainer :breadcrumbs="breadcrumbs" :last_update="lastUpdate">

    <!-- Data Table -->
    <DataTable
      :columns="columns"
      @show-filter="handleFilterShow"
      :table-api="getSystemLogList"
      :table-api-data="currentFilters"
      ref="system_log_list_ref"
    />

    <!-- Filter Dialog -->
    <SystemLogFilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />
  </ContentContainer>
</template>
