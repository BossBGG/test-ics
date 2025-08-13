<!-- src/components/worker/DateAppointment.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'

interface AppointmentData {
  appointmentDate: string
  appointmentTime: string
}

interface Props {
  data?: AppointmentData
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:data': [value: AppointmentData]
}>()

const appointment = reactive<AppointmentData>({
  appointmentDate: props.data?.appointmentDate || '',
  appointmentTime: props.data?.appointmentTime || ''
})

const handleDateChange = (value: string) => {
  appointment.appointmentDate = value
  emit('update:data', { ...appointment })
}

const handleTimeChange = (value: string) => {
  appointment.appointmentTime = value
  emit('update:data', { ...appointment })
}

// รวมวันที่และเวลาเป็น datetime-local format
const handleDateTimeChange = (value: string) => {
  if (value) {
    const [date, time] = value.split('T')
    appointment.appointmentDate = date
    appointment.appointmentTime = time
    emit('update:data', { ...appointment })
  }
}

// สร้าง datetime-local value จากวันที่และเวลาที่แยกกัน
const getDateTimeValue = () => {
  if (appointment.appointmentDate && appointment.appointmentTime) {
    return `${appointment.appointmentDate}T${appointment.appointmentTime}`
  }
  return ''
}
</script>

<template>
  <CardCollapse title="นัดหมายติดตั้ง" icon="/assets/images/calendar.png">
    <div class="appointment-form">
      <div class="form-group">
        <label class="form-label">วัน/เวลาที่นัดหมาย</label>
        <q-input
          :model-value="getDateTimeValue()"
          type="datetime-local"
          outlined
          placeholder="เลือกวันที่และเวลา"
          class="form-input"
          @update:model-value="handleDateTimeChange"
        />
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.appointment-form {
  padding: 8px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-group {
    max-width: 100%;
  }
}
</style>