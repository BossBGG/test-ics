<script lang="ts" setup>
import {Option} from "~/api/types";
import {debounce} from "lodash";

const props = defineProps({
  modelValue: String,
  options: {
    type: Array as PropType<Option[]>,
    required: true
  },
  key: String,
  placeholder: String,
  onUpdate: {
    type: Function,
    required: true
  },
  onChange: {
    type: Function,
    required: false
  },
  onOpen: {
    type: Function,
    required: false
  }
})
const value = computed(() => {
  return props.modelValue
})
const emit = defineEmits(['update:modelValue'])
const debounceChange = debounce((s: string) => {
  if(props.onChange) {
    props.onChange(s)
  }
}, 800)
</script>
<template>
  <q-select
    v-model="value"
    :options="options"
    outlined
    :placeholder="placeholder"
    class="material-select"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :key="key"
    @update:model-value="(e) => onUpdate(e.value as string)"
    @input-value="debounceChange"
    @popup-show="() => onOpen && onOpen()"
  />
</template>
