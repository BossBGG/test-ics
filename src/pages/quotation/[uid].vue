<script setup lang="ts">
const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);

const requestStore = useRequestStore();
const { request, requestForm, requestServiceForm } = storeToRefs(requestStore);

const addressStore = useAddressStore();
const addressFormStore = useAddressFormStore();
const { addressBillingForm } = storeToRefs(addressFormStore);

const modalConfirm = useModalConfirmStore();
const { isModalConfirm, isModalAlert, isModalAlertReload, dataAlert } =
  storeToRefs(modalConfirm);

const businessStore = useBusinessPartnerStore();
const { businessPartner, contractAccount, businessPartnerQuotationForm } =
  storeToRefs(businessStore);

const quotationStore = useQuotationStore();
const {
  quotation,
  quotationForm,
  validationQuotationForm,
  isDisabled,
  customerRequestNo,
  discountType
} = storeToRefs(quotationStore);

const masterDataStore = useMasterDataStore();
const { materialsList } = storeToRefs(masterDataStore);

const request_id = useParams("uid");
const actionStatus = useQuery("action");
const fetchComplete = ref(false);
const action = ref("");
const saveSuccess = ref(false);

onMounted(async () => {
  loading.start();
  // await requestStore.fetchGetRequestsByUID(request_id.value);
  await addressStore.getAddressByRequest(request_id.value, 4);
  await businessStore.fetchBusinessPartnersByRequestID(
    request.value?.requests?.customer_request_no
  );
  await quotationStore.setRequestID(request_id.value);
  await quotationStore.fetchQuotationByRequestId(true);
  await quotationStore.fetchUsers();

  businessPartnerQuotationForm.value.title = businessPartner.value?.title;
  businessPartnerQuotationForm.value.title_text =
    businessPartner.value?.title_text;
  businessPartnerQuotationForm.value.first_name =
    businessPartner.value?.first_name;
  businessPartnerQuotationForm.value.last_name =
    businessPartner.value?.last_name;
  businessPartnerQuotationForm.value.juristic_name =
    businessPartner.value?.juristic_name;

  if (!quotation.value?.id) {
    quotationForm.value.quotation_by = `${userProfile.value.first_name} ${userProfile.value.last_name}`;
    isDisabled.value = false;
    checkReviewerApprover();
  } else {
    isDisabled.value = !(
      request.value?.requests?.status == `S` ||
      request.value?.requests?.status == `N`
    );
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
  () => businessPartnerQuotationForm.value,
  () => {
    if (fetchComplete.value) {
      businessPartnerQuotationForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => addressBillingForm.value,
  () => {
    if (fetchComplete.value) {
      addressBillingForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => quotationForm.value,
  () => {
    if (fetchComplete.value && quotation.value?.id) {
      quotationForm.value.is_change = true;
    }
  },
  { deep: true }
);
watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && saveSuccess.value) {
      if (
        quotationForm.value.reviewed_by == userProfile.value?.username ||
        quotationForm.value.approved_by == userProfile.value?.username
      ) {
        window.location.href = peaUrlDashboard(request.value?.service_group_id);
      } else {
        window.location.reload();
      }
    }
  }
);

function prevStep() {
  if (request.value?.is_survey) {
    window.location.href = `/survey/history/${request_id.value}?action=view`;
  } else {
    window.location.href = `/application/${request_id.value}?bp=${
      businessPartner?.value?.bp_no || ""
    }&ca=${contractAccount?.value?.ca_no || ""}&action=view`;
  }
}
async function saveQuotation() {
  if (quotation.value?.id) {
    const _quotation = await quotationStore.getLatestQuotationByRequestId();
    if (_quotation?.id == quotation.value?.id) {
      if (_quotation?.status == "P") {
        dataAlert.value = {
          colorText: "primary",
          colorIcon: "white",
          title: "ไม่สามารถดำเนินการได้",
          text: "ใบเสนอราคานี้ได้รับการชำระเรียบร้อยแล้ว",
          icon: "close",
        };
        action.value = "";
        isModalAlert.value = true;
        return;
      } else if (_quotation?.status != quotation.value.status) {
        dataAlert.value = {
          colorText: "primary",
          colorIcon: "white",
          title: "ไม่สามารถดำเนินการได้",
          text: "ใบเสนอราคานี้ถูกดำเนินการโดยผู้อนุมัติเรียบร้อยแล้ว",
          icon: "close",
        };
        action.value = "";
        isModalAlert.value = true;
        return;
      }
    } else {
      dataAlert.value.title = "มีใบเสนอราคาใหม่";
      dataAlert.value.text = "กดปุ่มด้านล่างเพื่อดูใบเสนอราคาใหม่";
      action.value = "";
      isModalAlertReload.value = true;
      return;
    }
  } else {
    await quotationStore.fetchQuotationByRequestId();
    if (quotation.value?.id) {
      dataAlert.value.title = "มีใบเสนอราคาใหม่";
      dataAlert.value.text = "กดปุ่มด้านล่างเพื่อดูใบเสนอราคาใหม่";
      action.value = "";
      isModalAlertReload.value = true;
      return;
    }
  }

  if (businessPartnerQuotationForm.value.status)
    await businessStore.updateNameBusinessPartner();
  if (addressBillingForm.value.status)
    await addressFormStore.updateOrCreateAddress(
      addressBillingForm.value.id,
      addressBillingForm.value
    );
  if (
    (quotation.value?.id && quotationForm.value.is_change) ||
    !quotation.value?.id
  ) {

    if (requestForm.value?.service_code === SERVICE.S16) {
      await requestStore.updateS316KWReservation(request_id.value, requestServiceForm.value.kw_size_reservation)
    }
    
    const { status: apiStatus } =
      await quotationStore.updateOrCreateQuotationByUID();

    if (apiStatus) {
      await quotationStore.fetchQuotationByRequestId(true);
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "check",
      };
      isModalAlert.value = true;
      saveSuccess.value = true;
    } else {
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        icon: "close",
      };
      isModalAlert.value = true;
      saveSuccess.value = false;
    }
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลสำเร็จ",
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  }
}
function confirmSubmit(isConfirm) {
  if (isConfirm) {
    switch (action.value) {
      case "save":
        saveQuotation();
        break;
      case "approve":
        submitApprove();
        break;
      case "cancel":
        submitCancel();
        break;
      case "pass":
        submitPass();
        break;
      case "fail":
        submitFail();
        break;
    }
  }
  action.value = "";
}
async function confirmApprove() {
  const _quotation = await quotationStore.getLatestQuotationByRequestId();
  if (quotation.value?.id != _quotation?.id) {
    dataAlert.value.title = "มีใบเสนอราคาใหม่";
    dataAlert.value.text = "กดปุ่มด้านล่างเพื่อดูใบเสนอราคาใหม่";
    action.value = "";
    isModalAlertReload.value = true;
  } else {
    if (_quotation?.review_status == "R") {
      dataAlert.value.text =
        'ใบเสนอราคานี้มีสถานะ "ไม่ผ่าน" โดยผู้ดำเนินการตรวจสอบ ยืนยัน "อนุมัติ" หรือไม่?';
    } else {
      dataAlert.value.text = 'ยืนยัน "อนุมัติ" ใบเสนอราคา?';
    }
    action.value = "approve";
    isModalConfirm.value = true;
  }
}
async function confirmCancel() {
  const _quotation = await quotationStore.getLatestQuotationByRequestId();
  if (quotation.value?.id != _quotation?.id) {
    dataAlert.value.title = "มีใบเสนอราคาใหม่";
    dataAlert.value.text = "กดปุ่มด้านล่างเพื่อดูใบเสนอราคาใหม่";
    action.value = "";
    isModalAlertReload.value = true;
  } else {
    if (_quotation?.review_status == "P") {
      dataAlert.value.text =
        'ใบเสนอราคานี้มีสถานะ "ผ่าน" โดยผู้ดำเนินการตรวจสอบ ยืนยัน "ไม่อนุมัติ" หรือไม่?';
    } else {
      dataAlert.value.text = 'ยืนยัน "ไม่อนุมัติ" ใบเสนอราคา?';
    }
    action.value = "cancel";
    isModalConfirm.value = true;
  }
}
async function confirmPass() {
  const _quotation = await quotationStore.getLatestQuotationByRequestId();
  if (_quotation?.status != "Q") {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ไม่สามารถดำเนินการได้",
      text: "ใบเสนอราคานี้ถูกดำเนินการโดยผู้อนุมัติเรียบร้อยแล้ว",
      icon: "close",
    };
    action.value = "";
    isModalAlert.value = true;
  } else {
    dataAlert.value.text = 'ยืนยันการตรวจสอบสถานะ "ผ่าน" ?';
    action.value = "pass";
    isModalConfirm.value = true;
  }
}
async function confirmFail() {
  const _quotation = await quotationStore.getLatestQuotationByRequestId();
  if (_quotation?.status != "Q") {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ไม่สามารถดำเนินการได้",
      text: "ใบเสนอราคานี้ถูกดำเนินการโดยผู้อนุมัติเรียบร้อยแล้ว",
      icon: "close",
    };
    action.value = "";
    isModalAlert.value = true;
  } else {
    dataAlert.value.text = 'ยืนยันการตรวจสอบสถานะ "ไม่ผ่าน" ?';
    action.value = "fail";
    isModalConfirm.value = true;
  }
}
async function submitApprove() {
  loading.start();
  const { status } = await quotationStore.approveQuotation();
  if (status) {
    await requestStore.fetchGetRequestsByUID(request_id.value);
    await quotationStore.fetchQuotationByRequestId(true);
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "อนุมัติสำเร็จ",
      text: "",
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "อนุมัติไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      icon: "close",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
  loading.stop();
}
async function submitCancel() {
  loading.start();
  const { status } = await quotationStore.cancelQuotation();
  if (status) {
    await requestStore.fetchGetRequestsByUID(request_id.value);
    await quotationStore.fetchQuotationByRequestId(true);
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ไม่อนุมัติสำเร็จ",
      text: "",
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ไม่อนุมัติไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      icon: "close",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
  loading.stop();
}
async function submitPass() {
  loading.start();
  const { status } = await quotationStore.passQuotation();
  if (status) {
    await requestStore.fetchGetRequestsByUID(request_id.value);
    await quotationStore.fetchQuotationByRequestId(true);
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ตรวจสอบสำเร็จ",
      text: "",
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ตรวจสอบไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      icon: "close",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
  loading.stop();
}
async function submitFail() {
  loading.start();
  const { status } = await quotationStore.failQuotation();
  if (status) {
    await requestStore.fetchGetRequestsByUID(request_id.value);
    await quotationStore.fetchQuotationByRequestId(true);
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ตรวจสอบสำเร็จ",
      text: "",
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ตรวจสอบไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      icon: "close",
    };
    isModalAlert.value = true;
    saveSuccess.value = false;
  }
  loading.stop();
}
async function callQuotation() {
  loading.start();
  const data = await quotationStore.printQuotation(
    request.value?.requests?.customer_request_no
  );

  loading.stop();

  if (data?.data) {
    let url = customerRequestNo.value.path;
    let baseUrlDoc = import.meta.env.VITE_API_URL;
    let baseUrlDocNew = baseUrlDoc.replace("/api", "");
    url = url.replace(/.*(uploads\/pdf\/quotation_.*)$/, "$1");
    url = `${baseUrlDocNew}${url}?apiKey=${import.meta.env.VITE_API_KEY}`;
    window.open(url, "_blank");
  }
}
const checkReviewerApprover = () => {
  if (quotationForm.value?.reviewed_by == userProfile.value?.username) {
    quotationForm.value.reviewed_by = null;
  }
  if (quotationForm.value?.approved_by == userProfile.value?.username) {
    quotationForm.value.approved_by = null;
  }
};

watch(
  () => action.value,
  async () => {
    if (action.value == "save") {
      const validated = await validationQuotationForm.value.validate();
      if (validated) isModalConfirm.value = true;
      else {
        validationQuotationForm.value.$el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        action.value = "";
      }

      // Check if S16 service calculation has been confirmed
      if (requestForm.value?.service_code === SERVICE.S16 && !quotationForm.value?.s16_calculation_confirmed) {
        dataAlert.value = {
          colorText: "primary",
          colorIcon: "white",
          title: "กรุณาคำนวณค่าบริการก่อน",
          text: "กรุณาเปิดหน้าต่างคำนวณค่าบริการและยืนยันก่อนบันทึกข้อมูล",
          icon: "warning",
        };
        action.value = "";
        isModalAlert.value = true;
        return;
      }
    }
  }
);

watch( () => [requestForm.value, quotationForm.value, materialsList.value, discountType.value], () => {

  console.log(`requestForm.value`, requestForm.value)
  console.log(`materialsList.value`, materialsList.value)
  console.log(`discountType.value`, discountType.value)
  console.log(`quotationForm.value`, quotationForm.value)

  if(
    requestForm.value?.service_code 
    && requestForm.value?.service_code === SERVICE.S16
    && quotationForm.value
    && materialsList.value.length > 0
    && discountType.value
  ){
    const S316materialList = materialsList.value.filter(
      (material) => material.request_code === 'S316' 
    );
    console.log(`quotationForm.value`, JSON.stringify(quotationForm.value.details))
    console.log(`S316materialList`, S316materialList)

    if(quotationForm.value.details.length === 1
      && quotationForm.value.details[0].mat_code === null
    ){
      quotationForm.value.details = [];
    }

    S316materialList.forEach((material) => {
      const detailIndex = quotationForm.value.details.findIndex(
        (detail) => detail.mat_code === material.mat_code
      );

      if (detailIndex === -1) {
        quotationForm.value.details.push({
          mat_code: material.mat_code,
          qty: 1,
          unit_price: 0,
          discount_rate: 0,
          discount_price: 0,
          discount_unit: discountType.value,
          vat_rate: 0,
          vat_price: 0,
          line_item_price: 0,
          display_qty: intToCurrency("1"),
          display_unit_price: decimalToCurrency(0),
          display_discount_price: decimalToCurrency(0),
          display_vat_price: decimalToCurrency(0),
          change_vat_price: false,
        });
      }
    });

    console.log(`quotationForm.value`, quotationForm.value.details)
  }
}, { deep: true })

// async function ActionChange() {
//   console.log("ก่อนXD");
//   const validated = await validationQuotationForm.value.validate();

//   if (validated) {
//     isModalConfirm.value = true;
//     console.log("หลังXD");
//   } else {
//     validationQuotationForm.value.$el.scrollIntoView({
//       behavior: "smooth",
//       block: "center",
//     });
//   }
// }
// watch(() => action.value, ActionChange);
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertReload :data="dataAlert" />
  <AlertConfirm :text="dataAlert.text" @confirm-click="confirmSubmit" />
  <ModalCancelRequest />

  <div class="wraper_all">
    <q-form ref="validationQuotationForm">
      <FormDetailsRequest />

      <StatusBar
        class="q-mt-lg"
        :custom-class="request?.is_survey ? `active4` : `active3`"
      />
      <div v-if="!isDisabled">
        <FormCreateQuote class="q-mt-lg" />
        <FormAddressQuotation class="q-mt-xl" />
      </div>
      <div v-else>
        <FormFieldCreateQuote class="q-mt-lg" />
        <FormFieldAddressQuotation class="q-mt-xl" />
      </div>
      <FormTableSummary v-model="fetchComplete" class="q-mt-lg" />
      <div v-if="request.requests?.status == `Q` && isDisabled" class="section">
        <div
          class="box_btn_center q-mt-xl"
          v-if="userProfile?.username == quotationForm.approved_by"
        >
          <q-btn
            flat
            :label="BUTTON_TEXT.PREV"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
            @click="prevStep"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.REJECT"
            class="q-btn-size-small bg-drak-grayish-magenta width-270 width-xs-200 text-weight-600 text-white qt-reject-btn"
            @click="confirmCancel"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.APPROVE"
            class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white qt-approve-btn"
            @click="confirmApprove"
          />
        </div>
        <div
          class="box_btn_center q-mt-xl"
          v-else-if="userProfile?.username == quotationForm.reviewed_by"
        >
          <q-btn
            flat
            :label="BUTTON_TEXT.PREV"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
            @click="prevStep"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.FAIL"
            class="q-btn-size-small bg-drak-grayish-magenta width-270 width-xs-200 text-weight-600 text-white"
            @click="confirmFail"
            :disable="quotation?.review_status != 'W'"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.PASS"
            class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
            @click="confirmPass"
            :disable="quotation?.review_status != 'W'"
          />
        </div>
        <div class="box_btn_center q-mt-xl" v-else>
          <q-btn
            flat
            :label="BUTTON_TEXT.PREV"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
            @click="prevStep"
          />
          <q-btn
            @click="openCancelRequestModal()"
            flat
            :label="BUTTON_TEXT.REQUEST.CANCEL"
            class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
            :disable="!CAN_EDIT.QUOTATION.value"
            v-if="CAN_EDIT.CANCEL.value"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.QUOTATION.EDIT"
            class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
            @click="
              isDisabled = false;
              checkReviewerApprover();
            "
            :disable="!CAN_EDIT.QUOTATION.value"
          />
        </div>
        <!-- <div class="box_btn_center q-mt-xl">
          <q-btn
            flat
            :label="BUTTON_TEXT.PREV"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
            @click="prevStep"
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.REJECT"
            class="q-btn-size-small bg-drak-grayish-magenta width-270 width-xs-200 text-weight-600 text-white"
            @click="
              action = 'cancel';
              dataAlert.text = BUTTON_TEXT.REJECT;
            "
          />
          <q-btn
            flat
            :label="BUTTON_TEXT.APPROVE"
            class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
            @click="
              action = 'approve';
              dataAlert.text = BUTTON_TEXT.APPROVE;
            "
          />
        </div>
        <div class="box_btn_center btn_sub">
          <q-btn
            flat
            :label="BUTTON_TEXT.QUOTATION.EDIT"
            class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
            @click="isDisabled = false"
          />
          <q-btn
            @click="openCancelRequestModal()"
            flat
            :label="BUTTON_TEXT.REQUEST.CANCEL"
            class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
          />
        </div> -->
      </div>

      <div
        v-else-if="request.requests?.status == `A` && isDisabled"
        class="box_btn_center q-mt-xl"
      >
        <q-btn
          flat
          :label="BUTTON_TEXT.PREV"
          class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
          @click="prevStep"
        />
        <q-btn
          @click="openCancelRequestModal()"
          flat
          :label="BUTTON_TEXT.REQUEST.CANCEL"
          class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
          v-if="CAN_EDIT.CANCEL.value"
        />
        <q-btn
          flat
          :label="BUTTON_TEXT.QUOTATION.EDIT"
          class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
          @click="
            isDisabled = false;
            quotationForm.quotation_by = `${userProfile.first_name} ${userProfile.last_name}`;
            quotationForm.quotation_date = dateFormatBy(
              Date.now(),
              `YYYY-MM-DDTHH:mm:ss`
            );
            checkReviewerApprover();
          "
        />

        <q-btn
          @click="callQuotation()"
          :label="BUTTON_TEXT.QUOTATION.PRINT"
          flat
          class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white qt-print-btn"
        />
      </div>

      <div
        v-else-if="
          request.requests?.status == `S` ||
          request.requests?.status == `Q` ||
          request.requests?.status == `N` ||
          request.requests?.status == `A`
        "
        class="box_btn_center q-mt-xl"
      >
        <q-btn
          flat
          :label="BUTTON_TEXT.PREV"
          class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
          @click="prevStep"
        />
        <q-btn
          @click="openCancelRequestModal()"
          flat
          :label="BUTTON_TEXT.REQUEST.CANCEL"
          class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
          v-if="CAN_EDIT.CANCEL.value"
        />
        <q-btn
          @click="
            action = 'save';
            dataAlert.text = BUTTON_TEXT.QUOTATION.SAVE;
          "
          flat
          :label="BUTTON_TEXT.QUOTATION.SAVE"
          class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white qt-save"
        />
      </div>
      <div v-else class="box_btn_center q-mt-xl">
        <q-btn
          flat
          :label="BUTTON_TEXT.PREV"
          class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
          @click="prevStep"
        />
      </div>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

main {
  background-color: $white;
}

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

    .box_btn_center {
      &.btn_sub {
        margin-top: 33px;

        @media #{$screen-lg-min} {
          margin-top: 48px;
        }
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  middleware: [status]
  layout: createbp
</route>
