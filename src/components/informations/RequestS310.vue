<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">

    <RequestNormalDetail title="แบบคำร้องขอปรึกษาด้านวิศวกรรมไฟฟ้า/ตรวจรับรองระบบ" :canEdit="CAN_EDIT.REQUEST.value" />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />

  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
