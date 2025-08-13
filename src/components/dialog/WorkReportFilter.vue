<!-- src/components/dialog/FilterDialog.vue -->
<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card class="filter-dialog-card">
      <!-- Header -->
      <div class="filter-dialog-header">
        <h2 class="filter-dialog-title">ตัวกรอง</h2>
        <q-btn 
          flat 
          round 
          dense 
          icon="close" 
          class="filter-close-btn"
          @click="closeDialog"
        />
      </div>
      
      <!-- Content -->
      <div class="filter-dialog-content">
        <!-- วันที่ -->
        <div class="filter-group">
          <label class="filter-label">วันที่</label>
          <div class="date-range-container">
            <q-input
              v-model="filters.startDate"
              class="date-input"
              outlined
              placeholder="DD/MM/YYYY"
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-gray-400">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.startDate" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="ปิด" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            
            <span class="date-separator">-</span>
            
            <q-input
              v-model="filters.endDate"
              class="date-input"
              outlined
              placeholder="DD/MM/YYYY"
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer text-gray-400">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.endDate" mask="DD/MM/YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="ปิด" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <!-- สถานะ -->
        <div class="filter-group">
          <label class="filter-label">งานบริการ</label>
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="งานบริการทั้งหมด"
            class="filter-select"
            
          >
          
          </q-select>

          <label class="filter-label">ประเภทใบสั่งงาน</label>
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="ประเภททั้งหมด"
            class="filter-select"
            
          >
          
          </q-select>

          <label class="filter-label">สถานะ</label>
          <q-select
            v-model="filters.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="สถานะทั้งหมด"
            class="filter-select"
            
          >
          
          </q-select>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="filter-dialog-footer">
        <q-btn
          flat
          label="เคลียร์ค่าทั้งหมด"
          class="clear-btn"
          @click="clearFilters"
        />
        <q-btn
          label="ค้นหา"
          class="search-btn"
          @click="applyFilters"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface FilterData {
  startDate: string
  endDate: string
  status: string
  isActive: boolean | null
  createdStartDate: string
  createdEndDate: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'apply-filters': [filters: FilterData]
}>()

const isVisible = ref(props.modelValue)

const filters = reactive<FilterData>({
  startDate: '',
  endDate: '',
  status: '',
  isActive: null,
  createdStartDate: '',
  createdEndDate: ''
})

// Status options for news
const statusOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'รอเปิดใบสั่งงาน', value: '' },
  { label: 'รอเบิกพัสดุ', value: '' },
  { label: 'ปิดใบสั่งงาน', value: '' },

]

const workServiceOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'งานเช่าหม้อแปลง', value: '' },
]


const workOrderTypeOptions = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'ใบสั่งงานหลัก', value: '' },
  { label: 'ใบสั่งงานย่อย', value: '' },
]


// Active status options
const activeOptions = [
  { label: 'ทั้งหมด', value: null },
  { label: 'เปิดใช้งาน', value: true },
  { label: 'ปิดใช้งาน', value: false }
]

// Watch for external changes to modelValue
watch(() => props.modelValue, (val) => {
  isVisible.value = val
})

// Watch for internal changes to isVisible
watch(isVisible, (val) => {
  emit('update:modelValue', val)
})

const closeDialog = () => {
  isVisible.value = false
}

const clearFilters = () => {
  filters.startDate = ''
  filters.endDate = ''
  filters.status = ''
  filters.isActive = null
  filters.createdStartDate = ''
  filters.createdEndDate = ''
}

const applyFilters = () => {
  // Validate date ranges
  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    // Show error message
    console.warn('วันที่เริ่มต้นไม่สามารถมากกว่าวันที่สิ้นสุดได้')
    return
  }

  if (filters.createdStartDate && filters.createdEndDate && filters.createdStartDate > filters.createdEndDate) {
    console.warn('วันที่สร้างเริ่มต้นไม่สามารถมากกว่าวันที่สร้างสิ้นสุดได้')
    return
  }

  emit('apply-filters', { ...filters })
  closeDialog()
}
</script>