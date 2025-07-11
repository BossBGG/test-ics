<!-- src/pages/systemlog/[id].vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockSystemLogData, type SystemLogData } from '~/data/systemLogData'
import SystemLogLevelBadge from '@/components/systemlog/SystemLogLevelBadge.vue'
import { Button } from '~/components/ui/button'
import { ArrowLeft, User, Calendar, Globe, Monitor, Smartphone, AlertTriangle } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import ContentContainer from "~/layouts/ContentContainer.vue"

// Get route params

const logId = parseInt(route.params.id as string)

// Reactive data
const logData = ref<SystemLogData | null>(null)
const loading = ref(true)

// Fetch log data
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    logData.value = mockSystemLogData.find(log => log.id === logId) || null
    loading.value = false
  }, 100)
})

// Computed properties
const breadcrumbs = computed(() => [
  { text: 'หน้าหลัก', link: '/' },
  { text: 'System Log', link: '/systemlog/list' },
  { text: 'รายละเอียด' }
])

// Event handlers
const handleBack = () => {
  navigateTo('/systemlog/list')
}

const getDeviceIcon = (device: string) => {
  switch (device?.toLowerCase()) {
    case 'mobile':
    case 'iphone':
    case 'android':
      return Smartphone
    case 'desktop':
    case 'server':
      return Monitor
    default:
      return Monitor
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'Error':
    case 'Critical':
    case 'Alert':
    case 'Failure':
      return AlertTriangle
    default:
      return AlertTriangle
  }
}
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
        <ArrowLeft class="w-4 h-4 mr-2" />
        กลับหน้ารายการ
      </Button>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <Button @click="handleBack" variant="outline" size="sm">
              <ArrowLeft class="w-4 h-4 mr-2" />
              กลับ
            </Button>
            <h1 class="text-2xl font-bold text-gray-900">รายละเอียด</h1>
          </div>
          <div class="text-sm text-gray-500">
            อัปเดตล่าสุดเมื่อ: {{ logData.date }}, {{ logData.time }} น.
          </div>
        </div>
      </div>

      <!-- Log Detail Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
            <h2 class="text-lg font-semibold flex items-center">
              <component :is="getLevelIcon(logData.level)" class="w-5 h-5 mr-2" />
              ประเภทข้อมูล
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-600">ผู้ใช้งาน:</label>
                <div class="flex items-center space-x-2 mt-1">
                  <img 
                    :src="logData.user.avatar" 
                    :alt="logData.user.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="font-medium">{{ logData.user.name }}</span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">ประเภท:</label>
                <div class="mt-1">
                  <SystemLogLevelBadge :level="logData.level" />
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-600">รายละเอียดเหตุการณ์:</label>
                <p class="mt-1 text-gray-900">{{ logData.event }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">วันที่:</label>
                <div class="mt-1 flex items-center space-x-2">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <span>{{ logData.date }}</span>
                  <span class="text-gray-500">{{ logData.time }} น.</span>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-600">IP Address:</label>
              <div class="mt-1 flex items-center space-x-2">
                <Globe class="w-4 h-4 text-gray-400" />
                <span class="font-mono">{{ logData.ip_address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
            <h2 class="text-lg font-semibold flex items-center">
              <Monitor class="w-5 h-5 mr-2" />
              รายละเอียด
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-if="logData.system_info">
              <div class="grid grid-cols-1 gap-4">
                <div v-if="logData.system_info.browser">
                  <label class="text-sm font-medium text-gray-600">เบราว์เซอร์:</label>
                  <p class="mt-1 text-gray-900">{{ logData.system_info.browser }}</p>
                </div>
                
                <div v-if="logData.system_info.os">
                  <label class="text-sm font-medium text-gray-600">ระบบปฏิบัติการ:</label>
                  <p class="mt-1 text-gray-900">{{ logData.system_info.os }}</p>
                </div>
                
                <div v-if="logData.system_info.device">
                  <label class="text-sm font-medium text-gray-600">อุปกรณ์:</label>
                  <div class="mt-1 flex items-center space-x-2">
                    <component :is="getDeviceIcon(logData.system_info.device)" class="w-4 h-4 text-gray-400" />
                    <span>{{ logData.system_info.device }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-gray-500 italic">ไม่มีข้อมูลระบบ</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Description -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg">
          <h2 class="text-lg font-semibold">รายละเอียดเหตุการณ์เพิ่มเติม (ข้อมูล Logs)</h2>
        </div>
        <div class="p-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 mb-2">รายละเอียดเหตุการณ์เพิ่มเติม (ข้อมูล Logs)</h3>
            <div class="space-y-2">
              <div class="flex">
                <span class="font-medium text-gray-600 w-20">1</span>
                <span>{{ logData.date }} {{ logData.time }}</span>
                <span class="ml-4">{{ logData.event }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-600 w-20">2</span>
                <span>{{ logData.date }} {{ logData.time }}</span>
                <span class="ml-4">{{ logData.event }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="logData.details" class="mt-6">
            <h3 class="font-semibold text-gray-900 mb-3">รายละเอียดข้อผิดพลาด</h3>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-gray-800">{{ logData.details }}</p>
            </div>
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