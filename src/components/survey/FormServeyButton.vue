<script setup lang="ts">
const modalConfirmStore = useModalConfirmStore();
const { isModalConfirm, isModalAlert, isModalAlertReload, dataAlert } =
  storeToRefs(modalConfirmStore);

const requestStore = useRequestStore();
const { request } = storeToRefs(requestStore);

const businessStore = useBusinessPartnerStore();
const { businessPartner, contractAccount } = storeToRefs(businessStore);

const addressStore = useAddressStore();
const { addressRequest, addressSurvey } = storeToRefs(addressStore);

const addressFormStore = useAddressFormStore();
const { addressRequestForm, addressSurveyForm } = storeToRefs(addressFormStore);

const surveyStore = useSurveyStore();
const { survey, surveyForm, validateSurveyForm, request_id, isDisabled } =
  storeToRefs(surveyStore);

const action = useQuery("action");
const saveButtonLabel = "บันทึกและรอผลสำรวจ";
const saveSuccess = ref(false);

async function saveSurvey() {
  loading.start();
  // if (!surveyForm.value.same_requesting_address) {
  //   if (addressSurvey.value.id) {
  //     await addressFormStore.updateAddress(
  //       addressSurvey.value.id,
  //       addressSurveyForm.value
  //     );
  //   } else {
  //     await addressFormStore.createAddress(addressSurveyForm.value);
  //   }
  // }

  const _survey = await surveyStore.getSurvey();
  if (!survey.value?.id) {
    if (_survey?.id) {
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "คำร้องหมายเลขนี้ได้ดำเนินการแล้ว",
        text: "กรุณาตรวจสอบใหม่อีกครั้ง",
        icon: "close",
      };
      isModalAlertReload.value = true;
      loading.stop();
      return;
    }
  } else if (survey.value?.updated_date != _survey?.updated_date) {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "คำร้องหมายเลขนี้ได้ดำเนินการแล้ว",
      text: "กรุณาตรวจสอบใหม่อีกครั้ง",
      icon: "close",
    };
    isModalAlertReload.value = true;
    loading.stop();
    return;
  }

  surveyForm.value.same_requesting_address = true;
  if (addressRequestForm.value.status) {
    await addressFormStore.updateAddress(
      addressRequest.value.id,
      addressRequestForm.value
    );
  }
  const data = await surveyStore.updateOrCreateSurvey();

  loading.stop();

  if (data?.data?.result) {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลสำเร็จ",
      text: saveButtonLabel.value,
      icon: "check",
    };

    isModalAlert.value = true;
    saveSuccess.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลไม่สำเร็จ",
      text: saveButtonLabel.value,
      icon: "close",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
}

function comfirmSubmit(status) {
  if (status) saveSurvey();
}

async function checkConfirm() {
  const isValidated = await validateSurveyForm.value.validate();

  if (isValidated) isModalConfirm.value = true;
  else
    validateSurveyForm.value.$el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
}

function nextStep() {
  if (survey.value.id)
    window.location.href = `/survey/history/${request_id.value}?action=edit`;
}

watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && saveSuccess.value) {
      window.location.href = `/survey/history/${request_id.value}?action=edit`;
    }
  }
);
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertReload :data="dataAlert" />
  <AlertConfirm :text="saveButtonLabel" @confirm-click="comfirmSubmit" />

  <div class="box_btn_center q-mt-xl">
    <q-btn
      flat
      :label="BUTTON_TEXT.PREV"
      class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      :to="`/application/${request_id}?bp=${businessPartner?.bp_no || ''}&ca=${
        contractAccount?.ca_no || ''
      }&action=view`"
    />
    <q-btn
      @click="openCancelRequestModal()"
      flat
      :label="BUTTON_TEXT.REQUEST.CANCEL"
      class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white btn-cancel-request"
      v-if="CAN_EDIT.CANCEL.value"
    />

    <q-btn
      v-if="
        CAN_EDIT.SURVEY.value &&
        (EDIT_ACTION || (!EDIT_ACTION && !survey?.id)) &&
        (request.requests?.status == `I` || request.requests?.status == `C`)
      "
      flat
      :label="BUTTON_TEXT.SURVEY.SAVE"
      @click="checkConfirm"
      class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white survey-save-btn"
    />
    <q-btn
      v-else-if="
        CAN_EDIT.SURVEY.value && !EDIT_ACTION && request.requests?.status == `I`
      "
      flat
      :label="BUTTON_TEXT.SURVEY.EDIT"
      :href="setCurrentPath({ action: `edit` })"
      @click="isDisabled = false"
      class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
    />
    <q-btn
      flat
      :label="BUTTON_TEXT.SURVEY.NEXT"
      class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
      @click="nextStep"
      v-if="survey?.id"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
