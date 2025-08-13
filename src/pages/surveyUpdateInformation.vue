<script setup lang="ts">
// // const { t } = useI18n();
// const requestStore = useRequestStore();
// const { request } = storeToRefs(requestStore);

// const id = useParams("uid");
// const serviceID = "S305";

// onMounted(async () => {
//   loading.start();
//   await requestStore.fetchGetRequestsByUID(id.value, serviceID);
//   loading.stop();
// });
</script>

<template>
  <div>
    <FormDetailsRequest class="q-mt-lg" />
    <StatusBar class="q-mt-lg" custom-class="active3" />
    <FormServeyDetail class="q-mt-lg" />
    <FormServeyInformationHistory class="q-mt-lg" />
    <FormServeyButtonUpdate class="q-mt-lg" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
