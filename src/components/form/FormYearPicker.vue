<template>
  <q-input
    :model-value="modelValue ? yearType === 'buddhist' ? (modelValue + 543).toString() : modelValue.toString() : ''"
    :label="label"
    outlined
    readonly
    @click="showDialog = true"
  >
    <template v-slot:prepend class="relative">
      <div class="text-sm text-[#57595B]">ปี {{ yearType === 'buddhist' ? 'พ.ศ.' : 'ค.ศ.' }}</div>
      <q-icon name="event" class="text-gray-400 absolute right-5" />
    </template>
  </q-input>

  <q-dialog v-model="showDialog">
    <q-card class="w-80">
      <q-card-section class="flex items-center justify-between">
        <div class="text-h6">เลือกปี</div>
        <q-btn flat round dense icon="close" @click="showDialog = false" />
      </q-card-section>

      <q-card-section>
        <div class="flex items-center justify-between mb-4">
          <q-btn
            flat
            round
            icon="chevron_left"
            @click="previousRange"
            :disable="currentRangeStart <= startYear"
          />
          <span class="text-subtitle1">{{yearType === 'buddhist' ? currentRangeStart + 543 : currentRangeStart }} - {{ yearType === 'buddhist' ? currentRangeEnd + 543 : currentRangeEnd }}</span>
          <q-btn
            flat
            round
            icon="chevron_right"
            @click="nextRange"
            :disable="currentRangeEnd >= endYear"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="year in yearRange"
            :key="year"
            :class="[
              'p-2 rounded border text-center transition-colors',
              (yearType === 'buddhist' ? year - 543 : year) === modelValue
                ? 'bg-primary text-white'
                : 'hover:bg-primary hover:text-white border-gray-300'
            ]"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: number | null
  label?: string
  startYear?: number
  endYear?: number
  yearType?: 'buddhist' | 'christian'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  startYear: () => new Date().getFullYear() - 100,
  endYear: () => new Date().getFullYear() + 10,
  yearType: 'buddhist'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const showDialog = ref(false)
const currentRangeStart = ref(Math.floor((props.modelValue || new Date().getFullYear()) / 12) * 12)

const currentRangeEnd = computed(() => Math.min(currentRangeStart.value + 11, props.endYear))

const yearRange = computed(() => {
  const years = []
  for (let year = currentRangeStart.value; year <= currentRangeEnd.value; year++) {
    if (year >= props.startYear && year <= props.endYear) {
      const displayYear = props.yearType === 'buddhist' ? year + 543 : year
      years.push(displayYear)
    }
  }
  return years
})

const selectYear = (displayYear: number) => {
  const actualYear = props.yearType === 'buddhist' ? displayYear - 543 : displayYear
  emit('update:modelValue', actualYear)
  showDialog.value = false
}

const previousRange = () => {
  currentRangeStart.value = Math.max(currentRangeStart.value - 12, props.startYear)
}

const nextRange = () => {
  currentRangeStart.value = Math.min(currentRangeStart.value + 12, props.endYear - 11)
}
</script>
