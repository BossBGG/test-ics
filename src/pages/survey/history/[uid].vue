<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requestForm, requestServiceForm, nowRequestCode } = storeToRefs(requestStore);
const businessPartnerStore = useBusinessPartnerStore();

const surveyStore = useSurveyStore();
const { validateSurveyForm } = storeToRefs(surveyStore);

const request_id = useParams("uid");

onMounted(async () => {
  loading.start();
  // await requestStore.fetchGetRequestsByUID(request_id.value);
  await businessPartnerStore.fetchBusinessPartnersByRequestID(
    request.value.requests?.customer_request_no
  );

  await surveyStore.setRequestID(request_id.value);
  await surveyStore.fetchSurveyLog();
  await surveyStore.fetchSurveyMen();

  await removeLocalStorage(`${request_id.value}_bpForm`);
  await removeLocalStorage(`${request_id.value}_addressIdCardForm`);
  await removeLocalStorage(`${request_id.value}_addressRequestForm`);
  await removeLocalStorage(`${request_id.value}_expiryDate`);
  await removeLocalStorage(`${request_id.value}_addressBillingForm`);

  loading.stop();
});

</script>

<template>
  <ModalCancelRequest />
  <div class="wraper_survey">
    <FormDetailsRequest class="q-mt-lg" />
    <StatusBar class="q-mt-lg" custom-class="active3" />

    <q-form ref="validateSurveyForm">
      <FormServeyDetail class="q-mt-lg" :disable="true" />
    </q-form>
    <FormServeyInformationHistory class="q-mt-lg" />
    <AddressForm v-if="nowRequestCode === SERVICE.S16" class="q-mt-lg" :disable="false" />
    <SurveyHistoryS316 v-if="nowRequestCode === SERVICE.S16" class="q-mt-lg" />
    <FormServeyButtonUpdate class="q-mt-lg" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.wraper_survey {
  padding-bottom: 68px;

  @media #{$screen-mds-min} {
    padding-bottom: 56px;
    // padding-bottom: 100px;
  }
}
</style>

<route lang="yaml">
meta:
  middleware: [status]
  layout: default
</route>
