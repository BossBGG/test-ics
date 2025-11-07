<!-- src/pages/work_order/special-form/s332_Solar_Air_Conditioner/AdditionalData.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import {Options, S332SolarAirData, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const additionalData = ref<S332SolarAirData>({
  pipeLengthRefrigerantM: 0,
  cableLengthDcM: 0,
  cableLengthAcM: 0,
  houseFacingDirection: '',
});

const wiringOptions: Options[] = [
  {value: 'เหนือ', label: 'เหนือ'},
  {value: 'ใต้', label: 'ใต้'},
  {value: 'ตะวันออก', label: 'ตะวันออก'},
  {value: 'ตะวันตก', label: 'ตะวันตก'}
];

onMounted(() => {
  handleMapData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapData()
}, {deep: true})

const handleMapData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S332SolarAirData
  if (serviceSpec) {
    additionalData.value = {
      ...serviceSpec,
      houseFacingDirection: wiringOptions.find((opt) => opt.value === serviceSpec.houseFacingDirection) as Options || ""
    }
  }
}

const updateField = (field: keyof S332SolarAirData, value: any) => {
  additionalData.value[field] = value;
  emitChanges();
};

const emitChanges = () => {
  let serviceSpec = props.data?.serviceSpecificData as S332SolarAirData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      ...additionalData.value,
      houseFacingDirection: (additionalData.value.houseFacingDirection as Options)?.value || ""
    }
  } as WorkOrderObj

  emit('update:data', newData);
};

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
              :model-value="additionalData.pipeLengthRefrigerantM"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('pipeLengthRefrigerantM', parseInt(value) || 0)"
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>

        <!-- ระยะสายไฟ DC -->
        <div class="data-group">
          <label class="data-label">ระยะสายไฟ DC (จากแผงโซลาร์เซลล์ถึงคอยล์ร้อน) ประมาณ</label>
          <div class="input-with-unit">
            <q-input
              :model-value="additionalData.cableLengthDcM"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('cableLengthDcM', parseInt(value) || 0)"
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
              :model-value="additionalData.cableLengthAcM"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="(value) => updateField('cableLengthAcM', parseInt(value) || 0)"
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>

        <!-- หน้าบ้านหันทิศ -->
        <div class="data-group">
          <label class="data-label">หน้าบ้านหันทิศ</label>
          <q-select
            :model-value="additionalData.houseFacingDirection"
            :options="wiringOptions"
            outlined
            placeholder="เหนือ"
            class="direction-select"
            @update:model-value="(value) => updateField('houseFacingDirection', value)"
          />
        </div>
      </div>


    </div>
  </CardCollapse>
</template>



<style scoped>
    @import "@/styles/additional-data.css";
</style>
