<script setup lang="ts">
const modalConfirmStore = useModalConfirmStore();
const { isModalConfirm, isModalAlert, isModalAlertReload, dataAlert } =
  storeToRefs(modalConfirmStore);
const serviceStore = useServiceStore();
const { services } = storeToRefs(serviceStore);

const requestStore = useRequestStore();
const {
  isSurvey,
  setRequestCode,
  nowRequestCode,
  request,
  requestForm,
  requestServiceForm,
  requestTransformerForm,
  validateApplicationForm,
  validateTimeStatusForm,
  validateTimeStatusFormText,
} = storeToRefs(requestStore);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerForm, validateBpForm2 } =
  storeToRefs(businessPartnerStore);

const addressStore = useAddressStore();
const addressFormStore = useAddressFormStore();
const { addressIdCardForm, addressRequestForm, addressBillingForm, addressInformationForm } = 
  storeToRefs(addressFormStore);

const requestId = useParams("uid");
const bp = useQuery("bp");
const ca = useQuery("ca");
const service = useQuery("service");
const temp = useQuery("temp");
const action = useQuery("action");

const fetchComplete = ref(false);
const isReadonly = ref(true);
const serviceName = computed(() => {
  const selected = services.value.find(
    (item) => item.request_code == requestForm.value.service_code
  );
  return selected?.name || "";
});
const saveButtonLabel = computed(() => {
  const selected = services.value.find(
    (item) => item.request_code == requestForm.value.service_code
  );
  if (request.value?.is_survey || selected?.is_survey) {
    return BUTTON_TEXT.BP.SAVESURVEY;
  } else {
    return BUTTON_TEXT.BP.SAVEQUOTATION;
  }
});
const nextStepHref = computed(() => {
  const selected = services.value.find(
    (item) => item.request_code == requestForm.value.service_code
  );
  if (request.value?.is_survey || selected?.is_survey) {
    return `/survey/${request.value?.requests?.id}?action=view`;
  } else {
    return `/quotation/${request.value?.requests?.id}?action=view`;
  }
});
const backUrl = computed(() => {
  if (requestId.value) {
    return `/createBp/${requestId.value}?bp=${bp.value || ""}&ca=${
      ca.value || ""
    }&action=${action.value}`;
  }
  return `/createBp?bp=${bp.value || ""}&ca=${ca.value || ""}&service=${
    service.value
  }&temp=${temp.value}&action=${action.value}`;
});

onMounted(async () => {
  loading.start();

  // await requestStore.fetchGetRequestsByUID(requestId.value);
  await addressStore.getAddressByRequest(requestId.value);
  // await businessPartnerStore.fetchBusinessPartnersByRequestID(
  //   request.value.requests?.customer_request_no
  // );

  const _bpForm = await getLocalStorage(
    `${requestId.value || temp.value}_bpForm`
  );
  const _addressIdCardForm = await getLocalStorage(
    `${requestId.value || temp.value}_addressIdCardForm`
  );
  const _addressRequestForm = await getLocalStorage(
    `${requestId.value || temp.value}_addressRequestForm`
  );
  const _addressBillingForm = await getLocalStorage(
    `${requestId.value || temp.value}_addressBillingForm`
  );
  if (_bpForm) businessPartnerForm.value = _bpForm;
  if (_addressIdCardForm) addressIdCardForm.value = _addressIdCardForm;
  if (_addressRequestForm) addressRequestForm.value = _addressRequestForm;
  if (_addressBillingForm) addressBillingForm.value = _addressBillingForm;

  if (
    request?.value[`requests_service${request?.value?.service_code}`] == null
  ) {
    isReadonly.value = false;
  }

  if (businessPartnerForm.value) {
    for (const key in businessPartnerForm.value) {
      if (businessPartnerForm.value[key] !== null) {
        requestForm.value[key] = businessPartnerForm.value[key];
      }
    }
  }

  if (addressRequestForm.value) {
    for (const key in addressRequestForm.value) {
      if (addressRequestForm.value[key] !== null) {
        addressInformationForm.value[key] = addressRequestForm.value[key];
      }
    }
  }

  fetchComplete.value = true;

  loading.stop();
});

const saveSuccess = ref(false);

