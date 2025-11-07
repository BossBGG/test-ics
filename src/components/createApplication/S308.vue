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
    custom-class="q-pa-sm col-12 col-md-12"
    :is-show-label="false"
    :readonly="readonly"
  />
  <div class="q-pa-sm col-12 col-md-12">
    <q-input
      v-model.number="requestServiceForm.transformer_size"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      class="input_filled input_filled_custom"
      filled
      hide-bottom-space
      label
      maxlength="4"
      :readonly="readonly"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
    >
      <template #label> ขนาดหม้อแปลงที่ติดตั้งรวม </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
