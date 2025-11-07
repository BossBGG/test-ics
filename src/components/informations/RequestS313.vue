<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm, requestTransformerForm } =
  storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">

    <RequestNormalDetail title="แบบคำร้องขอทดสอบหม้อแปลงไฟฟ้า" :canEdit="CAN_EDIT.REQUEST.value" />

    <FormRequestServiceType :readonly="!CAN_EDIT.REQUEST.value" v-model="requestServiceForm.request_service_type"
      custom-class="q-pa-sm col-12 col-md-6" />

    <FormRequestService :readonly="!CAN_EDIT.REQUEST.value" v-model="requestServiceForm.request_service"
      custom-class="q-pa-sm col-12 col-md-6" />

    <FormAllTransformer :readonly="!CAN_EDIT.REQUEST.value" />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />

  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
