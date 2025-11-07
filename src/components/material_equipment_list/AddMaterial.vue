<!-- src/components/material_equipment_list/AddMaterial.vue -->
<script setup lang="ts">
import { ref, h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Trash2, Edit, Save, Pencil } from "lucide-vue-next";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import DataTableEditor from "~/components/form/DataTableEditor.vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import InputSelect from "~/components/ui/table-editor/InputSelect.vue";
import QInputMaterial from "~/components/material_equipment_list/QInputMaterial.vue";
import {
  Option,
  MaterialEquipmentObj,
  MaterialMaster,
  WorkOrderObj,
  Options,
} from "~/api/types";
import "@/styles/add-material.css";
import { getMaterialMaster } from "~/api/material_equipment_api";
import AddMaterialDialog from "~/components/material_equipment_list/AddMaterialDialog.vue";

interface Props {
  data: WorkOrderObj;
}
const props = defineProps<Props>();
const materialData = ref<MaterialEquipmentObj[]>([]);
const materialEditorRef = ref();
const remoteMaterials = ref<MaterialMaster[]>([]);
const materialCodeOptions = ref<Option[]>([]);
const materialNameOptions = ref<Option[]>([]);
const showAddDialog = ref(false);
const isDisabled = computed(() => props.data?.workOrderStatusCode !== "W");
const emits = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

watch(
  () => materialData.value,
  () => {
    emits("update:data", {
      ...props.data,
      equipments: materialData.value,
    });
  },
  { deep: true },
);

onMounted(() => {
  const initialEquipments = props.data.equipments || [];
  materialData.value = initialEquipments;

  if (materialEditorRef.value) {
    materialEditorRef.value.setData(initialEquipments);
  }

  fetchMaterialMaster("", true, true);
});

async function fetchMaterialMaster(
  search: string = "",
  is_fetch_code: boolean = false,
  is_fetch_name: boolean = false,
) {
  await getMaterialMaster(search).then((res) => {
    if (res.data.data) {
      remoteMaterials.value = res.data.data || [];
      if (is_fetch_code) {
        materialCodeOptions.value = remoteMaterials.value.map(
          (o: MaterialMaster) => ({
            label: o.code,
            value: o.code,
          }),
        ) as Option[];
      }

      if (is_fetch_name) {
        materialNameOptions.value = remoteMaterials.value.map(
          (o: MaterialMaster) => ({
            label: o.name,
            value: o.name,
          }),
        ) as Option[];
      }
    }
  });

  return remoteMaterials.value;
}

// const addMaterial = () => {
//   const newMaterial = {
//     isUpdate: true,
//     availableStock: 0,
//   } as MaterialEquipmentObj;

//   materialData.value = [...materialData.value, newMaterial];
//   materialEditorRef.value?.setData(materialData.value);
//   setTimeout(() => {
//     materialEditorRef.value.setLastPageIndex();
//   }, 200);
// };

const handleAddedMaterial = (newMaterials: MaterialEquipmentObj[]) => {
  if(!newMaterials) {
    return;
  }

  const materialsToAdd = newMaterials.map(material => ({
    ...material,
    id: material.id || 0,
    isUpdate: false,
    availableStock: material.availableStock || 0,
    quantity: material.quantity || 0,
    price: material.price || "0.00",
  }));

  materialData.value = [...materialData.value , ...materialsToAdd];
  materialEditorRef.value?.setData(materialData.value);

  setTimeout(() => {
    materialEditorRef.value?.setLastPageIndex();
  }, 200)
}


const removeMaterial = (index: number) => {
  materialEditorRef.value?.removeData(index);
  materialData.value = materialEditorRef.value?.getData() || [];
};

const saveMaterial = (index: number) => {
  const material = materialData.value[index];
  if (material && material.code && material.name && material.quantity > 0) {
    materialEditorRef.value?.updateData(index, "isUpdate", false);
    materialData.value = materialEditorRef.value?.getData() || [];
  } else {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
  }
};

const editMaterial = (index: number) => {
  materialEditorRef.value?.updateData(index, "isUpdate", true);
  materialData.value = materialEditorRef.value?.getData() || [];
};

const updateMaterialCode = (index: number, value: string) => {
  materialEditorRef.value?.updateData(index, "code", value);

  const selectedMaterial = remoteMaterials.value.find(
    (item) => item.code == value,
  );
  if (selectedMaterial) {
    materialEditorRef.value?.updateData(index, "name", selectedMaterial.name);
    materialEditorRef.value?.updateData(index, "unit", selectedMaterial.unit);
    materialEditorRef.value?.updateData(
      index,
      "availableStock",
      selectedMaterial.availableStock || 0, //stock
    );
  }

  materialData.value = materialEditorRef.value?.getData() || [];
};

const updateEquipmentName = (index: number, value: string) => {
  materialEditorRef.value?.updateData(index, "name", value);

  const selectedMaterial = remoteMaterials.value.find(
    (item) => item.name === value,
  );
  if (selectedMaterial) {
    materialEditorRef.value?.updateData(index, "code", selectedMaterial.code);
    materialEditorRef.value?.updateData(index, "unit", selectedMaterial.unit);
    materialEditorRef.value?.updateData(
      index,
      "availableStock",
      selectedMaterial.availableStock || 0, //stock
    );
  }

  materialData.value = materialEditorRef.value?.getData() || [];
};

