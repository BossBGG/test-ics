<script setup>
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">

    <RequestNormalDetail title="แบบคำร้องขอซื้อข้อมูล Load Profile" :canEdit="CAN_EDIT.REQUEST.value" />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />

  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
