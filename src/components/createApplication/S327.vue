<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <FormRequestService
    v-model="requestServiceForm.request_service"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <FormRequestTime
    v-model="requestServiceForm.request_time"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model="requestServiceForm.equipment_no"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="รหัสเครื่องวัด * (10 หลัก)"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาระบุรหัสเครื่องวัด',
      ]"
      :readonly="readonly"
    >
      <template #label>
        รหัสเครื่องวัด<span class="color_negative">*</span> (10 หลัก)
      </template>
    </q-input>
  </div>

  <FormPlaceForm
    v-model="requestServiceForm.place_form"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    รูปแบบสายไฟฟ้า
  </div>

  <FormWireForm
    v-model="requestServiceForm.wire_form"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.qty_ev"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      :stack-label="model ?? false"
      label="จำนวนรถยนต์ EV ที่มี"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[
        (val) =>
          (val !== null && val !== '') || 'กรุณาระบุจำนวนรถยนต์ EV ที่มี',
      ]"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
      :readonly="readonly"
    >
      <template #label>
        จำนวนรถยนต์ EV ที่มี<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>

  <FormPackageService
    v-model="requestServiceForm.package_service"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <FormPackageRequest
    v-model="requestServiceForm.package_request"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <FilePreview
    :links="splitTextWith(requestServiceForm.files, ',')"
    custom-class="col-12 row q-pa-sm"
  />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
