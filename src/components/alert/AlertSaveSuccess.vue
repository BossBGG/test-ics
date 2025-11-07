<!-- src/components/alert/AlertSaveSuccess.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isVisible = ref(props.modelValue)

const closeDialog = () => {
  isVisible.value = false
  emit('update:modelValue', false)
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
        <span class="alert-title">บันทึกแบบร่าง</span>
      </q-bar>
      
      <!-- Content -->
      <q-card-section class="alert-content">
        <div class="image-container">
          <img 
            src="/assets/images/success.png" 
            alt="สำเร็จ"
            class="success-image"
          />
        </div>
        <div class="message-container">
          <p class="success-message">
            บันทึกแบบร่าง <span class="highlight">'สำเร็จ'</span>
          </p>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="alert-actions">
        <q-btn
          flat
          label="ปิด"
          class="close-button"
          @click="closeDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.alert-card {
  width: 500px;
  max-width: 96vw;
  border-radius: 8px;
  overflow: hidden;
}

.alert-header {
  background-color: #69306D;
  color: white;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 600;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
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

.success-image {
  width: 240px;
  height: auto;
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.message-container {
  margin-bottom: 10px;
}

.success-message {
  font-size: 16px;
  color: #333;
  margin: 0;
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

.close-button {
  background-color: #c8a2c8;
  color: white;
  padding: 12px 40px;
  width: 60%;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  min-width: 120px;
}

.close-button:hover {
  background-color: #b894b8;
}
</style>