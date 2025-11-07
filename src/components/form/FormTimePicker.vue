<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: { start?: string, end?: string }
  label?: string
  readonly?: boolean
  required?: boolean
  rules?: ((val: any) => boolean | string)[]
  stepMinutes?: number
  startHour?: number
  endHour?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ start: '', end: '' }),
  label: 'เวลา',
  readonly: false,
  required: false,
  rules: () => [],
  stepMinutes: 30,
  startHour: 0,
  endHour: 23,
})

const emit = defineEmits<{
  'update:modelValue': [value: { start: string, end: string }]
}>()

const popupRef = ref<any>(null)
const inputRef = ref<any>(null)
const localStart = ref<string>('')
const localEnd = ref<string>('')

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function normalizeTime(val?: string) {
  if (!val)
    return ''
  // accept HH:mm or HH.mm
  const s = val.replace('.', ':')
  const [h, m] = s.split(':').map(x => Number.parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m))
    return ''
  return `${pad2(h)}:${pad2(m)}`
}

function toDisplay(val?: string) {
  if (!val)
    return ''
  return val.replace(':', '.')
}

function minutesDiff(a: string, b: string) {
  // Special case: 00:00 to 00:00 means 24 hours
  if (a === '00:00' && b === '00:00')
    return 24 * 60

  const [ah, am] = a.split(':').map(n => Number.parseInt(n, 10))
  const [bh, bm] = b.split(':').map(n => Number.parseInt(n, 10))
  const amins = ah * 60 + am
  const bmins = bh * 60 + bm
  return Math.max(0, bmins - amins)
}

const allTimes = computed(() => {
  const list: string[] = []
  const start = props.startHour * 60
  // include entire end hour up to :59 so steps like 30 include 23:30
  const end = props.endHour * 60 + 59
  const step = Math.max(5, props.stepMinutes)
  for (let m = start; m <= end; m += step) {
    const h = Math.floor(m / 60)
    const mm = m % 60
    list.push(`${pad2(h)}:${pad2(mm)}`)
  }
  return list
})

function initLocal() {
  localStart.value = normalizeTime(props.modelValue?.start)
  localEnd.value = normalizeTime(props.modelValue?.end)
}

function pickStart(t: string) {
  localStart.value = t
  // if end before start, clear end
  if (localEnd.value && minutesDiff(localStart.value, localEnd.value) <= 0)
    localEnd.value = ''
}

function pickEnd(t: string) {
  localEnd.value = t
}

function confirm() {
  if (localStart.value && localEnd.value) {
    emit('update:modelValue', { start: localStart.value, end: localEnd.value })
  }
  popupRef.value?.hide()
}

function clearAll() {
  localStart.value = ''
  localEnd.value = ''
  emit('update:modelValue', { start: '', end: '' })
  // also close popup if open
  popupRef.value?.hide()
}

const displayValue = computed(() => {
  const s = normalizeTime(props.modelValue?.start)
  const e = normalizeTime(props.modelValue?.end)
  if (!s && !e)
    return ''
  if (s && e) {
    const mins = minutesDiff(s, e)
    const hrs = (mins / 60)
    const hrsText = Number.isInteger(hrs) ? `${hrs}` : `${hrs.toFixed(1)}`
    return `${toDisplay(s)} - ${toDisplay(e)} ( ${hrsText} ชั่วโมง/วัน )`
  }
  return s ? `${toDisplay(s)} -` : `- ${toDisplay(e)}`
})

function isSelected(val: string, type: 'start' | 'end') {
  const target = type === 'start' ? localStart.value : localEnd.value
  return target === val
}
</script>

<template>
  <q-input
    ref="inputRef"
    v-model="displayValue"
    :label="label"
    :readonly="readonly"
    :rules="rules"
    filled
    class="input_filled input_filled_custom"
    bg-color="white"
    color="primary"
    label-color="grey-14"
    hide-bottom-space
  >
    <template #label>
      {{ label }} <span v-if="required" class="color_negative">*</span>
    </template>

    <template #append>
      <q-icon
        v-if="readonly && (props.modelValue?.start || props.modelValue?.end)"
        name="close"
        class="q-mr-sm text-grey-6 cursor-pointer"
        @click="clearAll"
      />
      <q-icon name="schedule" :class="readonly ? 'text-grey-5' : 'cursor-pointer'">
        <q-popup-proxy
          v-if="!readonly"
          ref="popupRef"
          :target="inputRef?.$el"
          anchor="bottom left"
          self="top left"
          fit
          transition-show="scale"
          transition-hide="scale"
          style="min-height: 370px !important;"
          @before-show="initLocal"
        >
          <div class="q-pa-md" style="min-width: 330px;">
            <!--
            <div class="q-mb-md row items-center justify-between">
              <div class="text-caption text-grey-7">
                {{ localStart ? toDisplay(localStart) : '--:--' }} -
                {{ localEnd ? toDisplay(localEnd) : '--:--' }}
              </div>
              <div class="text-caption text-primary">
                {{ localStart && localEnd ? (minutesDiff(localStart, localEnd) / 60) : 0 }} ชม./วัน
              </div>
            </div>
            <q-separator />
            -->
            <div class="row q-mt-md">
              <div class="col-6">
                <div class="q-mb-sm text-subtitle2 text-primary">
                  เริ่มต้น
                </div>
                <div style="max-height: 240px; overflow: auto;">
                  <div
                    v-for="t in allTimes"
                    :key="`s-${t}`"
                    class="q-pa-sm rounded-borders cursor-pointer"
                    :class="isSelected(t, 'start') ? 'bg-deep-purple-1 text-deep-purple-8' : ''"
                    style="width: 89px;"
                    @click="pickStart(t)"
                  >
                    {{ toDisplay(t) }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="q-mb-sm text-subtitle2 text-primary">
                  สิ้นสุด
                </div>
                <div style="max-height: 240px; overflow: auto;">
                  <div
                    v-for="t in allTimes"
                    :key="`e-${t}`"
                    style="width: 89px;"
                    class="q-pa-sm rounded-borders cursor-pointer"
                    :class="isSelected(t, 'end') ? 'bg-deep-purple-1 text-deep-purple-8' : ''"
                    @click="pickEnd(t)"
                  >
                    {{ toDisplay(t) }}
                  </div>
                </div>
              </div>
            </div>
            <div class="q-mt-md flex items-center justify-center">
              <q-btn v-close-popup label="ยืนยัน" color="deep-purple-6" unelevated @click="confirm" />
            </div>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
