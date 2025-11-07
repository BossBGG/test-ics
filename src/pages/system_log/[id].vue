<!-- src/pages/systemlog/[id].vue -->
<script setup lang="ts">
import { computed, h, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ColumnDef } from "@tanstack/vue-table";
import type { SystemLogDataDetail } from "~/data/systemLogData";
import { logTypeOptions } from "~/data/systemLogData";
import ContentContainer from "~/layouts/ContentContainer.vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import DataTable from "~/components/form/DataTable.vue";
import type {
  SystemLogDetailResponseDto,
  SystemLogResponseDto,
} from "~/api/systemLog_api";
import {
  getSystemLogDetail,
  getSystemLogDetailList,
} from "~/api/systemLog_api";
import { dateTimeFormatThaiMonth } from "~/composables/datetime";
import type { Option } from "~/api/types";

// Get route params
const route = useRoute();
const router = useRouter();
const systemLogId = (() => {
  const params = route.params as { id?: string | string[] };
  const id = params.id;
  return Array.isArray(id) ? id[0] : id || "";
})();

// Reactive data
const logData = ref<SystemLogResponseDto>({} as SystemLogResponseDto);
const logType = ref<Option[]>([]);
const logDataDetail = ref<SystemLogDataDetail[]>([]);

// Fetch log data
onMounted(async () => {
  try {
    showProgress();
    const response = await getSystemLogDetail(systemLogId);

    if (response.data?.statusCode === 200 && response.data.data) {
      logData.value = response.data.data as SystemLogResponseDto;
      logType.value = logTypeOptions.filter(
        (type) =>
          type.value.toLowerCase() === logData.value.logType?.toLowerCase(),
      );
    } else {
      showError(response.data?.message || "ไม่พบข้อมูล System Log").then(
        (res) => {
          handleBack();
        },
      );
    }
  } catch (error: any) {
    console.error("Error fetching system log:", error);
    showError(error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล").then((res) => {
      handleBack();
    });
  }
});

// Computed properties
const breadcrumbs = computed(() => [
  { text: "หน้าหลัก", link: "/" },
  { text: "System Log", link: "/system_log/list" },
  { text: "รายละเอียด" },
]);

// Event handlers
function handleBack() {
  router.push("/system_log/list");
}

const columns: ColumnDef<SystemLogDetailResponseDto>[] = [
  {
    accessorKey: "id",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ลำดับที่" }),
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
    enableSorting: false,
  },
  {
    accessorKey: "attributeName",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ชื่อฟิลด์" }),
    cell: ({ row }) => {
      const data = row.original;
      return h(
        "div",
        { class: "text-sm text-gray-500" },
        data.attributeName || "-",
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "fromValue",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: "รายละเอียดเพิ่มเติม (ข้อมูลเดิม)",
      }),
    cell: ({ row }) => {
      const data = row.original;
      return h("div", { class: "text-gray-600" }, data.fromValue || "-");
    },
  },
  {
    accessorKey: "toValue",
    header: ({ column }) =>
      h(DataTableColumnHeader, {
        column,
        title: "รายละเอียดเพิ่มเติม (ข้อมูลใหม่)",
      }),
    cell: ({ row }) => {
      const data = row.original;
      return h(
        "div",
        { class: "text-gray-900 font-medium" },
        data.toValue || "-",
      );
    },
  },
];
</script>

<template>
  <ContentContainer :breadcrumbs="breadcrumbs">
    <div class="space-y-6">
      <!-- Log Detail Cards -->
      <div class="border rounded-lg bg-white shadow-sm">
        <div class="rounded-t-lg bg-[#69306D] px-6 py-4 text-white">
          <h4 class="flex items-center">ประเภทข้อมูล</h4>
        </div>
        <div class="grid grid-cols-4 gap-4 bg-[#DBDADC] p-6 lg:grid-cols-4">
          <div class="rounded-sm bg-[#FFF]">
            <div class="m-4">
              <label class="text-sm">ผู้ใช้งาน:</label>
              <div class="mt-1 flex items-center space-x-2">
                <span class="font-medium">{{ logData.username }}</span>
                <!--                <span class="font-medium">{{ logData.userFirstName }} {{logData.userLastName}}</span> -->
              </div>
            </div>
          </div>
          <div class="rounded-sm bg-[#FFF]">
            <div class="m-4">
              <label class="text-sm text-gray-600 font-medium"
                >ประเภท System Log:</label
              >
              <div class="mt-1 flex items-center space-x-2">
                <span class="font-medium">{{
                  logType.length > 0 ? logType[0]?.label : "-"
                }}</span>
              </div>
            </div>
          </div>
          <div class="rounded-sm bg-[#FFF]">
            <div class="m-4">
              <label class="text-sm text-gray-600 font-medium"
                >รายละเอียดเหตุการณ์:</label
              >
              <p class="font-medium">
                {{ logData.detail }}
              </p>
            </div>
          </div>
          <div class="rounded-sm bg-[#FFF]">
            <div class="m-4">
              <label class="text-sm text-gray-600 font-medium">วันที่:</label>
              <div class="mt-1 flex items-center space-x-2">
                <span>{{
                  dateTimeFormatThaiMonth(new Date(logData.createdAt)) || "-"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Detailed Description -->
      <div class="border rounded-lg bg-white shadow-sm">
        <div class="rounded-t-lg bg-[#69306D] px-6 py-4 text-white">
          <h4 class="text-lg font-semibold">รายละเอียด</h4>
        </div>
        <div class="bg-[#DBDADC] p-6">
          <div class="rounded-lg bg-[#FFF]">
            <DataTable
              :columns="columns"
              :data="logDataDetail"
              :show-search="false"
              :show-filter="false"
              :table-api-data="[]"
              :table-api="getSystemLogDetailList(systemLogId)"
            />
          </div>
        </div>
      </div>
    </div>
  </ContentContainer>
</template>

<style scoped>
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}
</style>
