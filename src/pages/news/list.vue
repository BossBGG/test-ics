<!-- src/pages/news/list.vue -->
<template>
  <content-container
    :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' }, { text: 'จัดการประกาศ' }]"
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
            to="/news/create"
          >
            <Plus class="w-4 h-4" /> สร้างประกาศ
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
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref, computed } from "vue";
import { Edit, Trash2, Plus, Filter } from 'lucide-vue-next'
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import FilterDialog from "~/components/dialog/FilterDialog.vue"; 
import NewsStatusBadge from "~/components/news/NewsStatusBadge.vue";
import { mockNewsData, type NewsData } from "~/data/newsData";
import {Switch} from "~/components/ui/switch";

const showFilterDialog = ref(false)
const currentFilters = ref({
  startDate: '',
  endDate: '',
  status: ''
})

const filteredData = computed(() => {
  let data = [...mockNewsData]
  
  if (currentFilters.value.status) {
    data = data.filter(item => item.status === currentFilters.value.status)
  }
  
  // Add date filtering logic here if needed
  
  return data
})

const handleApplyFilters = (filters: any) => {
  currentFilters.value = { ...filters }
}

const handleEdit = (id: number) => {
  // Navigate to edit page
  console.log('Edit news:', id)
}

const handleDelete = (id: number) => {
  // Show delete confirmation
  console.log('Delete news:', id)
}

const columns: ColumnDef<NewsData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ลำดับ'
      })
    },
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('id')),
    enableSorting: true,
  },
  {
    accessorKey: 'image',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ภาพปก'
      })
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string
      return h('div', { class: 'flex justify-center' }, [
        h('img', {
          src: imageUrl,
          alt: 'ภาพปก',
          class: 'w-12 h-8 object-cover rounded'
        })
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'หัวข้อ'
      })
    },
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('title')),
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'รายละเอียด'
      })
    },
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return h('div', { class: 'max-w-xs truncate' }, description)
    },
    enableSorting: false,
  },
  {
    accessorKey: 'publish_date',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'วันที่เผยแพร่'
      })
    },
    cell: ({ row }) => h('div', { class: 'text-sm' }, row.getValue('publish_date')),
    enableSorting: true,
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => {
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
    accessorKey: 'status',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'สถานะ'
      })
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h('div', { class: 'flex justify-center' }, [
        h(NewsStatusBadge, { status })
      ])
    },
    enableSorting: true,
  },
  {
    accessorKey: 'created_date',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'วันที่สร้าง'
      })
    },
    cell: ({ row }) => h('div', { class: 'text-sm' }, row.getValue('created_date')),
    enableSorting: true,
  },
  {
    accessorKey: 'created_by',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'ผู้สร้างประกาศ'
      })
    },
    cell: ({ row }) => h('div', { class: 'text-sm' }, row.getValue('created_by')),
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'การจัดการ',
    cell: ({ row }) => {
      const newsId = row.getValue('id') as number
      return h('div', { class: 'flex items-center justify-center space-x-2' }, [
        h('button', {
          class: 'p-1 text-blue-600 hover:text-blue-800 transition-colors',
          onClick: () => handleEdit(newsId),
          title: 'แก้ไข'
        }, [
          h(Edit, { class: 'w-4 h-4' })
        ]),
        h('button', {
          class: 'p-1 text-red-600 hover:text-red-800 transition-colors',
          onClick: () => handleDelete(newsId),
          title: 'ลบ'
        }, [
          h(Trash2, { class: 'w-4 h-4' })
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