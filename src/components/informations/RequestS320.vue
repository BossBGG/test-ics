<script setup>
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอติดตั้งมิเตอร์เปรียบเทียบ กรณีผิดปกติ"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormMBusinessType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.business_type_id"
      custom-class="q-pa-sm col-12 col-md-12"
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
