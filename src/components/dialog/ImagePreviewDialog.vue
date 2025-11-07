<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps(['modelValue', 'images', 'startIndex'])
const emit = defineEmits(['update:modelValue'])

const { modelValue, images, startIndex } = props

const isOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const idx = ref(props.startIndex ?? 0)
const len = computed(() => props.images?.length ?? 0)
const canSlide = computed(() => len.value > 1)
const current = computed(() => props.images?.[idx.value] || '')

watch(len, (l) => {
  if (!l) {
    idx.value = 0
  }
  else if (idx.value > l - 1) {
    idx.value = l - 1
  }
})

function next() {
  if (len.value <= 1) {
    return
  }
  idx.value = (idx.value + 1) % len.value
}
function prev() {
  if (len.value <= 1) {
    return
  }
  idx.value = (idx.value - 1 + len.value) % len.value
}

function downloadCurrent() {
  if (!current.value) {
    return
  }
  const a = document.createElement('a')
  a.href = current.value
  a.download = current.value.split('/').pop() || 'image'
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) {
    return
  }
  if (e.key === 'ArrowRight') {
    next()
  }
  else if (e.key === 'ArrowLeft') {
    prev()
  }
  else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 1082px; max-width: 95vw; height: 700px; max-height: 95vh; padding: 16px;">
      <div class="full-height relative-position">
        <div class="img-area flex-center relative-position item-center flex bg-white">
          <q-icon v-if="canSlide" style="font-size: 40px;" name="chevron_left" @click="prev" />
          <q-img :src="current" fit="contain" style="width: 90%; height: 100%; max-height: 500px;" />
          <q-icon v-if="canSlide" style="font-size: 40px;" name="chevron_right" @click="next" />
        </div>
        <div class="text-primary" style="margin-left: auto; cursor: pointer; text-align: right;" @click="downloadCurrent">
          <q-icon name="download" style="cursor: pointer; font-size: 20px;" />
          ดาวน์โหลด
        </div>

        <div class="q-pt-md flex-center flex">
          <q-btn color="secondary" label="ปิด" class="q-px-xl width-270 height-40" @click="isOpen = false" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.img-area {
  height: calc(700px - 140px);
}
</style>
