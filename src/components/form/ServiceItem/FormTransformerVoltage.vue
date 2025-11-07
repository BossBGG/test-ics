<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const voltage = defineModel("voltage", { required: true });
const voltage_other = defineModel("voltage_other", { required: true });

const requestStore = useRequestStore();
const { request } = storeToRefs(requestStore);
const serviceItemStore = useServiceItemStore();
const { transformerVoltages } = storeToRefs(serviceItemStore);
const isOtherSelected = ref(false);
const isOnMounted = ref(true);
onMounted(async () => {
  await serviceItemStore.fetchTransformerVoltage();

  const hasData = transformerVoltages.value.find(
    (item) => item?.id === voltage.value,
  );
  isOtherSelected.value = hasData?.is_other;

  if (!hasData) {
    isOnMounted.value = true;
  }
});

watch(
  () => voltage.value,
  (newVal) => {
    const hasData = transformerVoltages.value.find(
      (item) => item?.id === newVal,
    );
    isOtherSelected.value = hasData?.is_other;
  },
);

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return transformerVoltages.value;
  }
  const needle = filterValue.value.toLowerCase();
  return transformerVoltages.value.filter((option) => {
    const code = option.option_title ? option.option_title.toLowerCase() : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <div :class="props.customClass">
    <div class="row">
      <q-select
        v-model="voltage"
        class="border_dashed input_filled_custom"
        :class="isOtherSelected ? 'col-12 col-md-6 select_other' : 'col-12'"
        label
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
        map-options
        input-debounce="0"
        clearable
        @filter="filterFn"
        :options="filteredMaterials"
        :option-value="(option) => `${option.id}`"
        :option-label="(option) => `${option.option_title}`"
        :readonly="props.readonly"
        :rules="[(val) => (val && val.length > 0) || 'กรุณาเลือกแรงดัน']"
      >
        <template #label>แรงดัน<span class="color_negative">*</span></template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input
        v-if="isOtherSelected"
        :class="isOtherSelected ? 'col-12 col-md-6 input_other' : 'col-12'"
        class="input_filled input_filled_custom"
        v-model="voltage_other"
        filled
        bg-color="white"
        color="primary"
        label-color="grey-14"
        label="ระบุแรงดัน"
        hide-bottom-space
        :rules="[(val) => (val && val.length > 0) || 'กรุณาระบุแรงดัน']"
        :readonly="props.readonly"
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
      >
        <template #label>
          ระบุแรงดัน<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.select_other {
  padding-right: 0px;
  padding-bottom: 8px;

  @media #{$screen-xl-min} {
    padding-right: 8px;
    padding-bottom: 0px;
  }
}

.input_other {
  padding-left: 0px;
  padding-top: 8px;

  @media #{$screen-xl-min} {
    padding-left: 8px;
    padding-top: 0px;
  }
}
</style>
