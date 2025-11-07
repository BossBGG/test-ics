<script setup lang="ts">
import { defineProps } from 'vue'

const { modelValue, readonly, allowUpdateItem } = defineProps<['modelValue', 'readonly', 'allowUpdateItem']>()
const isPopupShow = ref(false)

isPopupShow.value = modelValue
</script>

<template>
  <q-dialog v-model="isPopupShow" persistent>
    <q-card class="bg-white text-black">
      <q-card-section class="row q-pa-sm items-center">
        <div class="text-h6">
          เลือกเครื่องกำเนิดไฟฟ้า
        </div>
        <q-space />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <select-electric-popup :readonly="props.readonly" :allow-update-item="props.allowUpdateItem" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-sm">
        <q-btn flat label="ปิด" color="primary" @click="$emit('update:modelValue', false)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
