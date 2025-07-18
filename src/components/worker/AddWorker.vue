<!-- src/components/worker/AddWorker.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Worker {
  id: number
  group: string
  worker: string
  workCenter: string
  activity: string
  hours: number
  unit: string
  startDateTime: string
  isEditing: boolean
  isSaved: boolean
}

const workerData = ref<Worker[]>([])

const workerGroups = [
  'กลุ่มช่างไฟฟ้า',
  'กลุ่มช่างเครื่องกล',
  'กลุ่มช่างโทรคมนาคม',
  'กลุ่มช่างซ่อมบำรุง',
  'กลุ่มช่างติดตั้ง',
  'อื่นๆ'
]

const workerNames = [
  'นายสมชาย ใจดี',
  'นายวิทยา ขยันงาน',
  'นายประเสริฐ มั่นคง',
  'นายอนันต์ เป็นเลิศ',
  'นายบุญมี สุขใส',
  'อื่นๆ'
]

const activities = [
  'การติดตั้งอุปกรณ์',
  'การซ่อมแซมอุปกรณ์',
  'การบำรุงรักษา',
  'การตรวจสอบระบบ',
  'การทดสอบอุปกรณ์',
  'อื่นๆ'
]

const addWorker = () => {
  const newId = workerData.value.length > 0 ? Math.max(...workerData.value.map(item => item.id)) + 1 : 1
  workerData.value.push({
    id: newId,
    group: '',
    worker: '',
    workCenter: '',
    activity: '',
    hours: 1,
    unit: '',
    startDateTime: '',
    isEditing: true,
    isSaved: false
  })
}

const removeWorker = (id: number) => {
  workerData.value = workerData.value.filter(item => item.id !== id)
}

