<!-- src/pages/work_order/special-form/s329/CertificateRequirement.vue -->
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

// ตัวเลือกสำหรับความต้องการใบรับรอง
const certificateOptions = [
  "ต้องการใบรับรองการผลิตพลังงานหมุนเวียน",
  "ไม่ต้องการใบรับรองการผลิตพลังงานหมุนเวียน",
  "พิจารณาภายหลัง",
];

const handleValueChange = (newValue: string) => {
  selectedValue.value = newValue;
  emit("update:modelValue", newValue);
  emit("change", newValue);
};
</script>

<template>
  <div class="s329-certificate-form">
    <div class="s329-form-group">
      <label class="s329-form-label">
        สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
      </label>
      <q-select
        :model-value="selectedValue"
        :options="certificateOptions"
        outlined
        
        @update:model-value="handleValueChange"
      />
    </div>

    <!-- Selected Display -->
    <div
      v-if="selectedValue"
      class="s329-selected-display s329-certificate-selected"
    >
      <p class="s329-selected-text">
        การเลือก:
        <span class="s329-selected-value">{{ selectedValue }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Import s329 styles */
@import "@/styles/s329.css";
</style>
