<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requestForm, nowRequestCode } = storeToRefs(requestStore);
const businessPartnerStore = useBusinessPartnerStore();

const surveyStore = useSurveyStore();
const { survey, surveyForm, surveyLogForm, validateSurveyForm, isDisabled } =
  storeToRefs(surveyStore);

const addressStore = useAddressStore();
const { addressRequest } = storeToRefs(addressStore);
const addressFormStore = useAddressFormStore();
const { addressRequestForm } = storeToRefs(addressFormStore);

const request_id = useParams("uid");
const fetchComplete = ref(false);

const goSurveyRules = [
  (val: any) => val !== null && val !== undefined || 'กรุณาเลือกการไปสำรวจ'
]

onMounted(async () => {
  loading.start();
  // await requestStore.fetchGetRequestsByUID(request_id.value);
  await businessPartnerStore.fetchBusinessPartnersByRequestID(
    request.value?.requests?.customer_request_no
  );
  await addressStore.getAddressByRequest(request_id.value, 2);
  await surveyStore.setRequestID(request_id.value);
  await surveyStore.fetchSurvey();
  await surveyStore.fetchSurveyLog();
  await surveyStore.fetchSurveyMen();
  await surveyStore.setSurveyForm();

  isDisabled.value =
    !CAN_EDIT.SURVEY.value ||
    (CAN_EDIT.SURVEY.value && survey?.value?.id && !EDIT_ACTION.value);

  if (!surveyForm.value.latitude || !surveyForm.value.longitude) {
    surveyForm.value.latitude = requestForm.value.latitude;
    surveyForm.value.longitude = requestForm.value.longitude;
  }

  await removeLocalStorage(`${request_id.value}_bpForm`);
  await removeLocalStorage(`${request_id.value}_addressIdCardForm`);
  await removeLocalStorage(`${request_id.value}_addressRequestForm`);
  await removeLocalStorage(`${request_id.value}_addressBillingForm`);
  await removeLocalStorage(`${request_id.value}_expiryDate`);

  fetchComplete.value = true;

  loading.stop();
});

watch(
  () => addressRequestForm.value,
  () => {
    if (
      fetchComplete.value &&
      addressRequest.value?.id &&
      !surveyForm.value.same_requesting_address
    ) {
      addressRequestForm.value.status = true;
    }
  },
  { deep: true }
);

watch(
  () => surveyForm.value,
  () => {
    if (fetchComplete.value && survey.value?.id) {
      surveyForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => surveyLogForm.value,
  () => {
    if (fetchComplete.value && survey.value?.id) {
      surveyLogForm.value.log_status = true;
    }
  },
  { deep: true }
);
</script>

<template>
  <ModalCancelRequest />
  <div class="wraper_survey">
    <FormDetailsRequest class="q-mt-lg" />
    <StatusBar class="q-mt-lg" custom-class="active3" />
    <template v-if="nowRequestCode != SERVICE.S16">
      <DataServeyInformationMap class="q-mt-lg" />
    </template>
    <q-form ref="validateSurveyForm">
      <DataServeyInformationAddressIDcard class="q-mt-lg" />
      <DataServeyInformationContactElectricityUser class="q-mt-lg" />
      <div class="col-12 col-md-12 flex justify-end mt-5">
        <q-field
          :model-value="surveyForm.is_attend_survey"
          :rules="goSurveyRules"
          borderless
          dense
          bottom-slots
          class="survey-radio-field"
        >
          <template #control>
            <div class="flex items-center">
              <q-radio
                v-model="surveyForm.is_attend_survey"
                class="input_radio_costom"
                :val="true"
                label="ไปสำรวจ"
                color="secondary"
              />
              <q-radio
                v-model="surveyForm.is_attend_survey"
                class="input_radio_costom"
                :val="false"
                label="ไม่ไปสำรวจ"
                color="secondary"
              />
            </div>
          </template>
        </q-field>
      </div>
      <FormServeyInformationOperator class="q-mt-lg" />
    </q-form>
    <FormServeyInformationHistory class="q-mt-lg" v-if="survey?.id" />
    <FormServeyButton class="q-mt-lg" />
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

.survey-radio-field {
  :deep(.q-field__bottom) {
    text-align: right;
  }
}
</style>

<route lang="yaml">
meta:
  middleware: [status]
  layout: default
</route>
