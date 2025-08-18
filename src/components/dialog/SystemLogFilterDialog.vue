<!-- src/components/dialog/SystemLogFilterDialog.vue -->
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

        <!-- ประเภท -->
        <div class="filter-group">
          <label class="filter-label">ประเภท</label>
          <q-select
            v-model="filters.level"
            :options="logTypeOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="ประเภททั้งหมด"
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
import {logTypeOptions} from '~/data/systemLogData'
import {showError} from "~/composables/alert";

interface SystemLogFilterData {
  startDate: string
  endDate: string
  level: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'apply-filters': [filters: SystemLogFilterData]
}>()

const isVisible = ref(props.modelValue)

const filters = reactive<SystemLogFilterData>({
  startDate: '',
  endDate: '',
  level: '',
})

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
  filters.level = ''
}

const applyFilters = () => {
  // Validate date ranges
  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    showError('กรุณเลือกวันที่เริ่มต้นน้อยกว่าวันที่สิ้นสุด')
    return
  }

  emit('apply-filters', { ...filters })
  closeDialog()
}
</script>

<style scoped>
.filter-dialog-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 24px;
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.filter-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
}

.filter-dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.filter-close-btn {
  color: #6b7280;
  font-size: 24px;
}

.filter-close-btn:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.filter-dialog-content {
  padding: 24px;
  padding-top: 20px;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.date-range-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-input {
  flex: 1;
}

.date-separator {
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  min-width: 16px;
  text-align: center;
}

.filter-select,
.filter-input {
  width: 100%;
}

.filter-dialog-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 24px 24px 24px;
  gap: 16px;
}

.clear-btn {
  flex: 1;
  height: 48px;
  background-color: transparent;
  color: #69306D;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}


.search-btn {
  flex: 1;
  height: 48px;
  background-color: #69306D;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}



/* Override Quasar styles */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #6b46c1;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #6b46c1;
  box-shadow: 0 0 0 2px rgba(107, 70, 193, 0.1);
}

:deep(.q-field__native) {
  font-size: 16px;
  color: #374151;
}

:deep(.q-field__label) {
  font-size: 16px;
  color: #6b7280;
}

:deep(.q-select .q-field__append) {
  padding-right: 12px;
}

:deep(.q-input .q-field__append) {
  padding-right: 12px;
}

:deep(.q-btn--flat) {
  text-transform: none;
}
</style>
