<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [type: string];
}>();

const isVisible = ref(props.modelValue);
const selectedType = ref("ใบสั่งงาน");

const downloadTypes = [
  { label: "ใบสั่งงาน", value: "ใบสั่งงาน" },
  { label: "ใบเบิกของ", value: "ใบเบิกของ" },
  { label: "ใบส่งซ่อม", value: "ใบส่งซ่อม" },
];

const closeDialog = () => {
  isVisible.value = false;
  emit("update:modelValue", false);
};

const confirmDownload = () => {
  emit("confirm", selectedType.value);
  closeDialog();
};

watch(
  () => props.modelValue,
  (val) => {
    isVisible.value = val;
  },
);

watch(isVisible, (val) => {
  emit("update:modelValue", val);
});
</script>

<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card class="download-dialog-card">
      <div class="dialog-header">
        <h2 class="dialog-title">ดาวน์โหลดเอกสาร</h2>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-btn"
          @click="closeDialog"
        />
      </div>

      <div class="dialog-content">
        <div class="select-content">
          <label class="selection-label">เลือกประเภทเอกสาร</label>
          <div class="radio-group">
            <div
              v-for="type in downloadTypes"
              :key="type.value"
              class="radio-item"
            >
              <input
                :id="type.value"
                v-model="selectedType"
                :value="type.value"
                type="radio"
                class="radio-input"
              />

              <label :for="type.value" class="radio-label">
                <span class="radio-custom"></span>
                {{ type.label }}
              </label>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <q-btn flat label="ปิด" class="cancel-btn" @click="closeDialog" />
          <q-btn
            label="ดาวน์โหลด"
            class="download-btn"
            @click="confirmDownload"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.download-dialog-card {
  width: 700px;
  max-width: 90vw;
  border-radius: 16px;
  background: white;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0px 24px 24px;
  background: #69306d;
  height: 56px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.close-btn {
  color: white;
  font-size: 20px;
}

.close-btn:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.dialog-content {
  padding: 24px;
}

.selection-container {
  width: 100%;
}

.selection-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
}

.radio-group {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 16px;
}

.radio-item {
  position: relative;
  width: 100%;
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #374151;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.radio-label:hover {
  border-color: #69306d;
  background-color: #f8f9fa;
}

.radio-input:checked + .radio-label {
  border-color: #69306d;
  background-color: #f3e8ff;
  color: #69306d;
  font-weight: 500;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.radio-input:checked + .radio-label .radio-custom {
  border-color: #69306d;
}

.radio-custom::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #69306d;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.radio-input:checked + .radio-label .radio-custom::after {
  opacity: 1;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 0 24px 24px 24px;
}

.cancel-btn {
  background-color: #c8a2c8;
  color: white;
  border: none;
  width: 240px;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #b894b8;
}

.download-btn {
  background-color: #69306d;
  color: white;
  border: none;
  width: 240px;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background-color: #5a285d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .download-dialog-card {
    width: 95vw;
    margin: 0 auto;
  }

  .dialog-header,
  .dialog-content,
  .dialog-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .radio-label {
    font-size: 14px;
    padding: 10px 12px;
  }
}
</style>
