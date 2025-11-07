<!-- src/components/work_order/InsulationDateSelector.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface GeneratorDate {
  startDateTime: string;
  endDateTime: string;
}

interface Props {
  modelValue?: string;
  data?: GeneratorDate;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: GeneratorDate];
}>();

const selectedValue = ref(props.modelValue || "");

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue || "";
  }
);

const GeneratorDateSelector = ref<GeneratorDate>({
  startDateTime: props.data?.startDateTime || "",
  endDateTime: props.data?.endDateTime || "",
});

const updateField = (field: keyof GeneratorDate, value: string) => {
  GeneratorDateSelector.value[field] = value;
  emit("update:data", { ...GeneratorDateSelector.value });
};

// คำนวณจำนวนวัน
const totalDays = computed(() => {
  if (
    !GeneratorDateSelector.value.startDateTime ||
    !GeneratorDateSelector.value.endDateTime
  ) {
    return 0;
  }

  const startDate = new Date(GeneratorDateSelector.value.startDateTime);
  const endDate = new Date(GeneratorDateSelector.value.endDateTime);

  // คำนวณความแตกต่างในหน่วยมิลลิวินาที
  const timeDiff = endDate.getTime() - startDate.getTime();

  // แปลงเป็นวัน
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff > 0 ? daysDiff : 0;
});

const formatDateTime = (datetime: string) => {
  if (!datetime) return "ยังไม่ระบุ";
  const date = new Date(datetime);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const hasAnyDate = computed(() => {
  return (
    GeneratorDateSelector.value.startDateTime ||
    GeneratorDateSelector.value.endDateTime
  );
});
</script>

<template>
  <div>
    <div>
      <!-- Date Inputs Row -->
      <div class="date-inputs-row mb-4">
        <!-- วันที่เริ่มต้น -->
        <div class="date-input-group">
          <label class="date-label">วันที่เริ่มต้น</label>
          <q-input
            :model-value="GeneratorDateSelector.startDateTime"
            type="datetime-local"
            outlined
            placeholder="Invalid Date"
          
            @update:model-value="(value) => updateField('startDateTime', value)"
          >
          </q-input>
        </div>

        <!-- วันที่สิ้นสุด -->
        <div class="date-input-group">
          <label class="date-label">วันที่สิ้นสุด</label>
          <q-input
            :model-value="GeneratorDateSelector.endDateTime"
            type="datetime-local"
            outlined
            placeholder="Invalid Date"
           
            @update:model-value="(value) => updateField('endDateTime', value)"
          >
          </q-input>
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
