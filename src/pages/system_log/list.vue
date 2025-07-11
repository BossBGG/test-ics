<!-- src/pages/systemlog/list.vue -->
<script setup lang="ts">
import { ref, h, computed } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '@/components/form/DataTable.vue'
import DataTableColumnHeader from '@/components/form/DataTableColumnHeader.vue'

import SystemLogFilterDialog from '@/components/dialog/SystemLogFilterDialog.vue'
import { Search } from 'lucide-vue-next'
import { mockSystemLogData, type SystemLogData } from '~/data/systemLogData'
import { Button } from '~/components/ui/button'
import SystemLogLevelBadge from '@/components/systemlog/SystemLogLevelBadge.vue'
import ContentContainer from "~/layouts/ContentContainer.vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

// Reactive data
const systemLogData = ref<SystemLogData[]>(mockSystemLogData)
const showFilterDialog = ref(false)

// Column definitions
const columns: ColumnDef<SystemLogData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ลำดับ' }),
    cell: ({ row }) => h('div', { class: 'text-center ' }, row.getValue('id')),
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
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ประเภท' }),
    cell: ({ row }) => {
      const level = row.getValue('level') as string
      // return h(SystemLogLevelBadge, { level })
      return h('div', { class: '' }, level)
      // return h(SystemLogLevelBadge, { level })
    },
    enableSorting: true,
  },
  {
    id: 'user',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ผู้ใช้งาน' }),
    cell: ({ row }) => {
      const user = row.original.user
      return h('div', { class: 'flex items-center space-x-3' }, [
        // h('img', {
        //   src: user.avatar,
        //   alt: user.name,
        //   class: 'w-8 h-8 rounded-full',
        // }),
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
        h(Button, {
          variant: 'ghost',
          size: 'sm',
          class: 'h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer',
          onClick: () => handleViewDetails(item.id),
          title: 'ดูรายละเอียด'
        }, {
          default: () => h(Search, { class: 'h-4 w-4' })
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
  router.push(`/system_log/${id}`)
}

// Computed page title
const pageTitle = computed(() => 'System Log')
const lastUpdate = computed(() => new Date())

const breadcrumbs = [
  { text: 'หน้าหลัก', link: '/' },
  { text: 'System Log' }
]
</script>

<template>
  <ContentContainer 
    :breadcrumbs="breadcrumbs"
    :last_update="lastUpdate"
  >
    <!-- Data Table -->
    <div>
      <DataTable
          :columns="columns"
          :data="systemLogData"
          :is-system-log="true"
          @show-filter="handleFilterShow"
      />
    </div>
  </ContentContainer>
</template>