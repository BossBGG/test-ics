<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">

    <RequestNormalDetail title="แบบคำร้องขอปรึกษาด้านวิศวกรรมและก่อสร้าง" :canEdit="CAN_EDIT.REQUEST.value" />

    <FormMBusinessType :readonly="!CAN_EDIT.REQUEST.value" v-model="requestServiceForm.business_type_id"
      custom-class="q-pa-sm col-12 col-md-12" />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />

  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
