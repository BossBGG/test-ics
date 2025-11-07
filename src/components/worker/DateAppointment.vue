<!-- src/components/worker/DateAppointment.vue -->
<script setup lang="ts">
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import {WorkOrderObj} from "~/api/types.js";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:data': [value: WorkOrderObj]
}>()

const appointmentDate = ref<Date | string | null | undefined>(props.data.appointmentDate as Date || undefined)

watch(() => appointmentDate.value, (newVal) => {
  handleDateTimeChange(newVal as string)
})

const handleDateTimeChange = (value: string) => {
  let newData = {
    ...props.data,
    appointmentDate: value
  }
  emit('update:data', newData)
}

</script>

<template>
  <CardCollapse title="นัดหมายติดตั้ง" icon="/assets/images/calendar.png">
    <div class="appointment-form">
      <div class="form-group">
        <label class="form-label">วัน/เวลาที่นัดหมาย</label>
        <FormDateTimePicker v-model="appointmentDate"
                            labelText="วัน/เวลาที่นัดหมาย"
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
