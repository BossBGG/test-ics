<!-- src/components/dialog/FilterDialog.vue -->
<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card style="width: 500px; max-width: 80vw" class="bg-white">
      <q-bar class="bg-white text-black">
        <div class="text-xl font-medium">ตัวกรอง</div>
        <q-space />
        <q-btn dense flat icon="close" @click="closeDialog">
          <q-tooltip class="bg-white text-primary">ปิด</q-tooltip>
        </q-btn>
      </q-bar>
      
      <q-card-section class="q-pt-none">
        <div class="space-y-4">
          <!-- วันที่ -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">วันที่</label>
            <div class="flex items-center space-x-2">
              <div class="flex-1">
                <q-input
                  v-model="filters.startDate"
                  filled
                  type="date"
                  placeholder="DD/MM/YYYY"
                  class="w-full"
                  bg-color="white"
                />
              </div>
              <span class="text-gray-500">-</span>
              <div class="flex-1">
                <q-input
                  v-model="filters.endDate"
                  filled
                  type="date"
                  placeholder="DD/MM/YYYY"
                  class="w-full"
                  bg-color="white"
                />
              </div>
            </div>
          </div>

          <!-- สถานะ -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-2 block">สถานะ</label>
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              filled
              placeholder="สถานะทั้งหมด"
              bg-color="white"
              class="w-full"
              clearable
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-px-md q-pb-md">
        <div class="flex space-x-3 w-full">
          <q-btn
            flat
            label="เคลียร์ค่าทั้งหมด"
            class="flex-1 bg-gray-100 text-gray-700 rounded-md"
            @click="clearFilters"
          />
          <q-btn
            label="ค้นหา"
            class="flex-1 bg-purple-600 text-white rounded-md"
            @click="applyFilters"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { statusOptions } from '~/data/newsData'

interface FilterData {
  startDate: string
  endDate: string
  status: string
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
  status: ''
})

watch(() => props.modelValue, (val) => {
  isVisible.value = val
})

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
}

const applyFilters = () => {
  emit('apply-filters', { ...filters })
  closeDialog()
}
</script>

<style scoped>
:deep(.q-field__control) {
  border-radius: 6px;
}

:deep(.q-btn) {
  border-radius: 6px;
  text-transform: none;
  font-weight: 500;
}
</style>