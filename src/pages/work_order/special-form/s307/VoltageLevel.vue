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

const serviceOptions = [{ value: "22-33 kV", label: "22-33 kV" }];

// Get option labels for display
const businessOptionLabels = serviceOptions.map((option) => option.label);

// Computed property to get selected label
const selectedLabel = computed(() => {
  const option = serviceOptions.find(
    (opt) => opt.value === selectedValue.value
  );
  return option ? option.label : "";
});

const handleValueChange = (newLabel: string) => {
  // Find the value corresponding to the selected label
  const option = serviceOptions.find((opt) => opt.label === newLabel);
  if (option) {
    selectedValue.value = option.value;
    emit("update:modelValue", option.value);
    emit("change", option.value);
  }
};
</script>

<template>
  <div class="pb-4">
    <div >
      <div class="pb-4">ระดับแรงดันไฟฟ้า</div>

      <div>
        <q-select
          :model-value="selectedLabel"
          :options="businessOptionLabels"
          outlined
          placeholder="เลือกประเภทธุรกิจ"
          @update:model-value="handleValueChange"
        />
      </div>

      <!-- Selected Business Type Display -->
      <div v-if="selectedValue">
        <p>
          ระดับแรงดันไฟฟ้า:
          <span>{{ selectedLabel }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
