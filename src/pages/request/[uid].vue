<script setup lang="ts">
const requestStore = useRequestStore();
const masterDataStore = useMasterDataStore();

const { nowRequestCode, requestForm, requestServiceForm, isNewCitySameOffice } =
  storeToRefs(requestStore);

const uid = useParams("uid");

const fetchComplete = ref(false);

onMounted(async () => {
  loading.start();
  const districtParam = nowRequestCode.value === "S332"
    ? undefined
    : requestForm.value.address_district !== undefined
      ? Number(requestForm.value.address_district)
      : undefined;
  await masterDataStore.fetchAllPeaOffice(districtParam);
  const expiryDate = await getLocalStorage(`${uid.value}_expiryDate`);

  if (Date.now() >= expiryDate) {
    await removeLocalStorage(`${uid.value}_bpForm`);
    await removeLocalStorage(`${uid.value}_addressIdCardForm`);
    await removeLocalStorage(`${uid.value}_addressRequestForm`);
    await removeLocalStorage(`${uid.value}_addressBillingForm`);
    await removeLocalStorage(`${uid.value}_expiryDate`);
  }

  isNewCitySameOffice.value = true;
  fetchComplete.value = true;
  // if (
  //   request.value?.requests?.latitude ||
  //   request.value?.requests?.status != "D"
  // ) {
  //   console.log("2");
  loading.stop();
  // }
});

watch(
  () => requestForm.value.service_code,
  () => {
    if (fetchComplete.value) {
      requestServiceForm.value.request_service = null;
    }
  }
);

watch(
  () => requestForm.value.latitude,
  (newValue) => {
    if (newValue) {
      loading.stop();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <ModalEditService />
    <ModalCancelRequest />
    <ModalTransferRequest />

    <div class="wraper_all">
      <FormDetailsRequest />
      <StatusBar class="q-mt-lg" custom-class="active1" />
      <FormInformationCustomerType v-if="nowServiceID()" />
      <div class="space"></div>
      <FormInformationStatusCustomer />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  middleware: [status]
</route>

<style lang="scss" scoped>
@import "@style";

.space {
  margin-bottom: 19px;
}

// .wraper_request {
//   padding-bottom: 68px;

//   @media #{$screen-mds-min} {
//     padding-bottom: 56px;
//   }
// }
.container {
  padding: 0 !important;

  .wraper_all {
    padding: 13px 0 56px;

    @media #{$screen-mds-min} {
      padding: 33px 0 68px;
    }

    @media #{$screen-xls-min} {
      padding: 33px 0 68px;
    }
  }
}
</style>
