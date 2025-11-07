<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  onUpdate: {
    type: Function,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

</script>
<template>
  <q-toggle :model-value="modelValue"
            color="#9A3E7E"
            @update:modelValue="(v) => onUpdate(v)"
            :disable="disabled"
  />
</template>
