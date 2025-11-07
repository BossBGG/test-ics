<script setup lang="ts">
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// Proxy for v-model that emits updates
const model = computed({
  get: () => (props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue)),
  set: (val: unknown) => {
    const num = typeof val === 'number' ? val : Number(String(val))
    emit('update:modelValue', Number.isNaN(num) ? null : num)
  },
})

const serviceItemStore = useServiceItemStore()
const { generators } = storeToRefs(serviceItemStore)

onMounted(async () => {
  await serviceItemStore.fetchGeneratorSizes()
})

const filterValue = ref('')
const filteredMaterials = computed(() => {
  const list = Array.isArray(generators.value) ? generators.value : []
  if (!filterValue.value)
    return list
  const needle = filterValue.value.toLowerCase()
  return list.filter((option: any) => {
    const code = String(option?.ref_generator_size_desc ?? '').toLowerCase()
    return code.includes(needle)
  })
})

function filterFn(val: string, update: (cb?: () => void) => void) {
  filterValue.value = val
  update()
}

function optionValue(opt: any) {
  return String(opt?.ref_generator_size_id ?? '')
}

function optionLabel(opt: any) {
  return String(opt?.ref_generator_size_desc ?? '')
}

function requiredRule(val: unknown) {
  return (val !== null && val !== undefined && String(val) !== '') || 'กรุณาเลือกเครื่องกำเนิดไฟฟ้า'
}
</script>

<template>
  <q-select
    v-model="model"
    class="border_dashed input_filled_custom select-m-business-type"
    label="ขนาดเครื่องกำเนิดไฟฟ้า"
    filled
    bg-color="white"
    color="primary"
    label-color="grey-14"
    hide-bottom-space
    hide-selected
    emit-value
    use-input
    fill-input
    lazy-rules
    input-debounce="0"
    map-options
    :options="filteredMaterials"
    :option-value="optionValue"
    :option-label="optionLabel"
    :rules="[requiredRule]"
    @filter="filterFn"
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

<style scoped lang="scss">
:deep(.q-field__native) {
  padding-bottom: 0px;
}
:deep(.q-field__control:hover:before) {
  opacity: 0 !important;
}
</style>
