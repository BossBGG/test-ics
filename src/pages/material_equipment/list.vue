<!-- src/pages/material_equipment/list.vue -->
<template>
  <content-container
      :breadcrumbs="[{ text: 'น้าหลัก' }, { text: 'จัดการกลุ่มวัสดุและอุปกรณ์' }]"
      :last_update="'2025-06-19 10:00:00'"
  >
    <data-table
        :columns="columns"
        :data="filteredData"
        :is-material-equipment="true"
    >
      <template v-slot:createButton>
        <div class="flex justify-end mb-3">
          <RouterLink
              class="create-button"
              to="/material_equipment/create"
          >
            <Plus class="w-8 h-8"/>
            สร้างกลุ่ม
          </RouterLink>
        </div>
      </template>
    </data-table>
  </content-container>
</template>

<script setup lang="ts">
import type {ColumnDef} from "@tanstack/vue-table";
import {h, ref, computed} from "vue";
import {Plus} from 'lucide-vue-next'
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import {mockGroupData} from "~/data/MaterialEquipment";
import {GroupMaterial} from "~/api/types";
import {Switch} from "~/components/ui/switch";

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

  return data
})

const handleEdit = (id: number) => {
  console.log('Edit material equipment:', id)
}

const handleDelete = (id: number) => {
  console.log('Delete material equipment:', id)
}

// Custom Badge component
const StatusBadge = ({ label, variant }: { label: string, variant: string }) => {
  const bgColor = variant === 'active' ? '#B36E9E' : '#57595B'
  const textColor = '#ffffff'
  
  return h('span', {
    class: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    style: {
      backgroundColor: bgColor,
      color: textColor
    }
  }, label)
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
      return h(StatusBadge, {label: status_label, variant: status})
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
      return h('div', { class: 'flex items-center' }, [
        h(Switch, {
          'onUpdate:modelValue': (value) => {
            // Handle switch change
          },
        })
      ]);
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, ''),
    cell: ({row}) => {
      const id = row.getValue('id') as number
      return h('div', {class: 'flex flex-row items-center justify-center space-x-1 min-w-[80px]'}, [
        h('button', {
          class: 'inline-flex items-center justify-center p-1 hover:opacity-80 transition-opacity',
          onClick: () => handleEdit(id),
          title: 'แก้ไข'
        }, [
          h('img', { 
            src: '/assets/images/edit-button.png',
            alt: 'แก้ไข',
            class: 'w-8 h-8'
          })
        ]),
        h('button', {
          class: 'inline-flex items-center justify-center p-1 hover:opacity-80 transition-opacity',
          onClick: () => handleDelete(id),
          title: 'ลบ'
        }, [
          h('img', { 
            src: '/assets/images/delete-button.png',
            alt: 'ลบ',
            class: 'w-8 h-8'
          })
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



.create-button:active {
  background-color: #5c0f88;
}
</style>