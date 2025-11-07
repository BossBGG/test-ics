<!-- src/pages/work_order/special-form/s332_Solar_Battery/AdditionalData.vue -->
<script setup lang="ts">
import {computed, ref, watch} from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import {S332SolarBatteryData, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const batteryData = ref<S332SolarBatteryData>({
  distancePanelToInverterM: 0,
  distanceInverterToDistributionM: 0,
  networkConnectionTypeId: "",
  networkConnectionTypeOther: "",
});

// ตัวเลือกประเภทการเชื่อมต่ออินเตอร์เน็ต
const connectionOptions = [
  {value: "LAN", label: "LAN"},
  {value: "WiFi", label: "WiFi"},
  {value: "other", label: "อื่นๆ"}
];

onMounted(() => {
  handleMapData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapData()
}, {deep: true})

const handleMapData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S332SolarBatteryData
  if(serviceSpec) {
    batteryData.value = {
      ...serviceSpec,
    }
  }
}

function updateField(field: keyof S332SolarBatteryData, value: any) {
  batteryData.value[field] = value;

  if (field === "networkConnectionTypeId" && value !== "other") {
    batteryData.value.networkConnectionTypeOther = "";
  }

  emitChanges();
}

function emitChanges() {
  let serviceSpec = props.data?.serviceSpecificData as S332SolarBatteryData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      ...batteryData.value,
    },
  } as WorkOrderObj

  emit("update:data", newData);
}

const showCustomField = computed(() => {
  return batteryData.value.networkConnectionTypeId === "other";
});
</script>

<template>
  <CardCollapse title="ข้อมูลเพิ่มเติม" icon="/assets/images/doc.png">
    <div class="additional-data-container">
      <div class="data-row">
        <!-- ระยะจากแผงโซลาร์สาย DC -->
        <div class="data-group">
          <label class="data-label"
          >ระยะจากแผงโซล่าเซลล์ ถึง อินเวอร์เตอร์</label
          >
          <div class="input-with-unit">
            <q-input
              :model-value="batteryData.distancePanelToInverterM"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="
                (value) => updateField('distancePanelToInverterM', parseInt(value) || 0)
              "
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>

        <!-- ระยะจากอินเวอร์เตอร์ -->
        <div class="data-group">
          <label class="data-label">ระยะจากอินเวอร์เตอร์ ถึง ตู้ไฟฟ้า</label>
          <div class="input-with-unit">
            <q-input
              :model-value="batteryData.distanceInverterToDistributionM"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="
                (value) => updateField('distanceInverterToDistributionM', parseInt(value) || 0)
              "
            />
            <span class="unit-text">เมตร</span>
          </div>
        </div>
      </div>

      <!-- Connection Type Section -->
      <div class="connection-section">
        <div class="connection-field">
          <label class="data-label">ระบบเครือข่ายอินเตอร์เน็ต</label>

          <!-- Radio Button Group -->
          <div class="radio-group">
            <div
              v-for="option in connectionOptions"
              :key="option"
              class="radio-item"
            >
              <q-radio
                :model-value="batteryData.networkConnectionTypeId"
                :val="option.value"
                :label="option.label"
                class="radio-button"
                @update:model-value="(value) => updateField('networkConnectionTypeId', value)"
              />
            </div>

            <!-- Custom Connection Input Field -->
            <div v-if="showCustomField" class="custom-connection-field">
              <q-input
                :model-value="batteryData.networkConnectionTypeOther"
                outlined
                placeholder="ระบุ"
                class="data-input custom-connection-input"
                @update:model-value="(value) => updateField('networkConnectionTypeOther', value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
@import "@/styles/additional-data.css";
</style>
