<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{ dateRangeTime: { from: string, to: string } }>()

const emit = defineEmits<{
  (e: 'update:dateRangeTime', value: { from: string, to: string }): void
}>()

const localdateRange = ref<{
  from: string
  to: string
}>()
const popupDateRef = ref(null)

// ✅ Create a writable computed for v-model binding

const dateTimeRange = computed(() => `${props.dateRangeTime.from}-${props.dateRangeTime.to}`)
const formattedDate = computed({
  get: () => {
    return localdateRange.value// props.dateRangeTime
  },
  set: (val: { from: string, to: string }) => {
    localdateRange.value = val
    // emit('update:dateRangeTime', val)
  },
})

watch(props.dateRangeTime, (newVal) => {
  localdateRange.value = newVal
  // console.log('New date range selected:', newVal)
}, { immediate: true })

function restrictInput(event) {
  const regex = /[0-9/: ]/
  if (!regex.test(event.key)) {
    event.preventDefault()
  }
}

function closePopup() {
  if (popupDateRef.value) {
    popupDateRef.value.hide()
    emit('update:dateRangeTime', formattedDate.value)
  }
}

const labelText = 'วันที่'
</script>

<template>
  <!-- Use the writable computed -->
  <q-input
    v-model="dateTimeRange"
    maxlength="16"
    type="text"
    label
    label-color="grey-14"
    bg-color="white"
    class="input_filled input_filled_custom"
    filled
    hide-bottom-space
    @keypress="restrictInput"
    @paste="blockCopy"
  >
    <template #label>
      {{ labelText }}<span class="color_negative">*</span>
    </template>
    <template #append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="popupDateRef"
          anchor="bottom left"
          self="top left"
          fit
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="formattedDate" range>
            <div class="row items-center justify-end">
              <q-btn label="Close" color="primary" flat @click="closePopup" />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
