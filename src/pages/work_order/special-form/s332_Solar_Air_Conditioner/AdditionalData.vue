<!-- src/pages/work_order/special-form/s332_Solar_Air_Conditioner/AdditionalData.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";

interface AdditionalDataInfo {
  roofSlope: string;
  acPowerDC: string;
  acPower: string;
  houseDirection: string;
}

interface Props {
  modelValue?: AdditionalDataInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: AdditionalDataInfo];
  "data-change": [data: AdditionalDataInfo];
}>();

const additionalData = ref<AdditionalDataInfo>({
  roofSlope: props.modelValue?.roofSlope || '',
  acPowerDC: props.modelValue?.acPowerDC || '',
  acPower: props.modelValue?.acPower || '',
  houseDirection: props.modelValue?.houseDirection || '',
});

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      additionalData.value = { ...newValue };
    }
  },
  { deep: true }
);

// ตัวเลือกทิศทาง
const directionOptions = [
  'เหนือ',
  'ใต้', 
  'ตะวันออก',
  'ตะวันตก',
  'ตะวันออกเฉียงเหนือ',
  'ตะวันออกเฉียงใต้',
  'ตะวันตกเฉียงเหนือ',
  'ตะวันตกเฉียงใต้'
];

const updateField = (field: keyof AdditionalDataInfo, value: string) => {
  additionalData.value[field] = value;
  emitChanges();
};

const emitChanges = () => {
  emit('update:modelValue', { ...additionalData.value });
  emit('data-change', { ...additionalData.value });
};

const hasAnyData = computed(() => {
  return additionalData.value.roofSlope || 
         additionalData.value.acPowerDC || 
         additionalData.value.acPower || 
         additionalData.value.houseDirection;
});
</script>

<template>
  <CardCollapse 
    title="ข้อมูลเพิ่มเติม" 
    icon="/assets/images/doc.png"
  >
    <div class="additional-data-container">
    
      <div class="data-row">
        <!-- ระยะก่อน่ายอกองหลังคา -->
        <div class="data-group">
          <label class="data-label">ระยะท่อน้ำยาแอร์ (จากคอยล์ร้อนถึงคอยล์เย็น) ประมาณ</label>
          <div class="input-with-unit">
            <q-input
              :model-value="additionalData.roofSlope"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('roofSlope', value)"
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>

        <!-- ระยะสายไฟ DC -->
        <div class="data-group">
          <label class="data-label">ระยะสายไฟ DC (จากแผงโซลาร์เซลล์ถึงคอยล์ร้อน) ประมาณ</label>
          <div class="input-with-unit">
            <q-input
              :model-value="additionalData.acPowerDC"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('acPowerDC', value)"
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>
      </div>

      <!-- Data Row 2 -->
      <div class="data-row">
        <!-- ระยะสายไฟ AC -->
        <div class="data-group">
          <label class="data-label">ระยะสายไฟ AC (จากตู้ไฟถึงคอยล์ร้อน)</label>
          <div class="input-with-unit">
            <q-input
              :model-value="additionalData.acPower"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('acPower', value)"
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>

        <!-- หน้าบ้านหันทิศ -->
        <div class="data-group">
          <label class="data-label">หน้าบ้านหันทิศ</label>
          <q-select
            :model-value="additionalData.houseDirection"
            :options="directionOptions"
            outlined
            placeholder="เหนือ"
            class="direction-select"
            @update:model-value="(value) => updateField('houseDirection', value)"
          />
        </div>
      </div>

      
    </div>
  </CardCollapse>
</template>



<style scoped>
    @import "@/styles/additional-data.css";
</style>