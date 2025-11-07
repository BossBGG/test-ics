<!-- src/pages/material_equipment/list.vue -->
<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "lucide-vue-next";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import MaterialEquipmentFilterDialog from "~/components/dialog/MaterialEquipmentFilterDialog.vue";
import AlertConfirmCancel from "~/components/alert/AlertConfirmCancel.vue";
import type { GroupMaterial } from "~/api/types";
import { Switch } from "~/components/ui/switch";
import {
  deleteGroupMaterialEquipment,
  getMaterialEquipmentApi,
  updateGroupMaterialEquipmentStatus,
} from "~/api/material_equipment_api";
import {
  showConfirm,
  showError,
  showProgress,
  showSuccess,
} from "~/composables/alert";
import { Toggle } from "~/components/ui/toggle";
import { getCurrentDateTimeYmd } from "~/composables/datetime";
import ButtonFormat from "~/components/ui/button/ฺButtonFormat.vue";

// Reactive data
const showFilterDialog = ref(false);
const showDeleteDialog = ref(false);
const uuidDeleteItem = ref<string | null>(null);
const filters = ref<{ status: string }>({
  status: "",
});
const router = useRouter();
const material_equipment_table_ref = ref();
const update_latest_at = ref<string>(getCurrentDateTimeYmd());

// Event handlers
function handleFilterShow() {
  showFilterDialog.value = true;
}

function handleFilterApply(filter: { status: string }) {
  filters.value = filter;
  material_equipment_table_ref.value.refresh();
}

function handleEdit(uuid: string) {
  router.push(`/material_equipment/${uuid}`);
}

function handleDelete(uuid: string) {
  uuidDeleteItem.value = uuid;
  showDeleteDialog.value = true;
}

async function confirmDelete(confirmed: boolean) {
  showDeleteDialog.value = false;
  if (confirmed && uuidDeleteItem.value) {
    showProgress();
    try {
      deleteGroupMaterialEquipment(uuidDeleteItem.value).then((res) => {
        if (res.status === 204) {
          showSuccess("ยกเลิกใบสั่งงานสร้างกลุ่มวัสดุและอุปกรณ์สำเร็จ").then(
            (res) => {
              material_equipment_table_ref.value.refresh();
            },
          );
        } else {
          showError(
            res.data.message ||
              "ยกเลิกใบสั่งงานสร้างกลุ่มวัสดุและอุปกรณ์ไม่สำเร็จ",
          );
        }
      });
    } catch (e) {
      console.error("Delete failed:", e);
      showError(
        e.message || "ยกเลิกใบสั่งงานสร้างกลุ่มวัสดุและอุปกรณ์ไม่สำเร็จ",
      );
    }
  }
  uuidDeleteItem.value = null;
}

async function handleToggleStatus(item: GroupMaterial) {
  let message = item.isActive ? "ปิด" : "เปิด";
  showConfirm(
    `คุณต้องการ"${message}"การใช้งานกลุ่มวัสดุอุปกรณ์นี้ใช่หรือไม่ ?`,
  ).then((isConfirm) => {
    if (isConfirm) {
      try {
        showProgress();
        updateGroupMaterialEquipmentStatus(item.uuid, !item.isActive).then(
          (res) => {
            if (res.data?.statusCode === 200) {
              showSuccess(`${message}การใช้งานกลุ่มวัสดุอุปกรณ์สำเร็จ`).then(
                (res) => {
                  material_equipment_table_ref.value.refresh();
                },
              );
            } else {
              showError(
                res.data.message ||
                  `${message}การใช้งานกลุ่มวัสดุอุปกรณ์ไม่สำเร็จ`,
              );
            }
          },
        );
      } catch (error) {
        showError(
          error.message || `${message}การใช้งานกลุ่มวัสดุอุปกรณ์ไม่สำเร็จ`,
        );
      }
    }
  });
}

// Custom Badge component
function StatusBadge({ label, variant }: { label: string; variant: string }) {
  const bgColor = variant === "active" ? "#B36E9E" : "#57595B";
  const textColor = "#ffffff";

  return h(
    "span",
    {
      class:
        "inline-flex items-center px-2.5 py-1.5 rounded-sm text-xs font-medium",
      style: {
        backgroundColor: bgColor,
        color: textColor,
        fontSize: 14,
        fontWeight: 400,
      },
    },
    label,
  );
}

