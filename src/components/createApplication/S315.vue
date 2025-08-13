<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate
  )
);
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

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.transformer_size"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="ขนาดหม้อแปลง"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณากรอกขนาดหม้อแปลง',
      ]"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
      :readonly="readonly"
    >
      <template #label>
        ขนาดหม้อแปลง<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.transformer_qty"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="จำนวนหม้อแปลง"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณากรอกจำนวนหม้อแปลง',
      ]"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
      :readonly="readonly"
    >
      <template #label>
        จำนวนหม้อแปลง<span class="color_negative">*</span>
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
      @keypress="allowOnlyNumbers"
      readonly
    >
      <template #label>
        จำนวนวัน<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
