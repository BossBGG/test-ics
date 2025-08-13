<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    ประเภทธุรกิจ
  </div>

  <FormMBusinessType
    v-model="requestServiceForm.business_type_id"
    custom-class="q-pa-sm col-12"
    :is-show-label="false"
    :readonly="readonly"
  />

  <FormEquipmentType
    :readonly="readonly"
    v-model="requestServiceForm.equipment_type_id"
    custom-class="q-pa-sm col-12 col-md-6"
  />

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.qty"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label
      class="input_filled input_filled_custom"
      hide-bottom-space
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
      :readonly="readonly"
    >
      <template #label>จำนวน<span class="color_negative">*</span></template>
    </q-input>
  </div>

  <FilePreview
    :links="splitTextWith(requestServiceForm.files, ',')"
    custom-class="col-12 row q-pa-sm"
  />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
