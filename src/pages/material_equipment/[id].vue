<!-- src/pages/news/list.vue -->
<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { computed, h, onMounted, ref } from "vue";
import { Plus, Save, Trash2 } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { QIcon, QInput, QSelect } from "quasar";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import AlertConfirmSave from "~/components/alert/AlertConfirmSave.vue";
import AlertMaterialSuccess from "~/components/alert/AlertMaterialSuccess.vue";
import type {
  GroupMaterial,
  MaterialEquipment,
  MaterialMaster,
  Option,
  addMaterialType,
  updateMaterialType,
} from "~/api/types";
import {
  createGroupMaterialEquipment,
  getGroupMaterialEquipmentById,
  getMaterialEquipmentApi,
  getMaterialEquipmentById,
  getMaterialMaster,
  updateGroupMaterialEquipment,
} from "~/api/material_equipment_api";
import {
  dismissPopup,
  showError,
  showProgress,
  showSuccess,
} from "~/composables/alert";

const router = useRouter();
const route = useRoute();
const isCreateMode = computed(() => String(route.params.id) === "create");
const showConfirmSave = ref(false);
const showSuccessAlert = ref(false);
const group_material = ref<GroupMaterial>({} as GroupMaterial);
const materialItems = ref<MaterialEquipment[]>([]);
const removedMaterialIds = ref<number[]>([]);
const remoteMaterials = ref<MaterialMaster[]>([]);
const materialCodeOptions = ref<Option[]>([]);
const materialNameOptions = ref<Option[]>([]);
const material_equipment_editor_ref = ref();
const uuid = route.params.id as string;

onMounted(async () => {
  showProgress();
  Promise.all([await fetchMaterialMaster(), await fetchGroup()]).then(
    ([resMaster, resGroup]) => {
      dismissPopup();
    },
  );
});

async function fetchMaterialMaster(search = "") {
  await getMaterialMaster().then((res) => {
    if (res.data.success) {
      remoteMaterials.value = res.data.data || [];
      materialCodeOptions.value = remoteMaterials.value.map(
        (o: MaterialMaster) => ({
          label: o.code,
          value: o.code,
        }),
      ) as Option[];

      materialNameOptions.value = remoteMaterials.value.map(
        (o: MaterialMaster) => ({
          label: o.name,
          value: o.name,
        }),
      ) as Option[];
    }
  });

  return remoteMaterials.value;
}

async function fetchGroup() {
  if (uuid === "create" && isCreateMode.value) return [];

  await getGroupMaterialEquipmentById(uuid).then((res) => {
    if (res.data.success) {
      group_material.value = res.data.data as GroupMaterial;
      materialItems.value = res.data.data?.materialAndEquipment || [];
      material_equipment_editor_ref.value.setData(materialItems.value);

      materialItems.value.map((mat) => {
        const codeItem = materialCodeOptions.value.filter(
          (m) => m.code === mat.code,
        );
        if (codeItem.length === 0) {
          materialCodeOptions.value.push({ value: mat.code, label: mat.code });
        }

        const nameItem = materialCodeOptions.value.filter(
          (m) => m.name === mat.name,
        );
        if (nameItem.length === 0) {
          materialNameOptions.value.push({ value: mat.name, label: mat.name });
        }
      });
    }
  });

  return materialItems.value;
}

function handleUpdateData(index: number, key: string, val: string | number) {
  material_equipment_editor_ref.value.updateData(index, key, val);
  if (key === "code") {
    const mat = remoteMaterials.value.filter((mat) => mat.code === val);
    material_equipment_editor_ref.value.updateData(index, "name", mat[0]?.name);
    material_equipment_editor_ref.value.updateData(index, "unit", mat[0]?.unit);
  } else if (key === "name") {
    const mat = remoteMaterials.value.filter((mat) => mat.name === val);
    material_equipment_editor_ref.value.updateData(index, "code", mat[0]?.code);
    material_equipment_editor_ref.value.updateData(index, "unit", mat[0]?.unit);
  }

  materialItems.value = material_equipment_editor_ref.value.getData();
}

async function saveGroup() {
  showProgress();
  isCreateMode.value ? await createGroup() : await updateGroup();
}

