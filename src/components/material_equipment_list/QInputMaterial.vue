<script lang="ts" setup>

const props = defineProps({
  modelValue: Number,
  key: String,
  placeholder: String,
  onUpdate: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const value = computed(() => {
  return props.modelValue
})
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <q-input
    v-model="value"
    type="number"
    min="0"
    step="1"
    outlined
    placeholder="จำนวน"
    class="material-number-input"
    @update:model-value="(val) => onUpdate(val as number)"
    :disable="disabled"
  />
</template>