const saveWorker = (id: number) => {
  const worker = workerData.value.find(item => item.id === id)
  if (worker && worker.group && worker.worker && worker.workCenter && worker.activity && worker.hours > 0 && worker.unit && worker.startDateTime) {
    worker.isEditing = false
    worker.isSaved = true
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editWorker = (id: number) => {
  const worker = workerData.value.find(item => item.id === id)
  if (worker) {
    worker.isEditing = true
  }
}

const updateWorker = (id: number, field: keyof Worker, value: any) => {
  const index = workerData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    workerData.value[index][field] = value
  }
}

const clearAllData = () => {
  workerData.value = []
}

// Add format function for datetime display
const formatDateTime = (datetime: string) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <CardCollapse title="กลุ่มผู้ปฏิบัติงาน" icon="/assets/images/user.png">
    <div>
      <!-- Data Table -->
      <div class="rounded-[10px] border mb-4">
        <Table class="rounded-tl-[8px] rounded-tr-[8px] worker-data-table">
          <TableHeader>
            <TableRow>
              <TableHead class="bg-[#69306D] text-white first:rounded-tl-[8px] p-2 text-center w-[80px]">
                ลำดับ
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[180px]">
                กลุ่มผู้ปฏิบัติงาน
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[180px]">
                ผู้ปฏิบัติงาน
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[140px]">
                ศูนย์งานหลัก
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[180px]">
                กิจกรรม
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 text-center w-[120px]">
                ชั่วโมง/งาน
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 px-8 text-center w-[100px]">
                หน่วย
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[180px]">
                วันที่และเวลาเริ่มต้น
              </TableHead>
              <TableHead class="bg-[#69306D] text-white last:rounded-tr-[8px] p-2 text-center w-[140px]">
                
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="workerData.length > 0">
              <TableRow v-for="(worker, index) in workerData" :key="worker.id">
                <!-- ลำดับ -->
                <TableCell class="p-2 text-center font-semibold">
                  {{ index + 1 }}.
                </TableCell>
                
                <!-- กลุ่มผู้ปฏิบัติงาน -->
                <TableCell class="p-2">
                  <q-select
                    v-if="worker.isEditing"
                    :model-value="worker.group"
                    :options="workerGroups"
                    outlined
                    placeholder="เลือกกลุ่มผู้ปฏิบัติงาน"
                    class="worker-select"
                    use-input
                    new-value-mode="add-unique"
                    @update:model-value="(value) => updateWorker(worker.id, 'group', value)"
                  />
                  <span v-else class="worker-display">{{ worker.group || 'ยังไม่ได้เลือก' }}</span>
                </TableCell>
                
                <!-- ผู้ปฏิบัติงาน -->
                <TableCell class="p-2">
                  <q-select
                    v-if="worker.isEditing"
                    :model-value="worker.worker"
                    :options="workerNames"
                    outlined
                    placeholder="เลือกผู้ปฏิบัติงาน"
                    class="worker-select"
                    use-input
                    new-value-mode="add-unique"
                    @update:model-value="(value) => updateWorker(worker.id, 'worker', value)"
                  />
                  <span v-else class="worker-display">{{ worker.worker || 'ยังไม่ได้เลือก' }}</span>
                </TableCell>
                
                <!-- ศูนย์งานหลัก -->
                <TableCell class="p-2">
                  <q-input
                    v-if="worker.isEditing"
                    :model-value="worker.workCenter"
                    outlined
                    placeholder="กรอกศูนย์งานหลัก"
                    class="worker-select"
                    @update:model-value="(value) => updateWorker(worker.id, 'workCenter', value)"
                  />
                  <span v-else class="worker-display">{{ worker.workCenter || 'ยังไม่ได้กรอก' }}</span>
                </TableCell>
                
                <!-- กิจกรรม -->
                <TableCell class="p-2">
                  <q-select
                    v-if="worker.isEditing"
                    :model-value="worker.activity"
                    :options="activities"
                    outlined
                    placeholder="เลือกกิจกรรม"
                    class="worker-select"
                    use-input
                    new-value-mode="add-unique"
                    @update:model-value="(value) => updateWorker(worker.id, 'activity', value)"
                  />
                  <span v-else class="worker-display">{{ worker.activity || 'ยังไม่ได้เลือก' }}</span>
                </TableCell>
                
                <!-- ชั่วโมง/งาน -->
                <TableCell class="p-2 text-center">
                  <q-input
                    v-if="worker.isEditing"
                    :model-value="worker.hours"
                    type="number"
                    min="1"
                    outlined
                    placeholder="ชั่วโมง"
                    class="worker-number-input"
                    @update:model-value="(value) => updateWorker(worker.id, 'hours', parseInt(value) || 1)"
                  />
                  <span v-else class="worker-quantity-text">{{ worker.hours }}</span>
                </TableCell>
                
                <!-- หน่วย -->
                <TableCell class="p-2 text-center">
                  <q-input
                    v-if="worker.isEditing"
                    :model-value="worker.unit"
                    outlined
                    class="worker-number-input"
                    @update:model-value="(value) => updateWorker(worker.id, 'unit', value)"
                  />
                  <span v-else class="worker-display">{{ worker.unit || 'ยังไม่ได้กรอก' }}</span>
                </TableCell>
                
                <!-- วันที่และเวลาเริ่มต้น -->
                <TableCell class="p-2">
                  <q-input
                    v-if="worker.isEditing"
                    :model-value="worker.startDateTime"
                    type="datetime-local"
                    outlined
                    class="worker-datetime-input"
                    @update:model-value="(value) => updateWorker(worker.id, 'startDateTime', value)"
                  />
                  <span v-else class="worker-display text-sm">{{ worker.startDateTime ? formatDateTime(worker.startDateTime) : 'ยังไม่ได้กำหนด' }}</span>
                </TableCell>
                
                <!-- การจัดการ -->
                <TableCell class="p-2">
                  <div class="flex justify-center items-center space-x-2 gap-4 w-[80px]">
                    <!-- Save Icon (เมื่อกำลังแก้ไข) -->
                    <button 
                      v-if="worker.isEditing"
                      class=" worker-save-btn"
                      @click="saveWorker(worker.id)"
                      title="บันทึก"
                    >
                      <img src="/assets/images/save-table-icon.png" alt="" class="w-[32px] h-[32px]">
                    </button>
                    
                    <!-- Edit Icon (เมื่อบันทึกแล้ว) -->
                    <button 
                      v-else-if="worker.isSaved"
                      class=" worker-edit-btn"
                      @click="editWorker(worker.id)"
                      title="แก้ไข"
                    >
                     <img src="/assets/images/edit-table-icon.png" alt="" class="w-[20px] h-[20px]">
                    </button>
                    
                    <!-- Delete Icon (แสดงเสมอ) -->
                    <button 
                      class=" worker-delete-btn"
                      @click="removeWorker(worker.id)"
                      title="ลบรายการ"
                    >
                      <img src="/assets/images/delete-table-icon.png" alt="" class="w-[16px] h-[20px]">
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <TableRow v-else>
              <TableCell :colspan="9" class="h-24 text-center text-gray-500">
                ไม่มีข้อมูล
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="flex justify-end space-x-3 mt-4 gap-4">
        <button class="worker-clear-btn" @click="clearAllData">
          <img src="/assets/images/delete-icon.png" alt="" class="w-4 h-4">
          ลบทั้งหมด
        </button>
        
        <button class="worker-add-btn" @click="addWorker">
          <img src="/assets/images/add-icon.png" alt="" class="w-4 h-4">
          เพิ่มรายการ
        </button>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
/* Table Styles */
.worker-data-table {
  font-size: 14px;
}

.worker-data-table th {
  font-size: 14px;
  font-weight: 600;
}

.worker-data-table td {
  vertical-align: middle;
  min-height: 50px;
}

/* Form Input Styles */
.worker-select,
.worker-number-input,
.worker-datetime-input {
  width: 100%;
  min-width: 0;
}

.worker-display {
  color: #374151;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.3;
  font-size: 13px;
}

.worker-quantity-text {
  color: #374151;
  font-weight: 600;
  font-size: 14px;
}

/* Action Button Styles */
.worker-action-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.worker-action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Bottom Action Buttons */
.worker-clear-btn,
.worker-add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
  white-space: nowrap;
}

