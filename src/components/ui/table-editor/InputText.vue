<script lang="ts" setup>

const props = defineProps({
  modelValue: String,
  key: String,
  placeholder: String,
  onUpdate: {
    type: Function,
    required: true
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
    outlined
    :placeholder="placeholder"
    @update:model-value="(val) => onUpdate(val)"
  />
</template>
