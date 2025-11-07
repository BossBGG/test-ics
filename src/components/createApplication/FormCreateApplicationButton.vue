<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requestForm, requestServiceForm, validateApplicationForm } =
  storeToRefs(requestStore);

const modalConfirm = useModalConfirmStore();
const { isModalConfirm, isModalAlert } = storeToRefs(modalConfirm);

const uid = useParams("uid");

async function checkConfirm() {
  const isValidated = await validateApplicationForm.value.validate();
  console.log("isValidated: ", isValidated);

  if (isValidated) {
    isModalConfirm.value = true;
    // alert("XD");
  } else {
    validateApplicationForm.value.$el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

// async function onSubmitGotoSearch() {
//   const { status: apiStatus } = await requestStore.updateOrCreateRequestByUID(
//     uid.value,
//     requestForm.value,
//   );
//   console.log("apiStatus: ", apiStatus);
//   if (apiStatus) {
//     // alert('apiStatus: True')
//     isModalAlert.value = true;
//   } else {
//     dataAlert.value.icon = "close";
//     isModalAlert.value = true;
//   }
// }

function conFirmClick(status) {
  // console.log("status: ", status);
  // if (status) onSubmitGotoSearch();
}
const dataAlert = ref({
  colorText: "primary",
  colorIcon: "white",
  title: "บันทึกข้อมูล",
  text: BUTTON_TEXT.BP.SAVESURVEY,
  icon: "check",
  // showStatus: "true",
});

const navigateBack = () => {
  window.history.back();
};
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertConfirm text="บันทึกข้อมูล" @confirm-click="conFirmClick" />

  <div class="row q-pa-md q-gutter-sm row-button justify-center">
    <div class="col-button q-mb-md text-center">
      <q-btn
        @click="goBack"
        flat
        label="ย้อนกลับ"
        class="q-mx-auto q-btn-size bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      />
    </div>
    <div class="col-button q-mb-md text-center">
      <q-btn
        @click="checkConfirm"
        flat
        :label="BUTTON_TEXT.BP.SAVESURVEY"
        class="q-mx-auto q-btn-size bg-primary width-270 width-xs-200 text-weight-600 text-white"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
