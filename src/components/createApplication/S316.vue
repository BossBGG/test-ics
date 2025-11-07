<script setup lang="ts">
const { readonly } = defineProps(['readonly'])
const requestStore = useRequestStore()
const { requestServiceForm } = storeToRefs(requestStore)
const serviceItemStore = useServiceItemStore()
const { kwSizes } = storeToRefs(serviceItemStore)

const filterValue = ref('')
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return kwSizes.value
  }
  const needle = filterValue.value.toLowerCase()
  return kwSizes.value.filter((option) => {
    const code = option.option_title ? option.option_title.toLowerCase() : ''

    return code.includes(needle)
  })
})

function filterFn(val, update) {
  filterValue.value = val
  update()
}

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate,
  ),
)

onMounted(async () => {
  await serviceItemStore.fetchKwSize()
})
</script>

<template>
  <div class="q-pa-sm col-12 col-md-6">
    <q-select
      v-model="requestServiceForm.kw_size"
      class="border_dashed input_filled_custom select-m-business-type"
      label="จำนวน kW"
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
      clearable
      :options="filteredMaterials"
      :option-value="(option) => `${option.id}`"
      :option-label="(option) => `${option.option_title}`"
      :readonly="readonly"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกจำนวน kW']"
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
  </div>

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.qty"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="จำนวนเครื่อง"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :readonly="readonly"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
    >
      <template #label>
        จำนวนเครื่อง
      </template>
    </q-input>
  </div>

  <FormDatePicker
    v-model="requestServiceForm.rental_startdate"
    custom-class="q-pa-sm col-12 col-md-4"
    label-text="วันที่เริ่มต้น"
    :readonly="readonly"
  />

  <FormDatePicker
    v-model="requestServiceForm.rental_enddate"
    custom-class="q-pa-sm col-12 col-md-4"
    label-text="วันที่สิ้นสุด"
    :readonly="readonly"
  />

  <div class="q-pa-sm col-12 col-md-4">
    <q-input
      v-model.number="requestServiceForm.days"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="จำนวนวัน"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[(val) => (val !== null && val !== '') || 'กรุณากรอกจำนวนวัน']"
      readonly
      @keypress="allowOnlyNumbers"
    >
      <template #label>
        จำนวนวัน <span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import '@style';
</style>
