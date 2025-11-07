<script setup lang="ts">
import { ColumnDef } from "@tanstack/vue-table";
import {
  CompleteWorkMockData,
  type CompleteWorkData,
  getCompleteWorkApi,
} from "~/data/completeworkData";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "@/components/form/DataTableColumnHeader.vue";
import { ref, h, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Checkbox } from "@/components/ui/checkbox";
import ButtonFormat from "../ui/button/ButtonFormat.vue";
import AlertConfirmCompleteWork from "@/components/alert/AlertConfirmCompleteWork.vue";
import AlertCompleteWork from "@/components/alert/AlertCompleteWork.vue";
import AlertFailedCompleteWork from "@/components/alert/AlertFailedCompleteWork.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "complete", selectedIds: number[]): void;
}>();

const data = ref<CompleteWorkData[]>(CompleteWorkMockData);
const selectedRows = ref<number[]>([]);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const showFailedModal = ref(false);

const isAllSelected = computed(() => {
  return (
    data.value.length > 0 && selectedRows.value.length === data.value.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedRows.value.length > 0 &&
    selectedRows.value.length < data.value.length
  );
});

const mockTableApi = async (params: any) => {
  return {
    data: {
      data: {
        items: data.value,
        data: data.value,
        total: data.value.length,
        totalPages: 1,
        draw: 1,
        meta: {
          limit: data.value.length,
          page: 1,
          nextPage: null,
          previousPage: null,
          totalCount: data.value.length,
          totalPages: 1,
        },
      },
    },
  };
};

const tableApiObject = {
  callApi: async (params: any) => {
    const response = {
      data: {
        data: {
          items: data.value,
          data: data.value,
          total: data.value.length,
          totalPages: 1,
          draw: 1,
          meta: {
            limit: data.value.length,
            page: 1,
            nextPage: null,
            previousPage: null,
            totalCount: data.value.length,
            totalPages: 1,
          },
        },
      },
    };

    return {
      api: Promise.resolve(response),
      cancelToken: { cancel: () => {} },
    };
  },
};

const handleSelectAll = (selected: boolean | "indeterminate") => {
  if (selected === true) {
    // Select all items
    const allIds = data.value.map((item) => item.id);
    selectedRows.value = [...allIds];
  } else if (selected === false || selected === "indeterminate") {
    // Deselect all items
    selectedRows.value = [];
  }
};

const handleRowSelect = (id: number, selected: boolean) => {
  if (selected) {
    if (!selectedRows.value.includes(id)) {
      selectedRows.value.push(id);
    }
  } else {
    selectedRows.value = selectedRows.value.filter((rowId) => rowId !== id);
  }
};

const columns: ColumnDef<CompleteWorkData>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const checkedState = isAllSelected.value
        ? true
        : isIndeterminate.value
          ? "indeterminate"
          : false;

      return h("div", { class: "flex ml-7 items-center w-full h-full " }, [
        h(Checkbox, {
          key: `header-${selectedRows.value.length}`,
          modelValue: checkedState,
          "onUpdate:modelValue": (value: boolean | "indeterminate") => {
            handleSelectAll(value);
          },
          "aria-label": "Select all",
        }),
      ]);
    },
    cell: ({ row }) => {
      const isSelected = selectedRows.value.includes(row.original.id);

      return h(
        "div",
        { class: "flex justify-center items-center w-full h-full" },
        [
          h(Checkbox, {
            key: `row-${row.original.id}-${isSelected}`,
            modelValue: isSelected,
            "onUpdate:modelValue": (value: boolean) =>
              handleRowSelect(row.original.id, value),
            "aria-label": "Select row",
          }),
        ],
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 60,
    maxSize: 60,
  },

  {
    accessorKey: "workOrderNo",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "เลขที่ใบสั่งงาน" }),
    cell: ({ row }) => {
      return h("div", { class: "font-medium" }, row.getValue("workOrderNo"));
    },
    enableSorting: true,
  },
  {
    accessorKey: "customerRequestNo",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "เลขที่คำร้อง" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "font-medium" },
        row.getValue("customerRequestNo"),
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "serviceType",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ประเภทงานบริการ" }),
    cell: ({ row }) => h("div", {}, row.getValue("serviceType")),
    enableSorting: true,
  },
  {
    accessorKey: "workOrderType",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ประเภทในสั่งงาน" }),
    cell: ({ row }) => h("div", {}, row.getValue("workOrderType")),
    enableSorting: true,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ข้อมูลลูกค้า" }),
    cell: ({ row }) => h("div", {}, row.getValue("customerName")),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "สถานะ" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return h(
        "div",
        {
          class: `px-2 py-1 rounded text-sm font-medium`,
        },
        status,
      );
    },
    enableSorting: true,
  },
];

