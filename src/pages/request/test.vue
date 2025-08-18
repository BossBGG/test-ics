<script setup lang="ts">
const requestStore = useRequestStore()

const id = useParams('uid')
const serviceID = 'S305'

onMounted(async () => {
  loading.start()

  await requestStore.fetchGetRequestsTest(id, serviceID)

  loading.stop()
})
</script>

<template>
  <div>
    <ModalEditService />
    <ModalCancelRequest />
    <ModalTransferRequest />
    <StatusBar class="q-mt-lg" />
    <!-- <pre>{{ id }}</pre> -->

    <!-- <div v-if="requestForm.first_name == 'arm'">you is arm</div> -->
    <!-- <input v-model="requestForm.first_name" type="text"> -->
    <FormInformationCustomerType class="q-mt-lg" />
    <FormInformationStatusCustomer class="q-mt-lg" />
    <!-- <pre>{{ requestStore }}</pre> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@style';
</style>
