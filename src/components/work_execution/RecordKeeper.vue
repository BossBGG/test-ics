<!-- src/components/work_execution/RecordKeeper.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import SignatureSection from './SignatureSection.vue'

interface RecordKeeperData {
  employeeId: string
  position: string
  phoneNumber: string
  signature: string
}

interface Props {
  modelValue?: RecordKeeperData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: RecordKeeperData]
  'data-change': [data: RecordKeeperData]
}>()

const recordKeeperData = reactive<RecordKeeperData>({
  employeeId: props.modelValue?.employeeId || '356579 - นาย มงคล ธรรมปัญโน',
  position: props.modelValue?.position || 'คช 8',
  phoneNumber: props.modelValue?.phoneNumber || '098 - 84950689',
  signature: props.modelValue?.signature || ''
})

const updateData = () => {
  const data = { ...recordKeeperData }
  emit('update:modelValue', data)
  emit('data-change', data)
}

const handleEmployeeIdChange = (value: string) => {
  recordKeeperData.employeeId = value
  updateData()
}

const handlePositionChange = (value: string) => {
  recordKeeperData.position = value
  updateData()
}

const handlePhoneChange = (value: string) => {
  recordKeeperData.phoneNumber = value
  updateData()
}

const handleSignatureChange = (newSignature: string) => {
  recordKeeperData.signature = newSignature
  updateData()
}
</script>

<template>
  <CardCollapse 
    title="ผู้บันทึกปฏิบัติงาน" 
    icon="/assets/images/user.png"
  >
    <div class="record-keeper-container">
      <div class="record-keeper-layout">
        <!-- Left side - Form Fields -->
        <div class="form-section">
          <!-- Employee ID -->
          <div class="form-group">
            <label class="form-label">
              รหัสผู้บันทึกผลปฏิบัติงาน :
            </label>
            <div class="input-wrapper">
              <q-input
                :model-value="recordKeeperData.employeeId"
                outlined
                placeholder="รหัสผู้บันทึกผลปฏิบัติงาน"
                class="form-input"
                @update:model-value="handleEmployeeIdChange"
              />
            </div>
          </div>

          <!-- Position -->
          <div class="form-group">
            <label class="form-label">
              ตำแหน่งผู้บันทึกผลปฏิบัติงาน :
            </label>
            <q-input
              :model-value="recordKeeperData.position"
              outlined
              placeholder="ตำแหน่ง"
              class="form-input"
              @update:model-value="handlePositionChange"
            />
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label class="form-label">
              เบอร์โทรผู้บันทึกผลปฏิบัติงาน :
            </label>
            <q-input
              :model-value="recordKeeperData.phoneNumber"
              outlined
              placeholder="หมายเลขโทรศัพท์"
              class="form-input"
              @update:model-value="handlePhoneChange"
            />
          </div>
        </div>

        <!-- Right side - Signature Section -->
        <div class="signature-section-wrapper">
          <SignatureSection
            title="ภาพลายเซ็นผู้บันทึกผลปฏิบัติงาน"
            :signature="recordKeeperData.signature"
            :show-preset-signature="false"
            :show-reset-button="true"
            @signature-change="handleSignatureChange"
          />
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.record-keeper-container {
  padding: 16px 0;
}

.record-keeper-layout {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
}

/* Left section - Form Fields */
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 60%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input {
  width: 100%;
}

/* Right section - Signature */
.signature-section-wrapper {
  flex: 0 0 40%;
  width: 40%;
  max-width: 40%;
}

/* Quasar Input Overrides */
:deep(.form-input .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
  min-height: 44px;
}

:deep(.form-input .q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.form-input .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 3px rgba(105, 48, 109, 0.1);
}

:deep(.form-input .q-field__inner) {
  padding: 12px 16px;
}

:deep(.form-input .q-field__control-container) {
  padding-top: 0;
}

:deep(.form-input .q-field__native) {
  font-size: 14px;
  line-height: 1.5;
}

:deep(.form-input .q-field__native::placeholder) {
  color: #9ca3af;
}

/* Focus states */
:deep(.form-input .q-field--outlined.q-field--focused .q-field__control::before) {
  border-color: #69306D;
}

:deep(.form-input .q-field--outlined.q-field--focused .q-field__control::after) {
  transform: scale3d(1, 1, 1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .record-keeper-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-section,
  .signature-section-wrapper {
    flex: none;
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .record-keeper-container {
    padding: 12px 0;
  }
  
  .record-keeper-layout {
    gap: 16px;
  }
  
  .form-group {
    gap: 6px;
  }
  
  .form-label {
    font-size: 13px;
  }
  
  :deep(.form-input .q-field--outlined .q-field__control) {
    min-height: 40px;
  }
  
  :deep(.form-input .q-field__inner) {
    padding: 10px 12px;
  }
  
  :deep(.form-input .q-field__native) {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .record-keeper-container {
    padding: 8px 0;
  }
  
  .record-keeper-layout {
    gap: 12px;
  }
  
  .form-group {
    gap: 4px;
  }
  
  .form-label {
    font-size: 12px;
  }
  
  :deep(.form-input .q-field--outlined .q-field__control) {
    min-height: 36px;
  }
  
  :deep(.form-input .q-field__inner) {
    padding: 8px 10px;
  }
  
  :deep(.form-input .q-field__native) {
    font-size: 12px;
  }
}
</style>