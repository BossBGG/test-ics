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
  <FormRequestServiceType
    v-model="requestServiceForm.request_service_type"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />

  <FormAllTransformer :readonly="readonly" />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
