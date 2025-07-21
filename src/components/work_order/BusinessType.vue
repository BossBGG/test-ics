<!-- src/components/work_order/BusinessType.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";

interface Props {
  modelValue?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const selectedValue = ref(props.modelValue || "");

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue || "";
  }
);

const businessOptions = [
  { value: "house", label: "บ้านอยู่อาศัย" },
  { value: "manufacturing", label: "ธุรกิจการผลิต" },
  { value: "trading", label: "ธุรกิจการค้า" },
  { value: "agriculture", label: "ธุรกิจการเกษตร" },
  { value: "technology", label: "ธุรกิจเทคโนโลยี" },
];

// Get option labels for display
const businessOptionLabels = businessOptions.map((option) => option.label);

// Computed property to get selected label
const selectedLabel = computed(() => {
  const option = businessOptions.find(
    (opt) => opt.value === selectedValue.value
  );
  return option ? option.label : "";
});

const handleValueChange = (newLabel: string) => {
  // Find the value corresponding to the selected label
  const option = businessOptions.find((opt) => opt.label === newLabel);
  if (option) {
    selectedValue.value = option.value;
    emit("update:modelValue", option.value);
    emit("change", option.value);
  }
};
</script>

<template>
  <div class="business-type-container">
    <div class="business-type-form">
      <label class="business-label"> ประเภทธุรกิจ </label>

      <div class="select-wrapper">
        <q-select
          :model-value="selectedLabel"
          :options="businessOptionLabels"
          outlined
          placeholder="เลือกประเภทธุรกิจ"
          class="business-select"
          @update:model-value="handleValueChange"
        />
      </div>

      <!-- Selected Business Type Display -->
      <div v-if="selectedValue" class="selected-display">
        <p class="selected-text">
          ประเภทธุรกิจที่เลือก:
          <span class="selected-value">{{ selectedLabel }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.business-type-container {
  padding: 8px 0;
}

.business-type-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.business-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.select-wrapper {
  width: 100%;
}

.business-select {
  width: 100%;
}

.selected-display {
  margin-top: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.selected-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.selected-value {
  font-weight: 500;
  color: #374151;
}

/* Quasar Select Overrides */
:deep(.business-select .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
  min-height: 44px;
}

:deep(.business-select .q-field--outlined .q-field__control:hover) {
  border-color: #69306d;
}

:deep(.business-select .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306d;
  box-shadow: 0 0 0 3px rgba(105, 48, 109, 0.1);
}

:deep(.business-select .q-field__inner) {
  padding: 12px 16px;
}

:deep(.business-select .q-field__control-container) {
  padding-top: 0;
}

:deep(.business-select .q-field__native) {
  font-size: 14px;
  line-height: 1.5;
}

:deep(.business-select .q-field__native::placeholder) {
  color: #9ca3af;
}

/* Focus states */
:deep(
    .business-select
      .q-field--outlined.q-field--focused
      .q-field__control::before
  ) {
  border-color: #69306d;
}

:deep(
    .business-select
      .q-field--outlined.q-field--focused
      .q-field__control::after
  ) {
  transform: scale3d(1, 1, 1);
}

/* Dropdown styling */
:deep(.q-menu) {
  border-radius: 8px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

:deep(.q-item) {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

:deep(.q-item:hover) {
  background-color: #f3f4f6;
}

:deep(.q-item--active) {
  background-color: #69306d;
  color: white;
}

:deep(.q-item--active:hover) {
  background-color: #5a285d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-type-container {
    padding: 6px 0;
  }

  .business-type-form {
    gap: 10px;
  }

  .business-label {
    font-size: 13px;
  }

  :deep(.business-select .q-field--outlined .q-field__control) {
    min-height: 40px;
  }

  :deep(.business-select .q-field__inner) {
    padding: 10px 14px;
  }

  :deep(.business-select .q-field__native) {
    font-size: 13px;
  }

  .selected-display {
    padding: 10px;
    margin-top: 10px;
  }

  .selected-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .business-type-container {
    padding: 4px 0;
  }

  .business-label {
    font-size: 12px;
  }

  :deep(.business-select .q-field--outlined .q-field__control) {
    min-height: 36px;
  }

  :deep(.business-select .q-field__inner) {
    padding: 8px 12px;
  }

  :deep(.business-select .q-field__native) {
    font-size: 12px;
  }

  .selected-display {
    padding: 8px;
    margin-top: 8px;
  }

  .selected-text {
    font-size: 12px;
  }
}
</style>
