div<!-- src/pages/work_order/special-form/s329/CertificateYearSelector.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";

interface YearData {
  yearNeeded: string;
  numberOfYears: string;
}

interface Props {
  modelValue?: YearData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: YearData];
  "data-change": [data: YearData];
}>();

const yearData = ref<YearData>({
  yearNeeded: props.modelValue?.yearNeeded || "",
  numberOfYears: props.modelValue?.numberOfYears || "",
});

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      yearData.value = { ...newValue };
    }
  },
  { deep: true }
);

const updateField = (field: keyof YearData, value: string) => {
  yearData.value[field] = value;
  emitChanges();
};

const emitChanges = () => {
  emit("update:modelValue", { ...yearData.value });
  emit("data-change", { ...yearData.value });
};

// Convert year to Buddhist Era for display
const convertToBuddhistYear = (gregorianYear: string) => {
  if (!gregorianYear) return "";
  const year = parseInt(gregorianYear);
  return year ? (year + 543).toString() : "";
};

// Convert Buddhist year back to Gregorian for storage
const convertToGregorianYear = (buddhistYear: string) => {
  if (!buddhistYear) return "";
  const year = parseInt(buddhistYear);
  return year ? (year - 543).toString() : "";
};

// Display year in Buddhist format
const displayYear = computed(() => {
  return convertToBuddhistYear(yearData.value.yearNeeded);
});

const handleYearChange = (value: string) => {
  // Store as Gregorian year internally
  const gregorianYear = convertToGregorianYear(value);
  updateField("yearNeeded", gregorianYear);
};
</script>

<template>
  <div class="s329-year-selector-form">
    <div class="s329-year-form-row">
      <!-- ปี พ.ศ. -->
      <div class="s329-form-group s329-year-input-group">
        <label class="s329-form-label">ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน</label>
        <q-input
          :model-value="displayYear"
          type="number"
          outlined
          placeholder="ปี พ.ศ."
          
          min="2500"
          max="2600"
          @update:model-value="handleYearChange"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="text-gray-400" />
          </template>
        </q-input>
      </div>

      <!-- จำนวนปี -->
      <div class="s329-form-group s329-years-count-group">
        <label class="s329-form-label">จำนวนปี</label>
        <q-input
          :model-value="yearData.numberOfYears"
          type="number"
          outlined
          placeholder="จำนวนปี"
          
          min="1"
          max="50"
          @update:model-value="(value) => updateField('numberOfYears', value)"
        />
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Import s329 styles */
@import "@/styles/s329.css";
</style>
