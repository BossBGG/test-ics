<!-- src/components/dialog/MaterialEquipmentFilterDialog.vue -->
<script setup lang="ts">
import { reactive, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    showDate?: boolean;
  }>(),
  {
    showDate: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "apply-filters": [filters: { status: string }];
}>();

const isVisible = ref(props.modelValue);

const filters = reactive<{ status: string }>({
  status: "",
});

// Status options for material equipment
const statusOptions = [
  { label: "ทั้งหมด", value: "" },
  { label: "เปิดใช้งาน", value: "true" },
  { label: "ปิดใช้งาน", value: "false" },
];

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (val) => {
    isVisible.value = val;
  },
);

// Watch for internal changes to isVisible
watch(isVisible, (val) => {
  emit("update:modelValue", val);
});

function closeDialog() {
  isVisible.value = false;
}

function clearFilters() {
  filters.status = "";
}

function applyFilters() {
  emit("apply-filters", { ...filters });
  closeDialog();
}
</script>

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
        <!-- สถานะ -->
        <div class="filter-group">
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
          />
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
        <q-btn label="ค้นหา" class="search-btn" @click="applyFilters" />
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.filter-dialog-card {
  width: 600px;
  max-width: 90vw;
  border-radius: 24px;
  background: white;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.filter-select {
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
  color: #69306d;
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
  background-color: #69306d;
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
