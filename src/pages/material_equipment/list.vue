<!-- src/pages/news/list.vue -->
<template>
  <content-container
      :breadcrumbs="[{ text: 'น้าหลัก' }, { text: 'จัดการกลุ่มวัสดุและอุปกรณ์' }]"
      :last_update="'2025-06-19 10:00:00'"
  >
    <data-table
        :columns="columns"
        :data="filteredData"
    >
      <template v-slot:createButton>
        <div class="flex justify-end mb-3">
          <RouterLink
              class="create-button"
              to="/material_equipment/create"
          >
            <Plus class="w-4 h-4"/>
            สร้างกลุ่ม
          </RouterLink>
        </div>
      </template>
    </data-table>

    <!-- Filter Dialog -->
    <FilterDialog
        v-model="showFilterDialog"
        @apply-filters="handleApplyFilters"
    />
  </content-container>
</template>

<script setup lang="ts">
import type {ColumnDef} from "@tanstack/vue-table";
import {h, ref, computed} from "vue";
import {Edit, Trash2, Plus, Filter} from 'lucide-vue-next'
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import FilterDialog from "~/components/dialog/FilterDialog.vue";
import {mockGroupData} from "~/data/MaterialEquipment";
import {GroupMaterial} from "~/api/types";
import Badge from "~/components/list/Badge.vue";
import {Switch} from "~/components/ui/switch";

const showFilterDialog = ref(false)
const currentFilters = ref({
  startDate: '',
  endDate: '',
  status: ''
})

const filteredData = computed(() => {
  let data = [...mockGroupData]

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

const columns: ColumnDef<GroupMaterial>[] = [
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
    accessorKey: "name",
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ชื่อกลุ่ม'
      })
    },
  },
  {
    accessorKey: 'status',
    header: "สถานะ",
    cell: ({row}) => {
      const status = row.getValue('status') ? 'active' : 'inactive'
      const status_label = status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'
      return h(Badge, {label: status_label, variant: status})
    },
    enableSorting: true,
  },
  {
    accessorKey: 'is_active',
    header: ({column}) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ปิด/เปิด'
      })
    },
    cell: ({row}) => {
      return h(Switch, {
        // modelValue: row.getValue('is_active'),
        'onUpdate:modelValue': (value) => {

        },
      });
    },
    enableSorting: true,
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

.create-button:hover {
  opacity: 0.9;
  color: #ffffff;
  text-decoration: none;
}

.create-button:active {
  background-color: #5c0f88;
}
</style>