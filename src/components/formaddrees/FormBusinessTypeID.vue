<script setup lang="ts">
const props = defineProps(["customClass", "dataType", "readonly"]);
const model = defineModel();

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartnerForm } = storeToRefs(businessPartnerStore);

const serviceItemStore = useServiceItemStore();
const { businessTypeFilters, businessTypes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchBusinessType();
  if (props.dataType == "all" || !props.dataType)
    serviceItemStore.setBusinessTypeFilters(businessTypes.value);
  else {
    const filters = businessTypes?.value?.filter(
      (item) => item.type == props.dataType
    );
    serviceItemStore.setBusinessTypeFilters(filters);
  }
});

watch(model, (newValue) => {
  if (newValue) {
    const selected = businessTypes.value.find((item) => item.code == newValue);
    businessPartnerForm.value.business_type_code = selected?.type;
    businessPartnerForm.value.business_type_description = selected?.text;
  }
});

const filterValue = ref("");

const filteredMaterials = computed(() => {
  const needle = filterValue.value.toLowerCase();

  let filteredOptions = businessTypes.value;

  if (needle) {
    filteredOptions = filteredOptions.filter((option) => {
      const code = option.text ? option.text.toLowerCase() : "";
      return code.includes(needle);
    });
  }

  return filteredOptions;
});

const filteredMaterialFilters = computed(() => {
  const needle = filterValue.value.toLowerCase();

  let filteredOptions = businessTypeFilters.value;

  if (needle) {
    filteredOptions = filteredOptions.filter((option) => {
      const code = option.text ? option.text.toLowerCase() : "";
      return code.includes(needle);
    });
  }

  return filteredOptions;
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <div :class="props.customClass">
    <q-select
      v-model="model"
      filled
      :options="
        props.dataType == 'all' ? filteredMaterials : filteredMaterialFilters
      "
      input-debounce="0"
      hide-selected
      fill-input
      @filter="filterFn"
      lazy-rules
      use-input
      clearable
      label
      class="input_filled select-business"
      hide-bottom-space
      map-options
      emit-value
      option-value="code"
      :option-label="(option) => `${option?.text ?? ''}`"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกสังกัด/กิจการ',
      ]"
      :readonly="props.readonly"
    >
      <template #label>
        สังกัด/กิจการ<span class="color_negative">*</span>
      </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
