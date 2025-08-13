<!-- src/pages/system_log/list.vue -->
<script setup lang="ts">
import { ref, h, computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '@/components/form/DataTable.vue'
import DataTableColumnHeader from '@/components/form/DataTableColumnHeader.vue'
import RowPagination from '@/components/ui/pagination/RowPagination.vue'
import SystemLogFilterDialog from '@/components/dialog/SystemLogFilterDialog.vue'
import { mockWorkReportData, type WorkReportData } from '~/data/workreportData'
import SystemLogLevelBadge from '@/components/systemlog/SystemLogLevelBadge.vue'
import ContentContainer from "~/layouts/ContentContainer.vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// Reactive data
const allWorkReportData = ref<WorkReportData[]>(mockWorkReportData)
const showFilterDialog = ref(false)
const currentFilters = ref({
  startDate: '',
  endDate: '',
  level: '',
  user: ''
})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Apply filters to data
const filteredData = computed(() => {
  let data = [...allWorkReportData.value]
  
  // Apply filters here
  if (currentFilters.value.level) {
    data = data.filter(item => item.level === currentFilters.value.level)
  }
  
  if (currentFilters.value.user) {
    data = data.filter(item => 
      item.user.name.toLowerCase().includes(currentFilters.value.user.toLowerCase())
    )
  }
  
  // Add date filtering logic here if needed
  
  return data
})

// Computed properties for pagination
const totalItems = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Column definitions
const columns: ColumnDef<WorkReportData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ลำดับ' }),
    cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('id')),
    enableSorting: true,
  },
  {
    id: 'datetime',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'วันที่' }),
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: '' }, [
        h('div', { class: '' }, data.date),
        h('div', { class: 'text-gray-500' }, `${data.time} น.`)
      ])
    },
    enableSorting: true,
  },
  {
    accessorKey: 'level',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ประเภท (System Log)' }),
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: '' }, [
        h('div', { class: '' }, data.level),
        h('div', { class: 'text-gray-500' }, data.sub_level)
      ])
    },
    enableSorting: true,
  },
  {
    id: 'user',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ผู้ใช้งาน' }),
    cell: ({ row }) => {
      const user = row.original.user
      return h('div', { class: 'flex items-center space-x-3' }, [
        h('div', { class: '' }, user.name)
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'event',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'รายละเอียดเหตุการณ์' }),
    cell: ({ row }) => {
      const event = row.getValue('event') as string
      return h('div', { class: 'max-w-xs truncate', title: event }, event)
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ip_address',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'IP Address' }),
    cell: ({ row }) => {
      const ipAddress = row.getValue('ip_address') as string
      return h('div', { class: 'font-mono' }, ipAddress)
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, ''),
    cell: ({ row }) => {
      const item = row.original
      
      return h('div', { class: 'flex justify-center' }, [
        h('button', {
          class: 'p-1 hover:opacity-80 transition-opacity',
          onClick: () => handleViewDetails(item.id),
          title: 'รายละเอียด'
        }, [
          h('img', { 
            src: '/assets/images/view-button.png',
            alt: 'รายละเอียด',
            class: 'w-8 h-8'
          })
        ])
      ])
    },
    enableSorting: false,
  },
]

// Event handlers
const handleFilterShow = () => {
  showFilterDialog.value = true
}

const handleFilterApply = (filters: any) => {
  currentFilters.value = { ...filters }
  currentPage.value = 1 // Reset to first page when applying filters
}

const handleViewDetails = (id: number) => {
  router.push(`/system_log/${id}`)
}

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleItemsPerPageChange = (items: number) => {
  itemsPerPage.value = items
  currentPage.value = 1 // Reset to first page
}

// Computed properties
const lastUpdate = computed(() => new Date())

const breadcrumbs = [
  { text: 'หน้าหลัก', link: '/' },
  { text: 'รายงานการปฏิบัติงาน' }
]
</script>

<template>
  <ContentContainer 
    :breadcrumbs="breadcrumbs"
    :last_update="lastUpdate"
  >
    <!-- Data Table without built-in pagination -->
    <div>
      <DataTable
        :columns="columns"
        :data="paginatedData"
        :is-system-log="true"
        @show-filter="handleFilterShow"
      />
      
      <!-- Custom Row Pagination -->
      <RowPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :items-per-page="itemsPerPage"
        @update:current-page="handlePageChange"
        @update:items-per-page="handleItemsPerPageChange"
      />
    </div>

    <!-- Filter Dialog -->
    <SystemLogFilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />
  </ContentContainer>
</template>