const clearAllData = () => {
  materialData.value = [];
  materialEditorRef.value?.setData([]);
};

const columns: ColumnDef<MaterialEquipmentObj>[] = [
  {
    accessorKey: "id",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ลำดับ" }),
    cell: ({ row }) =>
      h("div", { class: "text-center font-semibold" }, `${row.index + 1}.`),
    size: 80,
  },
  {
    accessorKey: "code",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "รหัสวัสดุ" }),
    cell: ({ row }) => {
      const material = row.original;

      if (material.isUpdate) {
        return h(InputSelect, {
          modelValue: material.code,
          options: materialCodeOptions.value,
          placeholder: "เลือกรหัสวัสดุ",
          key: `${row.index}_material_code`,
          disabled: isDisabled.value,
          onUpdate: (value: Options) =>
            updateMaterialCode(row.index, value.value as string),
          onOpen: () => {
            fetchMaterialMaster("", true, false);
          },
          onChange: (value: string) => {
            fetchMaterialMaster(value, true, false);
          },
        });
      }
      return h("span", material.code || "ยังไม่ได้เลือก");
    },
    maxSize: 150,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "ชื่ออุปกรณ์" }),
    cell: ({ row }) => {
      const material = row.original;

      if (material.isUpdate) {
        return h(InputSelect, {
          modelValue: material.name,
          options: materialNameOptions.value,
          placeholder: "เลือกชื่ออุปกรณ์",
          key: `${row.index}_equipment_name`,
          disabled: isDisabled.value,
          onUpdate: (value: Options) =>
            updateEquipmentName(row.index, value.value as string),
          onOpen: () => {
            fetchMaterialMaster("", false, true);
          },
          onChange: (value: string) => {
            fetchMaterialMaster(value, false, true);
          },
        });
      }
      return h("span", material.name || "ยังไม่ได้เลือก");
    },
    minSize: 300,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "จำนวนที่เบิก" }),
    cell: ({ row }) => {
      const material = row.original;

      if (material.isUpdate) {
        return h(QInputMaterial, {
          modelValue: material.quantity,
          placeholder: "จำนวน",
          key: `${row.index}_quantity`,
          disabled: isDisabled.value,
          onUpdate: (value: number) => {
            materialEditorRef.value?.updateData(
              row.index,
              "quantity",
              value || 0,
            );
            materialData.value = materialEditorRef.value?.getData() || [];
          },
        });
      }
      return h("div", { class: "text-center" }, material.quantity?.toString());
    },
    maxSize: 120,
  },
  {
    accessorKey: "availableStock",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "จำนวนคงเหลือ" }),
    cell: ({ row }) => {
      const material = row.original;
      return h(
        "div",
        { class: "text-center" },
        material.availableStock?.toString() || 0,
      );
    },
    maxSize: 120,
  },
  {
    accessorKey: "unit",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "หน่วย" }),
    cell: ({ row }) => {
      const material = row.original;
      return h("div", { class: "text-center" }, material.unit || "-");
    },
    maxSize: 100,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const material = row.original;
      const index = row.index;

      const buttons = [];

      if (material.isUpdate) {
        buttons.push(
          h(
            "button",
            {
              class: "p-2 hover:bg-gray-100 rounded",
              title: "บันทึก",
              disabled: isDisabled.value,
              onClick: () => saveMaterial(index),
            },
            h(Save, { size: 18, class: "text-[#994C80] cursor-pointer" }),
          ),
        );
      } else {
        buttons.push(
          h(
            "button",
            {
              class: "p-2 hover:bg-gray-100 rounded",
              title: "แก้ไข",
              disabled: isDisabled.value,
              onClick: () => editMaterial(index),
            },
            h(Pencil, { size: 18, class: "text-[#994C80] cursor-pointer" }),
          ),
        );
      }

      buttons.push(
        h(
          "button",
          {
            class: "p-2 hover:bg-gray-100 rounded",
            title: "ลบรายการ",
            disabled: isDisabled.value,
            onClick: () => removeMaterial(index),
          },
          h(Trash2, { size: 18, class: "text-[#994C80] cursor-pointer" }),
        ),
      );

      return h(
        "div",
        { class: "flex gap-2 justify-center cursor-pointer" },
        buttons,
      );
    },
    maxSize: 80,
  },
];
</script>

<template>
  <CardCollapse title="รายการวัสดุอุปกรณ์" icon="/assets/images/doc.png">
    <div>
      <DataTableEditor ref="materialEditorRef" :columns="columns"  :data="materialData"/>

      <!-- Bottom Action Buttons -->
      <div class="flex justify-end gap-3 mt-2">
        <button
          class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white"
          @click="clearAllData"
          :disabled="isDisabled"
        >
          <q-icon name="delete_outline" size="sm" />
          ลบทั้งหมด
        </button>

        <button
          class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white"
          @click="showAddDialog = true"
          :disabled="isDisabled"
        >
          <q-icon name="add" size="sm" />
          เพิ่มรายการ
        </button>
      </div>
    </div>
  </CardCollapse>

  <AddMaterialDialog 
  v-model="showAddDialog"
  :existing-materials="materialData"
  :office="props.data.office"
  @add-materials="handleAddedMaterial"
  />
</template>
