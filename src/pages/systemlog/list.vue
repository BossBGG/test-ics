<!-- src/pages/systemlog/list.vue -->
<script setup lang="ts">
import { ref, h, computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '@/components/form/DataTable.vue'
import DataTableColumnHeader from '@/components/form/DataTableColumnHeader.vue'

import SystemLogFilterDialog from '@/components/dialog/SystemLogFilterDialog.vue'

import { Eye } from 'lucide-vue-next'
import { mockSystemLogData, type SystemLogData } from '~/data/systemLogData'
import { Button } from '~/components/ui/button'
import SystemLogLevelBadge from '@/components/systemlog/SystemLogLevelBadge.vue'


// Reactive data
const systemLogData = ref<SystemLogData[]>(mockSystemLogData)
const showFilterDialog = ref(false)

// Column definitions
const columns: ColumnDef<SystemLogData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ลำดับ' }),
    cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.getValue('id')),
    enableSorting: true,
  },
  {
    id: 'datetime',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'วันที่' }),
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: 'text-sm' }, [
        h('div', { class: 'font-medium' }, data.date),
        h('div', { class: 'text-gray-500' }, `${data.time} น.`)
      ])
    },
    enableSorting: true,
  },
  {
    accessorKey: 'level',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ประเภท' }),
    cell: ({ row }) => {
      const level = row.getValue('level') as string
      return h(SystemLogLevelBadge, { level })
    },
    enableSorting: true,
  },
  {
    id: 'user',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ผู้ใช้งาน' }),
    cell: ({ row }) => {
      const user = row.original.user
      return h('div', { class: 'flex items-center space-x-3' }, [
        h('img', {
          src: user.avatar,
          alt: user.name,
          class: 'w-8 h-8 rounded-full',
        }),
        h('div', { class: 'font-medium text-sm' }, user.name)
      ])
    },
    enableSorting: false,
  },
  {
    accessorKey: 'event',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'รายละเอียดเหตุการณ์' }),
    cell: ({ row }) => {
      const event = row.getValue('event') as string
      return h('div', { class: 'text-sm max-w-xs truncate', title: event }, event)
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ip_address',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'IP Address' }),
    cell: ({ row }) => {
      const ipAddress = row.getValue('ip_address') as string
      return h('div', { class: 'font-mono text-sm' }, ipAddress)
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center w-full' }, ''),
    cell: ({ row }) => {
      const item = row.original
      
      return h('div', { class: 'flex justify-center' }, [
        h(Button, {
          variant: 'ghost',
          size: 'sm',
          class: 'h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50',
          onClick: () => handleViewDetails(item.id),
          title: 'ดูรายละเอียด'
        }, {
          default: () => h(Eye, { class: 'h-4 w-4' })
        })
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
  console.log('Applied filters:', filters)
  // TODO: Apply filters to data
  // This would typically involve API call or data filtering
}

const handleViewDetails = (id: number) => {
  // Navigate to detail page
  navigateTo(`/systemlog/${id}`)
}

// Computed page title
const pageTitle = computed(() => 'System Log')
const lastUpdate = computed(() => '14 ธันวาคม 2566, 09:30 น.')

const breadcrumbs = [
  { text: 'หน้าหลัก', link: '/' },
  { text: 'System Log' }
]
</script>

<template>
  <ContentContainer 
    breadcrumbs
    :last_update="lastUpdate"
  >
    <template #menu>
      <div class="flex space-x-2">
        <!-- Additional menu items can be added here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">System Log</h1>
            <p class="text-gray-600 mt-1">ติดตามและจัดการ log ของระบบ</p>
          </div>
          <div class="text-sm text-gray-500">
            อัปเดตล่าสุดเมื่อ: {{ lastUpdate }}
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm border">
        <DataTable 
          :columns="columns" 
          :data="systemLogData"
          :is-system-log="true"
          @show-filter="handleFilterShow"
        />
      </div>
    </div>
  </ContentContainer>
</template>