<template>
  <div style="max-width: 300px">
    <q-input
      filled
      :model-value="modelValue"
      @update:model-value="handleInputChange"
      :label="label"
      readonly
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :model-value="dateForPicker"
              @update:model-value="handleDateChange"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Date (DD/MM/YYYY)'
  }
})

const emit = defineEmits(['update:modelValue'])

// แปลง DD/MM/YYYY เป็น YYYY/MM/DD สำหรับ q-date
const dateForPicker = computed(() => {
  if (!props.modelValue) return ''
  const parts = props.modelValue.split('/')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return props.modelValue
})

// จัดการการเปลี่ยนแปลงจาก input (ไม่ทำอะไร เพราะเป็น readonly)
const handleInputChange = (value) => {
  // ไม่ทำอะไร เพราะ input เป็น readonly
}

// แปลง YYYY/MM/DD กลับเป็น DD/MM/YYYY
const handleDateChange = (value) => {
  if (!value) {
    emit('update:modelValue', '')
    return
  }
  const parts = value.split('/')
  if (parts.length === 3) {
    const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`
    emit('update:modelValue', formatted)
  } else {
    emit('update:modelValue', value)
  }
}
</script>