async function saveData() {
  loading.start();
  if (request.value?.requests?.id) {
    const _bp = await businessPartnerStore.getBusinessPartnerByRequestNo(
      request.value?.requests?.customer_request_no
    );
    if (!businessPartner.value?.id) {
      if (_bp?.id) {
        await removeLocalStorage(`${requestId.value}_bpForm`);
        await removeLocalStorage(`${requestId.value}_addressIdCardForm`);
        await removeLocalStorage(`${requestId.value}_addressRequestForm`);
        await removeLocalStorage(`${requestId.value}_addressBillingForm`);
        await removeLocalStorage(`${requestId.value}_expiryDate`);
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
    } else if (businessPartner.value?.updated_date != _bp?.updated_date) {
      await removeLocalStorage(`${requestId.value}_bpForm`);
      await removeLocalStorage(`${requestId.value}_addressIdCardForm`);
      await removeLocalStorage(`${requestId.value}_addressRequestForm`);
      await removeLocalStorage(`${requestId.value}_addressBillingForm`);
      await removeLocalStorage(`${requestId.value}_expiryDate`);
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
  }

  requestForm.value.transformers = requestTransformerForm.value[0]
    ?.transformer_brand
    ? requestTransformerForm.value
    : [];
  requestForm.value = {
    ...requestForm.value,
    ...requestServiceForm.value,
  };
  const { status, data: requestData } =
    await requestStore.updateOrCreateRequestByUID(
      requestId.value || false,
      requestForm.value
    );
  if (requestId.value) {
    businessPartnerForm.value.customer_request_no =
      request.value.requests?.customer_request_no;
  } else {
    if (!status || !requestData?.request_id) {
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "บันทึกข้อมูลไม่สำเร็จ",
        text: saveButtonLabel.value,
        icon: "close",
      };
      isModalAlert.value = true;
      saveSuccess.value = false;
      loading.stop();
      return;
    }
    businessPartnerForm.value.customer_request_no = requestData?.request_no;
    addressIdCardForm.value.request_id = requestData.request_id;
    addressRequestForm.value.request_id = requestData.request_id;
    addressBillingForm.value.request_id = requestData.request_id;
  }

  businessPartnerForm.value.bp_no = businessPartnerForm.value.bp_no || null;
  businessPartnerForm.value.ca_no = businessPartnerForm.value.ca_no || null;
  addressIdCardForm.value.bp_no = businessPartnerForm.value.bp_no || null;
  addressIdCardForm.value.cid = businessPartnerForm.value.cid || null;
  addressRequestForm.value.bp_no = businessPartnerForm.value.bp_no || null;
  addressRequestForm.value.cid = businessPartnerForm.value.cid || null;
  addressBillingForm.value.bp_no = businessPartnerForm.value.bp_no || null;
  addressBillingForm.value.cid = businessPartnerForm.value.cid || null;

  if (addressRequestForm.value.address_province_id) {
    await addressFormStore.updateOrCreateManyAddress([
      addressIdCardForm.value,
      addressRequestForm.value,
      addressBillingForm.value,
    ]);
  }

  if (
    businessPartnerForm.value.legal_type == 1 ||
    businessPartnerForm.value.legal_type == 2
  ) {
    businessPartnerForm.value.business_type_code = null;
  }

  if (businessPartnerForm.value.mobile_no) {
    const { data } = await businessPartnerStore.updateOrCreateBusinessPartner();

    if (data?.result) {
      if (temp.value) {
        await removeLocalStorage(`${temp.value}_bpForm`);
        await removeLocalStorage(`${temp.value}_addressIdCardForm`);
        await removeLocalStorage(`${temp.value}_addressRequestForm`);
        await removeLocalStorage(`${temp.value}_addressBillingForm`);
        await removeLocalStorage(`${temp.value}_expiryDate`);
      }
      if (requestId.value) {
        await removeLocalStorage(`${requestId.value}_bpForm`);
        await removeLocalStorage(`${requestId.value}_addressIdCardForm`);
        await removeLocalStorage(`${requestId.value}_addressRequestForm`);
        await removeLocalStorage(`${requestId.value}_addressBillingForm`);
        await removeLocalStorage(`${requestId.value}_expiryDate`);
      }
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
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลสำเร็จ",
      text: saveButtonLabel.value,
      icon: "check",
    };
    isModalAlert.value = true;
    saveSuccess.value = true;
  }
  loading.stop();
}

function comfirmSubmit(status) {
  if (status) saveData();
}

async function nextStep() {
  // console.log('validateTimeStatusForm: ', validateTimeStatusForm.value);
  const isValidated = await validateBpForm2.value.validate();
  const isApplicationFormValidated =
    await validateApplicationForm.value.validate();
  if (isValidated && isApplicationFormValidated && validateTimeStatusForm.value)
    isModalConfirm.value = true;
  else {
    validateBpForm2.value.$el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    validateTimeStatusFormText.value = true;
  }
}

const nextCondition = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    if (request.value?.is_survey) {
      return CAN_ACCESS_PAGE.SURVEY.value;
    }
    return CAN_ACCESS_PAGE.QUOTATION.value;
  }

  return businessPartner.value?.id;
});

