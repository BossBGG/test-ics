<script setup lang="ts">
const requestStore = useRequestStore();
const {
  request,
  requestCancelForm,
  showCancelRequestModal,
  validateCancelForm,
} = storeToRefs(requestStore);

const modalConfirm = useModalConfirmStore();
const { isModalAlert, dataAlert } = storeToRefs(modalConfirm);
const deleteSuccess = ref(false);

async function onSubmitBtn() {
  const { status: apiStatus } = await requestStore.deleteRequest(
    requestCancelForm.value
  );
  deleteSuccess.value = true;

  if (apiStatus) {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ยกเลิกคำร้องสำเร็จ",
      text: "คำร้องจะไม่สามารถดำเนินการต่อได้",
      icon: "check",
    };
    isModalAlert.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ยกเลิกคำร้องไม่สำเร็จ",
      text: "คำร้องจะไม่สามารถดำเนินการต่อได้",
      icon: "close",
    };
    isModalAlert.value = true;
  }
  showCancelRequestModal.value = false;
}

watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && deleteSuccess.value)
      window.location.href = peaUrlDashboard(request.value?.service_group_id);
  }
);

async function checkConfirm() {
  const isValidated = await validateCancelForm.value.validate();

  if (isValidated) {
    onSubmitBtn();
  }
}
</script>

<template>
  <!-- {{ isOpen }} -->
  <Alert :data="dataAlert" />
  <!-- :isCancel="true" -->

  <!-- <pre>
    {{ requests }}
  </pre> -->
  <q-dialog v-model="showCancelRequestModal" persistent>
    <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>ต้องการยกเลิกคำร้องหรือไม่?</h5>
      </q-bar>
      <!-- {{ requestCancelForm }} -->
      <q-form ref="validateCancelForm" id="boxCancelRequest">
        <q-card-section class="row items-center">
          <q-input v-model="requestCancelForm.remark" class="full-width input-cancel" label-color="grey-14" stack-label
            label filled required type="textarea" bg-color="white" color="grey-14" :rules="[
              (val) => (val !== null && val !== '') || 'กรุณาระบุหมายเหตุ',
            ]">
            <template #label>
              หมายเหตุ<span class="color_negative">*</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-none">
          <div class="col-12 col-sm-6 q-pa-sm">
            <q-btn flat label="ปิด" color="primary" class="q-btn-size bg-drak-blue full-width text-white"
              @click="closeCancelRequestModal()" />
          </div>
          <div class="col-12 col-sm-6 q-pa-sm">
            <q-btn flat label="ยืนยันยกเลิกคำร้อง" color="secondary"
              class="q-btn-size bg-secondary full-width text-white app-confirm-cancel-btn" @click="checkConfirm()" />
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "@style";

.q-bar--standard {
  height: 46px;
}
</style>
