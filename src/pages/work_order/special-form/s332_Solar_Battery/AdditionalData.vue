<!-- src/pages/work_order/special-form/s332_Solar_Battery/AdditionalData.vue -->
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";

interface SolarBatteryDataInfo {
  batteryDistance: string;
  inverterDistance: string;
  connectionType: string;
  customConnection: string;
}

interface Props {
  modelValue?: SolarBatteryDataInfo;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: SolarBatteryDataInfo];
  "data-change": [data: SolarBatteryDataInfo];
}>();

const batteryData = ref<SolarBatteryDataInfo>({
  batteryDistance: props.modelValue?.batteryDistance || "",
  inverterDistance: props.modelValue?.inverterDistance || "",
  connectionType: props.modelValue?.connectionType || "",
  customConnection: props.modelValue?.customConnection || "",
});

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      batteryData.value = { ...newValue };
    }
  },
  { deep: true },
);

// ตัวเลือกประเภทการเชื่อมต่ออินเตอร์เน็ต
const connectionOptions = ["LAN", "WiFi", "อื่นๆ"];

function updateField(field: keyof SolarBatteryDataInfo, value: string) {
  batteryData.value[field] = value;

  // ถ้าเปลี่ยนจาก "อื่นๆ" เป็นตัวเลือกอื่น ให้เคลียร์ customConnection
  if (field === "connectionType" && value !== "อื่นๆ") {
    batteryData.value.customConnection = "";
  }

  emitChanges();
}

function emitChanges() {
  emit("update:modelValue", { ...batteryData.value });
  emit("data-change", { ...batteryData.value });
}

const hasAnyBatteryData = computed(() => {
  return (
    batteryData.value.batteryDistance ||
    batteryData.value.inverterDistance ||
    batteryData.value.connectionType ||
    batteryData.value.customConnection
  );
});

const showCustomField = computed(() => {
  return batteryData.value.connectionType === "อื่นๆ";
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
              :model-value="batteryData.batteryDistance"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="
                (value) => updateField('batteryDistance', value)
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
              :model-value="batteryData.inverterDistance"
              type="number"
              outlined
              class="data-input"
              min="0"
              step="0.01"
              @update:model-value="
                (value) => updateField('inverterDistance', value)
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
                :model-value="batteryData.connectionType"
                :val="option"
                :label="option"
                class="radio-button"
                @update:model-value="
                  (value) => updateField('connectionType', value)
                "
              />
            </div>

            <!-- Custom Connection Input Field -->
            <div v-if="showCustomField" class="custom-connection-field">
              <q-input
                :model-value="batteryData.customConnection"
                outlined
                placeholder="ระบุ"
                class="data-input custom-connection-input"
                @update:model-value="
                  (value) => updateField('customConnection', value)
                "
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