async function createGroup() {
  const materialsDto: addMaterialType[] = [];
  materialItems.value.map((mat) => {
    const item = {
      name: mat.name,
      code: mat.code,
      quantity:
        typeof mat.quantity === "string"
          ? Number.parseInt(mat.quantity)
          : mat.quantity,
      unit: mat.unit,
      isActive: mat.is_active,
    } as addMaterialType;

    materialsDto.push(item);
  });

  const payload = {
    name: group_material.value.name || "",
    isActive: true,
    materialAndEquipment: materialsDto,
  };

  await createGroupMaterialEquipment(payload).then((res) => {
    if (res.data.success) {
      dismissPopup();
      showSuccessAlert.value = true;
    } else {
      showError(res.data.message || "");
    }
  });
}

async function updateGroup() {
  const addMaterials: addMaterialType[] = [];
  const updateMaterials: updateMaterialType[] = [];

  materialItems.value.map((mat) => {
    const item = {
      name: mat.name,
      code: mat.code,
      quantity:
        typeof mat.quantity === "string"
          ? Number.parseInt(mat.quantity)
          : mat.quantity,
      unit: mat.unit,
      isActive: mat.is_active,
    };

    if (!mat.id) {
      addMaterials.push(item as addMaterialType);
    } else {
      updateMaterials.push({ id: mat.id, ...item } as updateMaterialType);
    }
  });

  const payload = {
    name: group_material.value.name,
    isActive: group_material.value.isActive,
    addMaterials,
    updateMaterials,
    removeMaterialIds: removedMaterialIds.value,
  };

  try {
    await updateGroupMaterialEquipment(uuid, payload).then((res) => {
      if (res.data.success) {
        dismissPopup();
        showSuccessAlert.value = true;
      } else {
        showError(res.data.message || "");
      }
    });
  } catch (error) {}
}

function handleSubmit() {
  if (!group_material.value.name) {
    showError("กรุณาตั้งชื่อกลุ่มวัสดุและอุปกรณ์");
    return;
  }

  if (materialItems.value.length === 0) {
    showError("กรุณาเพิ่มอุปกรณ์");
    return;
  }

  // Show confirmation dialog
  showConfirmSave.value = true;
}

function handleConfirmSave(confirmed: boolean) {
  showConfirmSave.value = false;
  if (confirmed) {
    saveGroup();
  }
}

function handleSuccessClose(value: boolean) {
  if (!value) {
    router.push("/material_equipment/list");
  }
}

function addNewMaterialRow() {
  const data = material_equipment_editor_ref.value.getData();
  materialItems.value = [
    ...data,
    {
      id: 0,
      status: "active",
      is_active: true,
      is_update: false,
      is_edited: true,
    } as MaterialEquipment,
  ];

  material_equipment_editor_ref.value.setData(materialItems.value);
}

function removeMaterialRowAt(index: number, id: number) {
  material_equipment_editor_ref.value.removeData(index);
  materialItems.value = material_equipment_editor_ref.value.getData();
  if (id) {
    removedMaterialIds.value.push(id);
  }
}

function toggleEditMaterialRow(index: number, is_edited: boolean) {
  material_equipment_editor_ref.value.updateData(index, "is_edited", is_edited);
  materialItems.value = material_equipment_editor_ref.value.getData();
}