const handleClose = () => {
  emit("update:modelValue", false);
};

const handleComplete = () => {
  showConfirmModal.value = true;
};

const onConfirmComplete = () => {
  const isSuccess = true;

  try {
    if (!isSuccess) {
      throw new Error("Simulated API Error");
    }
    emit("complete", selectedRows.value);
    handleClose();
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Failed to complete work:", error);
    showFailedModal.value = true;
  }
};

const onFinalAlertClose = () => {
  selectedRows.value = [];
};
</script>

<template>
  <q-dialog :model-value="props.modelValue" @update:model-value="handleClose">
    <q-card class="w-full max-w-4xl" style="min-width: 80vw">
      <q-bar class="bg-[#69306D] text-white p-2 h-[48px]">
        <img src="/assets/images/doc.png" alt="icon" class="w-5 h- mx-4" />
        <span class="text-xl font-medium">เลือกใบสั่งงานเพื่อจบงาน</span>
      </q-bar>

      <q-card-section class="p-4">
        <div class="border rounded-md">
          <DataTable
            :columns="columns"
            :table-api="tableApiObject"
            :show-search="false"
            :show-filter="false"
            :show-pagination="false"
            :show-size-per-page="false"
          />
        </div>
      </q-card-section>

      <q-card-actions class="flex justify-center gap-2 p-4 bg-gray-50">
        <div class="flex justify-end gap-2 p-4 bg-gray-50">
          <ButtonFormat format="close" @click="handleClose" />
          <ButtonFormat format="finishedwork" @click="handleComplete" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <AlertConfirmCompleteWork
    v-model="showConfirmModal"
    :count="selectedRows.length"
    @confirm="onConfirmComplete"
  />

  <AlertCompleteWork
    v-model="showSuccessModal"
    :count="selectedRows.length"
    @update:model-value="onFinalAlertClose"
  />

  <AlertFailedCompleteWork v-model="showFailedModal" />
</template>

<style scoped>
:deep([data-slot="checkbox"][data-state="checked"]),
:deep(.checkbox-root[data-state="checked"]),
:deep([data-state="checked"]),
:deep(.checkbox[data-state="checked"]),
:deep(input[type="checkbox"]:checked + *),
:deep(.ui-checkbox[data-state="checked"]) {
  background-color: #a64682 !important;
  border-color: #a64682 !important;
}

:deep([data-slot="checkbox"][data-state="checked"]:hover),
:deep(.checkbox-root[data-state="checked"]:hover),
:deep([data-state="checked"]:hover),
:deep(.checkbox[data-state="checked"]:hover),
:deep(.ui-checkbox[data-state="checked"]:hover) {
  background-color: #8b3a6e !important;
  border-color: #8b3a6e !important;
}

:deep([data-slot="checkbox"]),
:deep(.checkbox-root),
:deep(.checkbox),
:deep(.ui-checkbox) {
  border-color: #a64682 !important;
}

:deep([data-slot="checkbox"]:hover),
:deep(.checkbox-root:hover),
:deep(.checkbox:hover),
:deep(.ui-checkbox:hover) {
  border-color: #a64682 !important;
}

:deep(button[role="checkbox"][data-state="checked"]) {
  background-color: #a64682 !important;
  border-color: #a64682 !important;
}

:deep(button[role="checkbox"][data-state="checked"]:hover) {
  background-color: #8b3a6e !important;
  border-color: #8b3a6e !important;
}

:deep(button[role="checkbox"]) {
  border-color: #a64682 !important;
}

:deep(button[role="checkbox"]:hover) {
  border-color: #a64682 !important;
}
</style>
