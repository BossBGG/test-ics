<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอตรวจสอบและทดสอบสถานีอัดประจุไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormRequestService
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.request_service"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <FormRequestTime
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.request_time"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model="requestServiceForm.equipment_no"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        maxlength="10"
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'กรุณาเลือกหมายเลขเครื่องวัดฯ',
        ]"
      >
        <template #label>
          หมายเลขเครื่องวัดฯ<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <FormPlaceForm
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.place_form"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <FormWireForm
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.wire_form"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.qty_ev"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        maxlength=""
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'กรุณาเลือกจำนวนรถยนต์ EV ที่มี',
        ]"
        @keypress="allowOnlyPrice"
        @paste="copyOnlyNumber"
      >
        <template #label>
          จำนวนรถยนต์ EV ที่มี<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <FormPackageService
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.package_service"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <FormPackageRequest
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.package_request"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <FilePreview
      :links="splitTextWith(requestServiceForm.files, ',')"
      custom-class="col-12 row q-pa-sm"
    />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
