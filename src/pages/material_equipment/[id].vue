<!-- src/pages/news/list.vue -->
<template>
  <content-container
      :breadcrumbs="[
          { text: 'น้าหลัก' },
          { text: 'จัดการกลุ่มวัสดุและอุปกรณ์',link: '/material_equipment/list' },
          { text: 'สร้างกลุ่มวัสดุและอุปกรณ์'}]"
      :last_update="'2025-06-19 10:00:00'"
  >
    <input-text
        label="ชื่อกลุ่ม"
        v-model="group_material.name"
        required
    />
    <data-table
        class="mt-5"
        :columns="columns"
        :data="material_equipments"
        :show-filter="false"
        :show-search="false"
    >
    </data-table>

    <div class="flex justify-between mt-5">
      <div>

      </div>
      <div>
        <button class="create-button width-270">
          <Plus /> เพิ่มอุปกรณ์
        </button>
      </div>
    </div>

    <div class="mt-5">
      <div class="flex justify-center gap-4">
        <button @click="router.push('/material_equipment/list')" class="close-button width-270">
          ปิด
        </button>
        <button class="create-button width-270">
          <Save />บันทึก
        </button>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import type {ColumnDef} from "@tanstack/vue-table";
import {h, ref, computed} from "vue";
import {Edit, Trash2, Plus,Save} from 'lucide-vue-next'
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import { mockData } from "~/data/MaterialEquipment";
import type {GroupMaterial, MaterialEquipment} from "~/api/types";
import {useRoute, useRouter} from "vue-router";

const currentFilters = ref({
  startDate: '',
  endDate: '',
  status: ''
})
const router = useRouter()
const group_material = ref<GroupMaterial>({} as GroupMaterial)
const material_equipments = computed(() => {
  let data = [...mockData]

  if (currentFilters.value.status) {
    data = data.filter(item => item.status === currentFilters.value.status)
  }

  // Add date filtering logic here if needed

  return data
})

const handleApplyFilters = (filters: any) => {
  currentFilters.value = {...filters}
}

const handleEdit = (id: number) => {
  // Navigate to edit page
  console.log('Edit news:', id)
}

const handleDelete = (id: number) => {
  // Show delete it confirmation
  console.log('Delete news:', id)
}

const columns: ColumnDef<MaterialEquipment>[] = [
  {
    accessorKey: 'id',
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ลำดับที่'
      })
    },
    cell: ({row}) => h('div', {class: 'text-center'}, row.getValue('id')),
    enableSorting: true,
  },
  {
    accessorKey: "code",
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'รหัสวัสดุ'
      })
    },
  },
  {
    accessorKey: "name",
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ชื่ออุปกรณ์'
      })
    },
  },
  {
    accessorKey: "quantity",
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'จำนวน'
      })
    },
  },
  {
    accessorKey: "unit",
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'หน่วย'
      })
    },
  },
  {
    id: 'actions',
    header: 'การจัดการ',
    cell: ({row}) => {
      const id = row.getValue('id') as number
      return h('div', {class: 'flex items-center justify-center space-x-2'}, [
        h('button', {
          class: 'p-1 text-blue-600 hover:text-blue-800 transition-colors',
          onClick: () => handleEdit(id),
          title: 'แก้ไข'
        }, [
          h(Edit, {size: 20})
        ]),
        h('button', {
          class: 'p-1 text-red-600 hover:text-red-800 transition-colors',
          onClick: () => handleDelete(id),
          title: 'ลบ'
        }, [
          h(Trash2, {size: 20})
        ])
      ])
    },
    enableSorting: false,
  }
]
</script>

<style scoped>
.close-button {
  background-color: #A35099; /* สีม่วงตามรูป */
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
  background-color: #69306D;
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

.create-button:hover, .close-button:hover {
  opacity: 0.9;
  color: #ffffff;
  text-decoration: none;
}

.create-button:active {
  background-color: #5c0f88;
}
</style>