const columns: ColumnDef<MaterialEquipment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ลำดับที่",
      });
    },
    cell: ({ row }) => h("div", { class: "text-center" }, row.index + 1),
    enableSorting: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "รหัสวัสดุ",
      });
    },
    cell: ({ row }) => {
      const item: any = row.original as any;
      if (item.is_edited) {
        return h(QSelect, {
          modelValue: item.code,
          options: materialCodeOptions.value,
          outlined: true,
          useInput: true,
          fillInput: true,
          hideSelected: true,
          inputDebounce: 0,
          emitValue: true,
          mapOptions: true,
          placeholder: "รหัสวัสดุ",
          // onFilter: fetchMaterialMaster
          "onUpdate:modelValue": (val: string) =>
            handleUpdateData(row.index, "code", val),
        });
      } else {
        return h("div", { class: "text-left" }, item.code || "");
      }
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ชื่ออุปกรณ์",
      });
    },
    cell: ({ row }) => {
      const item = row.original;
      if (item.is_edited) {
        return h(QSelect, {
          modelValue: item.name,
          options: materialNameOptions.value,
          outlined: true,
          useInput: true,
          fillInput: true,
          hideSelected: true,
          inputDebounce: 0,
          emitValue: true,
          mapOptions: true,
          placeholder: "ชื่ออุปกรณ์",
          // onFilter: fetchMaterialMaster
          "onUpdate:modelValue": (val: string) =>
            handleUpdateData(row.index, "name", val),
        });
      } else {
        return h("div", { class: "text-left" }, item.name || "");
      }
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "จำนวน",
      });
    },
    cell: ({ row }) => {
      const item = row.original;
      if (item.is_edited) {
        return h(QInput, {
          modelValue: item.quantity,
          type: "number",
          min: 0,
          step: 1,
          outlinded: true,
          placeholder: "จำนวน",
          onChange: (val: number) =>
            handleUpdateData(row.index, "quantity", val),
        });
      } else {
        return h("div", { class: "text-center" }, item.quantity || "");
      }
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "หน่วย",
      });
    },
    cell: ({ row }) => {
      const item: any = row.original as any;
      return h("div", { class: "text-center" }, item.unit || "-");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item: MaterialEquipment = row.original;
      if (item.is_edited) {
        return h(
          "div",
          { class: "flex items-center justify-center space-x-2" },
          [
            h(
              "button",
              {
                type: "button",
                class:
                  "p-1 text-green-600 hover:text-green-800 transition-colors cursor-pointer",
                onClick: () => toggleEditMaterialRow(row.index, false),
                title: "บันทึก",
              },
              [
                h(QIcon, {
                  name: "o_save",
                  size: "sm",
                  style: { color: "#65004A" },
                }),
              ],
            ),
            h(
              "button",
              {
                type: "button",
                class:
                  "p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer",
                onClick: () => removeMaterialRowAt(row.index, item.id),
                title: "ลบ",
              },
              [h(Trash2, { size: 20 })],
            ),
          ],
        );
      }
      return h("div", { class: "flex items-center justify-center space-x-2" }, [
        h(
          "button",
          {
            type: "button",
            class:
              "p-1 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer",
            onClick: () => toggleEditMaterialRow(row.index, true),
            title: "แก้ไข",
          },
          [
            h(QIcon, {
              name: "o_mode_edit",
              size: "sm",
              style: { color: "#F9AC12" },
            }),
          ],
        ),
        h(
          "button",
          {
            type: "button",
            class:
              "p-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer",
            onClick: () => removeMaterialRowAt(row.index, item.id),
            title: "ลบ",
          },
          [h(Trash2, { size: 20 })],
        ),
      ]);
    },
    enableSorting: false,
  },
];
</script>

<template>
  <ContentContainer
    :breadcrumbs="[
      { text: 'หน้าหลัก' },
      { text: 'จัดการกลุ่มวัสดุและอุปกรณ์', link: '/material_equipment/list' },
      {
        text: isCreateMode
          ? 'สร้างกลุ่มวัสดุและอุปกรณ์'
          : 'แก้ไขกลุ่มวัสดุและอุปกรณ์',
      },
    ]"
    last_update="2025-06-19 10:00:00"
  >
    <form novalidate @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="groupName" class="mb-1 block"
          >ชื่อกลุ่ม <span class="text-red-500">*</span></label
        >
        <input
          id="groupName"
          v-model.trim="group_material.name"
          type="text"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="กรอกชื่อกลุ่ม"
        />
      </div>

      <data-table-editor
        ref="material_equipment_editor_ref"
        :columns="columns"
      />

      <div class="mt-5 flex justify-between">
        <div />
        <div>
          <button
            class="create-button width-270"
            type="button"
            @click="addNewMaterialRow()"
          >
            <Plus /> เพิ่มอุปกรณ์
          </button>
        </div>
      </div>

      <div class="mt-5">
        <div class="flex justify-center gap-4">
          <button
            class="close-button width-270"
            type="button"
            @click="router.push('/material_equipment/list')"
          >
            ย้อนกลับ
          </button>
          <button class="create-button width-270" type="submit">
            <Save />บันทึก
          </button>
        </div>
      </div>
    </form>

    <!-- Confirmation Dialog -->
    <AlertConfirmSave v-model="showConfirmSave" @confirm="handleConfirmSave" />

    <!-- Success Dialog -->
    <AlertMaterialSuccess
      v-model="showSuccessAlert"
      @update:model-value="handleSuccessClose"
    />
  </ContentContainer>
</template>

<style scoped>
.close-button {
  background-color: #a35099;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

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

.create-button:hover,
.close-button:hover {
  opacity: 0.9;
  color: #ffffff;
  text-decoration: none;
}

.create-button:active {
  background-color: #5c0f88;
}
</style>
