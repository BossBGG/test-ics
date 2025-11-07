<script lang="ts" setup>
import {Option, Options} from "~/api/types";
import {debounce} from "lodash";

const props = defineProps({
  modelValue: String,
  options: {
    type: Array as PropType<Option[] | Options[]>,
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
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :key="key"
    @update:model-value="(e) => onUpdate(e)"
    @input-value="debounceChange"
    @popup-show="() => onOpen && onOpen()"
    :readonly="disabled"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          ไม่พบข้อมูล
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
