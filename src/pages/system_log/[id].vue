<!-- src/pages/systemlog/[id].vue -->
<script setup lang="ts">
import {ref, computed, onMounted, h} from 'vue'
import {mockSystemLogData, mockSystemLogDataDetail, type SystemLogData, SystemLogDataDetail} from '~/data/systemLogData'
import SystemLogLevelBadge from '@/components/systemlog/SystemLogLevelBadge.vue'
import {Button} from '~/components/ui/button'
import {ArrowLeft, User, Calendar, Globe, Monitor, Smartphone, AlertTriangle, Search} from 'lucide-vue-next'
import {useRoute, useRouter} from 'vue-router'
import ContentContainer from "~/layouts/ContentContainer.vue"
import type {ColumnDef} from "@tanstack/vue-table";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import DataTable from "~/components/form/DataTable.vue";

// Get route params
const route = useRoute()
const router = useRouter()
const logId = parseInt(route.params?.id as string)

// Reactive data
const logData = ref<SystemLogData>({} as SystemLogData)
const logDataDetail = ref<SystemLogDataDetail>({} as SystemLogDataDetail)
const loading = ref(true)

// Fetch log data
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    logData.value = mockSystemLogData.find(log => log.id == logId) || null
    logDataDetail.value = mockSystemLogDataDetail
    loading.value = false
  }, 100)
})

// Computed properties
const breadcrumbs = computed(() => [
  {text: 'หน้าหลัก', link: '/'},
  {text: 'System Log', link: '/system_log/list'},
  {text: 'รายละเอียด'}
])

// Event handlers
const handleBack = () => {
  router.push('/system_log/list')
}

const columns: ColumnDef<SystemLogDataDetail>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ลำดับ' }),
    cell: ({ row }) => h('div', { class: 'text-center ' }, row.getValue('id')),
    enableSorting: true,
  },
  {
    accessorKey: 'date_time',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'วันที่' }),
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: '' }, [
        h('div', { class: 'text-gray-500' }, `${data.date_time} น.`)
      ])
    },
    enableSorting: true,
  },
  {
    accessorKey: 'old_data',
    header: 'รายละเอียดเพิ่มเติม (ข้อมูลเดิม)',
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: '' }, [
        h('div', { class: 'text-gray-500' }, data.old_data)
      ])
    },
  },
  {
    accessorKey: 'new_data',
    header:  'รายละเอียดเพิ่มเติม (ข้อมูลใหม่)',
    cell: ({ row }) => {
      const data = row.original
      return h('div', { class: '' }, [
        h('div', { class: 'text-gray-500' }, data.new_data)
      ])
    },
  },
]
</script>

<template>
  <ContentContainer :breadcrumbs="breadcrumbs">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลด...</p>
      </div>
    </div>

    <div v-else-if="!logData" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">ไม่พบข้อมูล</h2>
      <p class="text-gray-600 mb-6">ไม่สามารถหาข้อมูล log ที่ระบุได้</p>
      <Button @click="handleBack" variant="outline">
        <ArrowLeft class="w-4 h-4 mr-2"/>
        กลับหน้ารายการ
      </Button>
    </div>

    <div v-else class="space-y-6">
      <!-- Log Detail Cards -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="bg-[#69306D] text-white px-6 py-4 rounded-t-lg">
          <h4 class="flex items-center">
            ประเภทข้อมูล
          </h4>
        </div>
        <div class="p-6 grid grid-cols-4 lg:grid-cols-4 gap-4 bg-[#DBDADC]">
          <div class="bg-[#FFF] rounded-sm">
            <div class="m-4">
              <label class="text-sm">ผู้ใช้งาน:</label>
              <div class="flex items-center space-x-2 mt-1">
                <span class="font-medium">{{ logData.user.name }}</span>
              </div>
            </div>
          </div>
          <div class="bg-[#FFF] rounded-sm">
            <div class="m-4">
              <label class="text-sm font-medium text-gray-600">ประเภท System Log:</label>
              <div class="flex items-center space-x-2 mt-1">
                <span class="font-medium">{{ logData.level }}</span>
              </div>
            </div>
          </div>
          <div class="bg-[#FFF] rounded-sm">
            <div class="m-4">
              <label class="text-sm font-medium text-gray-600">รายละเอียดเหตุการณ์:</label>
              <p class="font-medium">{{ logData.event }}</p>
            </div>
          </div>
          <div class="bg-[#FFF] rounded-sm">
            <div class="m-4">
              <label class="text-sm font-medium text-gray-600">วันที่:</label>
              <div class="mt-1 flex items-center space-x-2">
                <span>{{ logData.date_time || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Detailed Description -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="bg-[#69306D] text-white px-6 py-4 rounded-t-lg">
          <h4 class="text-lg font-semibold">รายละเอียด</h4>
        </div>
        <div class="bg-[#DBDADC] p-6">
          <div class="bg-[#FFF] rounded-lg">
            <DataTable
                :columns="columns"
                :data="logDataDetail"
                :show-search="false"
                :show-filter="false"
            />
          </div>
        </div>
      </div>
    </div>
  </ContentContainer>
</template>

<style scoped>
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}
</style>