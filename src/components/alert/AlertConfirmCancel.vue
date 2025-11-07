<!-- src/components/alert/AlertConfirmCancel.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [value: boolean]
}>()

const isVisible = ref(props.modelValue)

const closeDialog = () => {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('confirm', false)
}

const confirmAction = () => {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('confirm', true)
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (val) => {
  isVisible.value = val
})

// Watch for internal changes to isVisible
watch(isVisible, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card class="alert-card">
      <!-- Header -->
      <q-bar class="alert-header">
        <span class="alert-title">ยกเลิกใบสั่งงานสร้างกลุ่มวัสดุและอุปกรณ์</span>
      </q-bar>
      
      <!-- Content -->
      <q-card-section class="alert-content">
        <div class="image-container">
          <img 
            src="/assets/images/cancel.png" 
            alt="ยกเลิก"
            class="cancel-image"
          />
        </div>
        <div class="message-container">
          <p class="cancel-message">
            ท่านต้องการยกเลิกใบสั่งงานรายการ <span class="highlight">'ใช่ หรือ ไม่'</span>
          </p>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="alert-actions">
        <div class="button-group">
          <q-btn
            flat
            label="ปิด"
            class="close-button"
            @click="closeDialog"
          />
          <q-btn
            flat
            label="ยืนยัน"
            class="confirm-button"
            @click="confirmAction"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.alert-card {
  width: 600px;
  max-width: 96vw;
  border-radius: 8px;
  overflow: hidden;
}

.alert-header {
  background-color: #69306D;
  color: white;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.alert-content {
  padding: 40px 20px 20px;
  text-align: center;
  background-color: #f8f9fa;
  
}

.image-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cancel-image {
  width: 120px;
  height: auto;
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.cancel-svg {
  width: 40px;
  height: 40px;
}

.message-container {
  margin-bottom: 10px;
}

.cancel-message {
  font-size: 16px;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.highlight {
  color: #65004A;
  font-weight: 600;
}

.alert-actions {
  padding: 20px;
  justify-content: center;
  background-color: #f8f9fa;
}

.button-group {
  display: flex;
  gap: 12px;
  width: 100%;
}

.close-button, .confirm-button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  min-height: 44px;
}

.close-button {
  background-color: #c8a2c8;
  color: white;
}

.close-button:hover {
  background-color: #b894b8;
}

.confirm-button {
  background-color: #69306D;
  color: white;
}

.confirm-button:hover {
  background-color: #5a285d;
}
</style>