<script setup lang="ts">
import FormSolarType from '../form/ServiceItem/FormSolarType.vue';

const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div calss="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    ประเภทโซลาร์
  </div>
  <FormSolarType
    v-model="requestServiceForm.solar_type"
    custom-class="q-pa-sm col-12 col-md-12"
    :readonly="readonly"
  />

</template>

<style lang="scss" scoped>
@import "@style";
</style>
