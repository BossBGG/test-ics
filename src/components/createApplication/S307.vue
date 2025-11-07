<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
const serviceItemsStore = useServiceItemStore();
const { transformerVoltages } = storeToRefs(serviceItemsStore);
onMounted(async () => {
  await serviceItemsStore.fetchTransformerVoltage();
});
</script>

<template>
  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    ประเภทธุรกิจ
  </div>

  <FormMBusinessType
    v-model="requestServiceForm.business_type_id"
    custom-class="q-pa-sm col-12 col-md-12"
    :is-show-label="false"
    :readonly="readonly"
  />

  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    Package<span class="color_negative text-weight-400">*</span>
    <span class="text-weight-400"> (เลือกได้ 1 รายการ)</span>
  </div>
  <q-field
    :model-value="requestServiceForm.transformer_voltage"
    lazy-rules
    :rules="[(val) => !!val || 'กรุณาเลือก Package']"
    hide-bottom-space
    borderless
    class="q-pl-sm field_radio_custom"
  >
    <div class="col-12" v-if="transformerVoltages.length">
      <div
        class="col-12 col-md-12"
        v-for="(option, index) in transformerVoltages"
        :key="index"
      >
        <q-radio
          :disable="readonly"
          v-model="requestServiceForm.transformer_voltage"
          label-color="grey-14"
          bg-color="white"
          right-label
          color="secondary"
          size="42px"
          :val="option.id"
          :label="option.option_title"
          class="custom_checkbox input_radio_costom_checkbox"
          :checked="option.id == requestServiceForm.transformer_voltage"
        />
      </div>
    </div>
  </q-field>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
