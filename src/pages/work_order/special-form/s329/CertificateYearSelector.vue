div<!-- src/pages/work_order/special-form/s329/CertificateYearSelector.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import {S329ServiceData, WorkOrderObj} from "~/api/types";
import FormYearPicker from "~/components/form/FormYearPicker.vue";

interface YearData {
  yearNeeded: number | null;
  numberOfYears: number;
}

interface Props {
  data: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const yearData = ref<YearData>({
  yearNeeded: null,
  numberOfYears: 0,
});

onMounted(() => {
  handleMapData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapData()
}, { deep: true })

const handleMapData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S329ServiceData;
  if(serviceSpec){
    yearData.value = {
      yearNeeded: serviceSpec.year ? serviceSpec.year - 543 : 0,
      numberOfYears: serviceSpec.qty || 0
    }
  }
}

const updateField = (field: keyof YearData, value: number) => {
  yearData.value[field] = value;
  emitChanges();
};

const emitChanges = () => {
  let serviceSpec = props.data?.serviceSpecificData as S329ServiceData;
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      year: yearData.value.yearNeeded ? yearData.value.yearNeeded + 543 : yearData.value.yearNeeded,
      qty: yearData.value.numberOfYears,
    }
  }

  emit("update:data", newData)
};

const handleYearChange = (value: number) => {
  updateField("yearNeeded", value);
  emitChanges()
};
</script>

<template>
  <div class="s329-year-selector-form">
    <div class="s329-year-form-row">
      <!-- ปี พ.ศ. -->
      <div class="s329-form-group s329-year-input-group">
        <label class="s329-form-label">ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน</label>
        <FormYearPicker v-model="yearData.yearNeeded"
                        @update:model-value="handleYearChange"
        />
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
          @update:model-value="(value: string) => updateField('numberOfYears', parseInt(value) || 0)"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Import s329 styles */
@import "@/styles/s329.css";
</style>
