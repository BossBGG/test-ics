<!-- src/pages/system_log/list.vue -->
<script setup lang="ts">
import { computed, h, ref } from "vue";
import { useRouter } from "vue-router";
import type { ColumnDef } from "@tanstack/vue-table";
import { logTypeOptions } from "~/data/systemLogData";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "@/components/form/DataTableColumnHeader.vue";
import SystemLogFilterDialog from "@/components/dialog/SystemLogFilterDialog.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import type { SystemLogResponseDto } from "~/api/systemLog_api";
import { getSystemLogList } from "~/api/systemLog_api";
import {
  convertTimeFormat,
  dateFormatBy,
  thaiFormatDate,
  toTimestamp,
} from "~/composables/datetime";

const router = useRouter();

// Reactive data
const showFilterDialog = ref(false);
const currentFilters = ref({
  from: "",
  to: "",
  level: "",
});

const system_log_list_ref = ref();

// Column definitions
const columns: ColumnDef<SystemLogResponseDto>[] = [
  {
    accessorKey: "id",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ลำดับ" }),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return h(
        "div",
        { class: "text-center" },
        pageIndex * pageSize + (row.index + 1),
      );
    },
    enableSorting: false,
    size: 45,
    minSize: 45,
    maxSize: 45,
  },
  {
    accessorKey: "datetime",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "วันที่" }),
    cell: ({ row }) => {
      const data = row.original;
      const created_at = new Date(data.createdAt);

      return h("div", { class: "" }, [
        h("div", { class: "" }, thaiFormatDate(created_at)),
        h("div", { class: "text-gray-500" }, convertTimeFormat(created_at)),
      ]);
    },
    enableSorting: true,
    size: 105,
    minSize: 105,
    maxSize: 105
  },
  {
    accessorKey: "level",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ประเภท (System Log)" }),
    cell: ({ row }) => {
      const data = row.original as SystemLogResponseDto;
      const log_type = logTypeOptions.filter(
        (type) => type.value.toLowerCase() === data.logType?.toLowerCase(),
      );
      let [type, name] = ["", ""];
      if (log_type.length > 0) {
        [type, name] = log_type[0].label.split(" ");
      }

      return h("div", { class: "" }, [
        h("div", { class: "" }, type),
        h("div", { class: "text-gray-500" }, name),
      ]);
    },
    enableSorting: true,
    size: 140,
    minSize: 140,
    maxSize: 140
  },
  {
    id: "username",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ผู้ใช้งาน" }),
    cell: ({ row }) => {
      const name = `${row.original.userFirstName} ${row.original.userLastName}`
      if(row.original.userFirstName) {
        return h("div", { class: "flex items-center space-x-3 truncate" }, [
          h("div", {class: "w-[24px] h-[24px] border-1 rounded-full overflow-hidden bg-grey"}, [
            h("img", {
              src: row.original.userProfileImageUrl || '/assets/images/user.png',
              alt: "profile image",
              className: "w-full h-full object-cover"
            })
          ]),
          h("div", name)
        ]);
      }else {
        return '-'
      }
    },
    enableSorting: false,
    size: 100,
    minSize: 100,
    maxSize: 100
  },
  {
    accessorKey: "detail",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "รายละเอียดเหตุการณ์" }),
    cell: ({ row }) => {
      const detail = row.getValue("detail") as string;
      return h("div", { class: "max-w-xs truncate", title: detail }, detail);
    },
    enableSorting: false,
    size: 200,
    minSize: 200,
    maxSize: 200
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "IP Address" }),
    cell: ({ row }) => {
      const ipAddress = row.getValue("ipAddress") as string;
      return h("div", { class: "font-mono" }, ipAddress);
    },
    enableSorting: true,
    size: 70,
    minSize: 70,
    maxSize: 70
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-center w-full" }, ""),
    cell: ({ row }) => {
      const item = row.original;

      return h("div", { class: "flex justify-center" }, [
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
    size: 45,
    minSize: 45,
    maxSize: 45
  },
];

// Event handlers
function handleFilterShow() {
  showFilterDialog.value = true;
}

function handleFilterApply(filters: {
  startDate: string;
  endDate: string;
  level: string;
}) {
  currentFilters.value = {
    from: filters.startDate
      ? dateFormatBy(toTimestamp(filters.startDate), "YYYY-MM-DD")
      : "",
    to: filters.endDate
      ? dateFormatBy(toTimestamp(filters.endDate), "YYYY-MM-DD")
      : "",
    level: filters.level || "",
  };
  system_log_list_ref.value.refresh();
}

function handleViewDetails(uuid: string) {
  router.push(`/system_log/${uuid}`);
}

// Computed properties
const lastUpdate = computed(() => new Date().toISOString());

const breadcrumbs = [{ text: "หน้าหลัก", link: "/" }, { text: "System Log" }];
</script>

<template>
  <ContentContainer :breadcrumbs="breadcrumbs" :last_update="lastUpdate">
    <!-- Data Table -->
    <DataTable
      ref="system_log_list_ref"
      :columns="columns"
      :table-api="getSystemLogList"
      :table-api-data="currentFilters"
      @show-filter="handleFilterShow"
    />

    <!-- Filter Dialog -->
    <SystemLogFilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />
  </ContentContainer>
</template>