.worker-clear-btn {
  background: #9A3E7E;
  color: white;
}

.worker-clear-btn:hover {
  background: #8A3570;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 90, 140, 0.3);
}

.worker-add-btn {
  background: #69306D;
  color: white;
}

.worker-add-btn:hover {
  background: #5a285d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(105, 48, 109, 0.3);
}

/* Quasar Input Overrides */
:deep(.worker-select .q-field--outlined .q-field__control) {
  border-radius: 6px;
  border-color: #d1d5db;
  min-height: 40px;
  font-size: 13px;
}

:deep(.worker-select .q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.worker-select .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

:deep(.worker-number-input .q-field--outlined .q-field__control) {
  border-radius: 6px;
  border-color: #d1d5db;
  min-height: 40px;
  width: 80px;
}

:deep(.worker-datetime-input .q-field--outlined .q-field__control) {
  border-radius: 6px;
  border-color: #d1d5db;
  min-height: 40px;
  min-width: 160px;
}

:deep(.worker-select .q-field__inner) {
  padding: 8px 12px;
  font-size: 13px;
}

:deep(.worker-select .q-field__control-container) {
  padding-top: 0;
}

:deep(.worker-select .q-field__native) {
  font-size: 13px;
  min-height: 20px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .worker-data-table th,
  .worker-data-table td {
    font-size: 12px;
    padding: 8px 4px;
  }
  
  .worker-action-btn {
    width: 26px;
    height: 26px;
  }
  
  .worker-clear-btn,
  .worker-add-btn {
    min-width: 100px;
    font-size: 12px;
    padding: 10px 16px;
  }
}

@media (max-width: 768px) {
  .worker-data-table th,
  .worker-data-table td {
    font-size: 11px;
    padding: 6px 2px;
  }
  
  .worker-action-btn {
    width: 24px;
    height: 24px;
  }
  
  .worker-clear-btn,
  .worker-add-btn {
    min-width: 80px;
    font-size: 11px;
    padding: 8px 12px;
  }
  
  .flex.space-x-3 {
    flex-direction: column;
    gap: 8px;
  }
  
  .flex.space-x-3 > * {
    margin-left: 0 !important;
  }
}
</style>