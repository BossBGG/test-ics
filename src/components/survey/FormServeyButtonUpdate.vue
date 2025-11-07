<script setup lang="ts">
const modalConfirmStore = useModalConfirmStore();
const { isModalConfirm, isModalAlert, isModalAlertReload, dataAlert } =
  storeToRefs(modalConfirmStore);

const requestStore = useRequestStore();
const { request, requestForm, requestServiceForm } = storeToRefs(requestStore);

const surveyStore = useSurveyStore();
const { survey_logs, surveyLogForm, validateSurveyForm, request_id } =
  storeToRefs(surveyStore);

const uid = useParams("uid");
const action = useQuery("action");
const confirm = ref(false);
const saveButtonLabel = ref("");

const saveSuccess = ref(false);
// const dataAlert = ref({
//   colorText: "primary",
//   colorIcon: "white",
//   title: "บันทึกข้อมูล",
//   text: saveButtonLabel.value,
//   icon: "check",
//   // showStatus: "true",
// });

async function saveSurveyLog() {
  const _survey = await surveyStore.getSurvey();
  const _surveyLogs = await surveyStore.getSurveyLog();
  if (_survey?.status == "S") {
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
  } else if (survey_logs.value?.length != _surveyLogs?.length) {
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

  requestServiceForm.value.kw_size_reservation = [
    ...requestServiceForm.value.kw_size_reservation,
    ...(requestServiceForm.value.kw_size_reservation_add_new || []),
  ];

  if (requestServiceForm.value.kw_size_reservation_add_new) {
    delete (requestServiceForm.value as any).kw_size_reservation_add_new;
  }
  
  requestForm.value = {
    ...requestForm.value,
    ...requestServiceForm.value,
  };

  const { status: apiStatus } = await requestStore.updateOrCreateRequestByUID(
    uid.value,
    requestForm.value
  );

  const { data } = await surveyStore.updateSurveyLog();

  if (data?.result) {
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
      title: "บันทึกข้อมูลสำเร็จ",
      text: saveButtonLabel.value,
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
}

function comfirmSubmit(status) {
  if (status) saveSurveyLog();
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
  window.location.href = `/quotation/${request_id.value}?action=view`;
}
function prevStep() {
  window.location.href = `/survey/${request_id.value}?action=view`;
}

watch(
  () => surveyLogForm.value.complete,
  (newValue) => {
    if (newValue) {
      saveButtonLabel.value = BUTTON_TEXT.BP.SAVEQUOTATION;
    } else {
      saveButtonLabel.value = "บันทึกและรอผลสำรวจ";
    }
  },
  { immediate: true }
);

watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && saveSuccess.value) {
      if (surveyLogForm.value.complete) {
        window.location.href = `/quotation/${request_id.value}?action=${
          action.value || "view"
        }`;
      } else {
        window.location.reload();
      }
    }
  }
);

const nextCondition = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    return CAN_ACCESS_PAGE.QUOTATION.value;
  }
  return true;
});
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertReload :data="dataAlert" />
  <AlertConfirm :text="saveButtonLabel" @confirm-click="comfirmSubmit" />

  <!-- <div class="row row-button q-pa-md q-gutter-sm justify-center">
    <div class="col-button q-mb-md text-center">
      <q-btn
        flat
        label="ย้อนกลับ"
        class="q-mx-auto font-size-normal q-padding bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
        @click="prevStep"
      />
    </div>
    <div class="col-button q-mb-md text-center">
      <q-btn
        flat
        label="ยกเลิกคำร้อง"
        class="font-size-normal q-padding bg-secondary width-270 width-xs-200 text-weight-600 text-white"
        @click="showConfirm()"
      />
    </div>
    <div class="col-button q-mb-md text-center">
      <q-btn
        flat
        :label="saveButtonLabel"
        class="q-mx-auto font-size-normal q-padding bg-primary width-270 width-xs-200 text-weight-600 text-white"
        @click="checkConfirm"
        v-if="request.requests?.status == `I`"
      />
      <q-btn
        flat
        label="ไปหน้าออกใบเสนอราคา"
        class="q-mx-auto font-size-normal q-padding bg-primary width-270 width-xs-200 text-weight-600 text-white"
        @click="nextStep"
        v-else
      />
    </div>
  </div> -->

  <div class="box_btn_center q-mt-xl">
    <q-btn
      flat
      label="ย้อนกลับ"
      class="q-btn-size-small q-padding bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      @click="prevStep"
    />
    <q-btn
      flat
      label="ยกเลิกคำร้อง"
      class="btn-cancel-request q-btn-size-small q-padding bg-secondary width-270 width-xs-200 text-weight-600 text-white"
      @click="openCancelRequestModal()"
      v-if="CAN_EDIT.CANCEL.value"
    />
    <q-btn
      flat
      :label="saveButtonLabel"
      class="q-btn-size-small q-padding bg-primary width-270 width-xs-200 text-weight-600 text-white save-btn"
      @click="checkConfirm"
      v-if="request.requests?.status == `I`"
    />
    <q-btn
      flat
      label="ไปหน้าออกใบเสนอราคา"
      class="q-btn-size-small q-padding bg-primary width-270 width-xs-200 text-weight-600 text-white"
      @click="nextStep"
      v-else-if="nextCondition"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
