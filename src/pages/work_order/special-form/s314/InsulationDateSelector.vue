<!-- src/components/work_order/InsulationDateSelector.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import {RentalServiceData, WorkOrderObj} from "~/api/types";
import InputDatePicker from "~/components/form/InputDatePicker.vue";

interface InsulatorDateData {
  rentalStartDate: string;
  rentalEndDate: string;
}

interface Props {
  data?: WorkOrderObj;
  title: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const insulatorDateSelector = ref<InsulatorDateData>({
  rentalStartDate: "",
  rentalEndDate: "",
});

onMounted(() => {
  handleMapData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapData()
}, { deep: true })

const convertISOToDateFormat = (isoDate: string): string => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const handleMapData = () => {
  const serviceSpec = props.data?.serviceSpecificData as RentalServiceData
  if (serviceSpec) {
    insulatorDateSelector.value = {
      rentalStartDate: convertISOToDateFormat(serviceSpec.rentalStartDate || ""),
      rentalEndDate: convertISOToDateFormat(serviceSpec.rentalEndDate || ""),
    }
  }
}

// คำนวณจำนวนวัน
const totalDays = computed(() => {
  if (
    !insulatorDateSelector.value.rentalStartDate ||
    !insulatorDateSelector.value.rentalEndDate
  ) {
    return 0;
  }

  const startDate = convertDateToISOString(insulatorDateSelector.value.rentalStartDate);
  const endDate = convertDateToISOString(insulatorDateSelector.value.rentalEndDate);

  // คำนวณความแตกต่างในหน่วยมิลลิวินาที
  const timeDiff = new Date(endDate as string).getTime() - new Date(startDate as string).getTime();

  // แปลงเป็นวัน
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff > 0 ? daysDiff : 0;
});

const handleUpdate = (key: string, value: string) => {
  insulatorDateSelector.value[key as keyof InsulatorDateData] = value as string;
  let serviceSpec = props.data?.serviceSpecificData as RentalServiceData

  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      [key]: convertDateToISOString(value)
    }
  } as WorkOrderObj

  emit("update:data",newData);
}

const convertDateToISOString = (value: string | null | undefined): string | undefined => {

  if (!value) {
    return undefined;
  }

  const parts = value.split('/');
  if (parts.length !== 3) {
    console.warn(`Invalid date format: ${value}. Expected DD/MM/YYYY.`);
    return undefined;
  }

  const [dayStr, monthStr, yearStr] = parts;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.warn(`Invalid date components: ${value}.`);
    return undefined;
  }

  const dateObj = new Date(year, month - 1, day);
  return dateObj.toISOString();
}
</script>

<template>
  <div class="mb-6">
    <div>
      <div class="font-medium mb-3">{{title}}</div>
      <!-- Date Inputs Row -->
      <div class="date-inputs-row mb-4">
        <!-- วันที่เริ่มต้น -->
        <div class="date-input-group">
          <label class="date-label">วันที่เริ่มต้น</label>
          <InputDatePicker
            :model-value="insulatorDateSelector.rentalStartDate"
            @update:model-value="(v) => handleUpdate('rentalStartDate', v)"
          />
        </div>

        <!-- วันที่สิ้นสุด -->
        <div class="date-input-group">
          <label class="date-label">วันที่สิ้นสุด</label>
          <InputDatePicker
            :model-value="insulatorDateSelector.rentalEndDate"
            @update:model-value="(v) => handleUpdate('rentalEndDate', v)"
          />
        </div>

        <!-- จำนวนวัน -->
        <div class="days-count-group">
          <label class="count-date-label">จำนวนวัน</label>
          <div class="days-display">
            <span class="days-number">{{ totalDays }}</span>
            <span class="days-text">วัน</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Header styling to match the purple design */

/* Content area */

/* Date inputs row */
.date-inputs-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.count-date-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;

}

.insulation-datetime-input {
  width: 100%;
}

/* Days count styling */
.days-count-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 320px;
}

.days-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #f5f7f8;
  border: 2px solid #acadae;
  border-radius: 4px;
  padding: 12px 16px;
  height: 56px;

}

.days-number {
  font-size: 18px;
  font-weight: 700;
  color: #69306d;
}

.days-text {
  font-size: 14px;
  color: #6b7280;
}

/* Quasar Input Overrides */
:deep(.insulation-datetime-input .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
  min-height: 44px;
}

:deep(.insulation-datetime-input .q-field--outlined .q-field__control:hover) {
  border-color: #69306d;
}

:deep(
    .insulation-datetime-input
      .q-field--outlined.q-field--focused
      .q-field__control
  ) {
  border-color: #69306d;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

:deep(.insulation-datetime-input .q-field__inner) {
  padding: 12px 16px;
  font-size: 14px;
}

:deep(.insulation-datetime-input .q-field__control-container) {
  padding-top: 0;
}

:deep(.insulation-datetime-input .q-field__native) {
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .date-inputs-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .days-count-group {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .date-inputs-row {
    gap: 12px;
  }
}
</style>