const columns: ColumnDef<GroupMaterial>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ลำดับที่",
      });
    },
    cell: ({ row, table }) => {
      let pageIndex = table.getState().pagination.pageIndex;
      let pageSize = table.getState().pagination.pageSize;
      return h(
        "div",
        { class: "text-center" },
        pageIndex * pageSize + (row.index + 1),
      );
    },
    enableSorting: false,
    size: 30,
    minSize: 30,
    maxSize: 30,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ชื่อกลุ่ม",
      });
    },
    cell: ({ row }) => {
      return h("div", { class: "truncate" }, row.getValue("name"));
    },
    size: 250,
    minSize: 250,
    maxSize: 250,
  },
  {
    accessorKey: "isActive",
    header: "สถานะ",
    cell: ({ row }) => {
      const status = row.getValue("isActive") ? "active" : "inactive";
      const status_label = status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน";
      return h(StatusBadge, { label: status_label, variant: status });
    },
    enableSorting: true,
    size: 40,
    minSize: 40,
    maxSize: 40,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "เปิด/ปิดการใช้งาน",
      });
    },
    cell: ({ row }) => {
      const item = row.original;
      return h("div", { class: "flex items-center justify-center" }, [
        h(Toggle, {
          modelValue: item.isActive,
          onUpdate: () => {
            handleToggleStatus(item);
          },
        }),
      ]);
    },
    enableSorting: true,
    size: 70,
    minSize: 70,
    maxSize: 70,
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-center w-full" }, ""),
    cell: ({ row }) => {
      const uuid = row.original.uuid;
      return h(
        "div",
        {
          class:
            "flex flex-row items-center justify-center space-x-1 min-w-[80px]",
        },
        [
          h(
            "button",
            {
              class:
                "inline-flex items-center justify-center p-1 hover:opacity-80 transition-opacity cursor-pointer",
              onClick: () => handleEdit(uuid),
              title: "แก้ไข",
            },
            [
              h("img", {
                src: "/assets/images/edit-button.png",
                alt: "แก้ไข",
                class: "w-8 h-8",
              }),
            ],
          ),
          h(
            "button",
            {
              class:
                "inline-flex items-center justify-center p-1 hover:opacity-80 transition-opacity cursor-pointer",
              onClick: () => handleDelete(uuid),
              title: "ลบ",
            },
            [
              h("img", {
                src: "/assets/images/delete-button.png",
                alt: "ลบ",
                class: "w-8 h-8",
              }),
            ],
          ),
        ],
      );
    },
    enableSorting: false,
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
];
</script>

<template>
  <ContentContainer
    :breadcrumbs="[
      { text: 'หน้าหลัก' },
      { text: 'จัดการกลุ่มวัสดุและอุปกรณ์' },
    ]"
    :last_update="update_latest_at"
  >
    <data-table
      ref="material_equipment_table_ref"
      :columns="columns"
      @show-filter="handleFilterShow"
      :tableApiData="filters"
      :tableApi="getMaterialEquipmentApi"
      @update-latest-at="(val: string) => (update_latest_at = val)"
    >
      <template #create-button>
        <div class="flex items-center gap-2">
          <RouterLink class="create-button" to="/material_equipment/create">
            <Plus class="h-8 w-8" />
            สร้างกลุ่ม
          </RouterLink>
        </div>
      </template>
    </data-table>

    <!-- Filter Dialog -->
    <MaterialEquipmentFilterDialog
      v-model="showFilterDialog"
      :show-date="false"
      @apply-filters="handleFilterApply"
    />

    <!-- Delete Confirmation Dialog -->
    <AlertConfirmCancel v-model="showDeleteDialog" @confirm="confirmDelete" />
  </ContentContainer>
</template>

<style scoped>
.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #69306d;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  gap: 8px;
}

.create-button:hover {
  opacity: 0.9;
  color: #ffffff;
  text-decoration: none;
}

.create-button:active {
  background-color: #5c0f88;
}
</style>
