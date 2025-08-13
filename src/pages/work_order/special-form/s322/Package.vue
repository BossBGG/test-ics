<!-- src/components/work_order/Package.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue?: string;
  showPackageButton?: boolean; // เปิด/ปิดการแสดงปุ่ม Package
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  showPackageButton: true
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
  "package-click": []; // event เมื่อคลิกปุ่ม Package
}>();

const selectedValue = ref(props.modelValue || "");

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue || "";
  }
);

const packageOptions = [
  { value: "package1", label: "Package1" },
  { value: "package2", label: "Package2" },
  { value: "package3", label: "Package3" },
];

// Get option labels for display
const packageOptionLabels = packageOptions.map((option) => option.label);

// Computed property to get selected label
const selectedLabel = computed(() => {
  const option = packageOptions.find(
    (opt) => opt.value === selectedValue.value
  );
  return option ? option.label : "";
});

const handleValueChange = (newLabel: string) => {
  // Find the value corresponding to the selected label
  const option = packageOptions.find((opt) => opt.label === newLabel);
  if (option) {
    selectedValue.value = option.value;
    emit("update:modelValue", option.value);
    emit("change", option.value);
  }
};

const handlePackageClick = () => {
  emit("package-click");
};
</script>

<template>
  <div class="package-container">
    <div class="package-form">
      <label class="package-label">Package</label>

      <div class="package-input-row">
        <!-- Package Select Dropdown -->
        <div class="select-wrapper">
          <q-select
            :model-value="selectedLabel"
            :options="packageOptionLabels"
            outlined
            placeholder="เลือก Package"
            class="package-select"
            @update:model-value="handleValueChange"
          />
        </div>

        <!-- Package Button -->
        <button
          v-if="showPackageButton"
          @click="handlePackageClick"
          class="package-button"
          type="button"
        >
          <img src="/assets/images/package.png" alt="" class="w-6 h-6">
          Package
        </button>
      </div>

      
    </div>
  </div>
</template>

<style scoped>
.package-container {
  padding: 8px 0;
}

.package-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.package-input-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.select-wrapper {
  flex: 1;
}

.package-select {
  width: 100%;
}

.package-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #69306D;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  height: 55px;
  white-space: nowrap;
  flex-shrink: 0;
}

.package-button:hover {
  background: #5a285d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(105, 48, 109, 0.3);
}

.package-button:active {
  transform: translateY(0);
}

.package-icon {
  font-size: 18px;
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


</style>