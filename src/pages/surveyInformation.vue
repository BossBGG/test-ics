<script setup lang="ts">
// const { t } = useI18n();
// const requestStore = useRequestStore()
// const { request } = storeToRefs(requestStore)

// const id = useParams('uid')
// const serviceID = 'S305'

// onMounted(async () => {
//   loading.start()
//   await requestStore.fetchGetRequestsByUID(id, serviceID)
//   loading.stop()
// })
</script>

<template>
  <div>
    <FormDetailsRequest class="q-mt-lg" />
    <StatusBar class="q-mt-lg" custom-class="active3" />
    <DataServeyInformationMap class="q-mt-lg" />
    <DataServeyInformationAddressIDcard class="q-mt-lg" />
    <DataServeyInformationContactElectricityUser class="q-mt-lg" />
    <FormServeyInformationOperator class="q-mt-lg" />
    <FormServeyInformationHistory class="q-mt-lg" />
    <FormServeyButton class="q-mt-lg" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
