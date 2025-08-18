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
  <FilePreview
    :links="splitTextWith(requestServiceForm.files, ',')"
    custom-class="col-12 row q-pa-sm"
  />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