watch(
  () => requestForm.value.service_code,
  () => setServiceCode()
);
watch(
  () => services.value,
  () => setServiceCode(),
  { deep: true }
);
watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && saveSuccess.value) {
      window.location.href = nextStepHref.value;
    }
  }
);

const setServiceCode = () => {
  const selected = services.value.find(
    (item) => item.request_code == requestForm.value.service_code
  );
  isSurvey.value = selected?.is_survey || false;
  serviceName.value = selected?.name;
  setRequestCode.value = requestForm.value.service_code;
};
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertReload :data="dataAlert" />
  <AlertConfirm :text="saveButtonLabel" @confirm-click="comfirmSubmit" />

  <ModalCancelRequest />

  <div class="wraper_all" v-if="nowServiceID()">
    <FormDetailsRequest />
    <div class="section_application_form">
      <q-form ref="validateBpForm2">
        <StatusBar class="q-mt-lg" custom-class="active2" />
        <FormInformationCustomerType v-if="nowServiceID()" :disable-map-section="true" :hide-form-request="true" />
        <FormCreateApplication
          class="q-mt-lg"
          :title="serviceName"
          :readonly="isReadonly"
        />
        <template v-if="nowRequestCode != SERVICE.S16">
          <FormCreateApplicationStatus class="q-mt-lg" :readonly="isReadonly" />
        </template>

        <template v-if="nowRequestCode == SERVICE.S16">
          <q-card class="bg_field_gray q-pa-md q-mt-lg">
            <div class="bg_white q-pa-md col-12">
              <div class="text-weight-light">
                รายละเอียดเพิ่มเติม
              </div>
              <div class="text-weight-regular">
                โลเล็ม อิปซัม (lorem ipsum) — เป็นข้อความแทนที่ (placeholder text) ใช้เพื่อลดความสนใจต่อข้อความที่นำมาแสดง สำหรับการแสดงลักษณะของ ฟอนต์ การพิมพ์และการจัดหน้าข้อความโลเร็ม อิปซัมเป็นข้อความส่วนหนึ่งในภาษาละตินที่แต่งโดย ซิเซโร
              </div>
            </div>
          </q-card>
        </template>

        <div class="box_btn_center q-mt-xl">
          <q-btn
            :to="backUrl"
            flat
            :label="BUTTON_TEXT.PREV"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
          />

          <q-btn
            @click="openCancelRequestModal()"
            flat
            :label="BUTTON_TEXT.REQUEST.CANCEL"
            class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white app-cancel-btn"
            v-if="requestId && CAN_EDIT.CANCEL.value"
          />
          <q-btn
            @click="nextStep"
            flat
            :label="saveButtonLabel"
            class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white app-save-btn"
            v-if="(CAN_EDIT.BP.value && EDIT_ACTION) || !businessPartner?.id"
          />
          <q-btn
            flat
            :label="request?.is_survey ? `ไปหน้าสำรวจ` : `ไปหน้าใบเสนอราคา`"
            class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
            :to="nextStepHref"
            v-if="nextCondition"
          />
        </div>

        <!-- <FormCreateApplicationButton class="q-mt-lg" /> -->
      </q-form>
    </div>
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
  }
}
</style>

<route lang="yaml">
meta:
  layout: createbp
  middleware: [status]
</route>

<!-- <route lang="yaml">
meta:
  middleware: [status]
  layout: createbp
</route> -->
