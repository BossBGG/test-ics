<script setup lang="ts">
const modalConfirmStore = useModalConfirmStore();
const { dataAlert } = storeToRefs(modalConfirmStore);
const masterDataStore = useMasterDataStore();
const { nameTitles, legalForms } = storeToRefs(masterDataStore);
const userDataStore = useUserDataStore();
const userProfile = storeToRefs(userDataStore);

// const { userProfile }= storeToRefs(userDataStore);
const requestStore = useRequestStore();
const { request, nowRequestCode } = storeToRefs(requestStore);

const businessPartnerStore = useBusinessPartnerStore();
const {
  businessPartner,
  businessPartnerForm,
  businessPartnerDetail,
  validateBpForm1,
  contractAccount,
  isDisabled,
} = storeToRefs(businessPartnerStore);
const addressStore = useAddressStore();
const { addressIdCard, addressRequest, addressBilling } =
  storeToRefs(addressStore);
const addressFormStore = useAddressFormStore();
const { addressIdCardForm, addressRequestForm, addressBillingForm } =
  storeToRefs(addressFormStore);

const route = useRoute();
const requestId = useParams("uid");
const bp = useQuery("bp");
const ca = useQuery("ca");
const service = useQuery("service");
const temp = useQuery("temp");
const action = useQuery("action");

const pageStart = ref(true);
const saveButtonLabel = ref("บันทึก");
const nextStepHref = ref("");
const fetchComplete = ref(false);
const tempNationality = ref("");

const searchBpLink = computed(() =>
  peaUrl(
    `search-customer?request_id=${requestId.value}&first_name=${businessPartnerForm.value.first_name}&last_name=${businessPartnerForm.value.last_name}&email=${businessPartnerForm.value.email}&mobile_no=${businessPartnerForm.value.mobile_no}&service_y3_type=${nowRequestCode.value}`
  )
);
const backUrl = computed(() => {
  const requestStatus = request.value?.requests?.status;
  if (request.value?.requests?.id) {
    if (request.value?.is_survey) {
      switch (requestStatus) {
        case "C":
        case "D":
        case "I":
          return searchBpLink;
      }
    } else {
      switch (requestStatus) {
        case "C":
        case "D":
        case "I":
        case "S":
        case "Q":
        case "N":
          return searchBpLink;
      }
    }
    if (request.value?.requests?.channel === 0) {
    }
    return peaUrlDashboard(request.value?.service_group_id);
  }
  return peaUrl("search-customer");
});

onMounted(async () => {
  loading.start();

  // await requestStore.fetchGetRequestsByUID(requestId.value);
  if (requestId.value) {
    await addressStore.getAddressByRequest(requestId.value);
  }

  await businessPartnerStore.fetchBusinessPartnersByRequestID(
    request.value.requests?.customer_request_no
  );

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

  if (_bpForm) {
    if (
      (_bpForm && _bpForm.bp_no == bp.value) ||
      bp.value == "null" ||
      bp.value == ""
    )
      businessPartnerForm.value = _bpForm;
    if (
      (_addressIdCardForm && _bpForm.bp_no == bp.value) ||
      bp.value == "null" ||
      bp.value == ""
    )
      addressIdCardForm.value = _addressIdCardForm;
    if (
      (_addressRequestForm && _bpForm.bp_no == bp.value) ||
      bp.value == "null" ||
      bp.value == ""
    )
      addressRequestForm.value = _addressRequestForm;
    if (
      (_addressBillingForm && _bpForm.bp_no == bp.value) ||
      bp.value == "null" ||
      bp.value == ""
    )
      addressBillingForm.value = _addressBillingForm;
  } else {
    if (!CAN_EDIT.BP.value || (!businessPartner?.value?.id && !EDIT_ACTION)) {
      await businessPartnerStore.copyFields(businessPartner.value);
      businessPartnerForm.value.ca_no = contractAccount?.value?.ca_no;
    } else {
      if (bp.value) {
        if (businessPartner.value?.bp_no == bp.value) {
          await businessPartnerStore.copyFields(businessPartner.value);
          businessPartnerForm.value.ca_no = contractAccount?.value?.ca_no;
        } else {
          await businessPartnerStore.fetchBusinessPartnerDetailByBpNo(
            bp.value,
            ca.value || "",
            userProfile.selectedPeaCode.value || "",
          );
        }
      } else {
        await businessPartnerStore.copyFields(businessPartner.value);
        businessPartnerForm.value.ca_no = contractAccount?.value?.ca_no;
      }
    }
  }

  if (!businessPartner.value?.id && _bpForm == null) {
    businessPartnerForm.value.mobile_no = request.value?.requests?.mobile_no;
    businessPartnerForm.value.email = request.value?.requests?.email;
  } else if (!businessPartner.value?.id && _bpForm !== null) {
    businessPartnerForm.value.mobile_no = _bpForm.mobile_no;
    businessPartnerForm.value.email = _bpForm.email;
  }

  fetchComplete.value = true;

  loading.stop();
});

const expiryTime = Date.now() + 3_600_000;
async function nextStep() {
  const isValidated = await validateBpForm1.value.validate();

  if (isValidated) {
    loading.start();

    if (
      businessPartnerForm.value.bp_no === "" ||
      businessPartnerForm.value.bp_no === "null"
    )
      businessPartnerForm.value.bp_no = null;

    await setLocalStorage(
      `${requestId.value || temp.value}_bpForm`,
      businessPartnerForm.value
    );
    await setLocalStorage(
      `${requestId.value || temp.value}_addressRequestForm`,
      addressRequestForm.value
    );
    await setLocalStorage(
      `${requestId.value || temp.value}_addressIdCardForm`,
      addressIdCardForm.value
    );
    await setLocalStorage(
      `${requestId.value || temp.value}_addressBillingForm`,
      addressBillingForm.value
    );
    await setLocalStorage(
      `${requestId.value || temp.value}_expiryDate`,
      expiryTime
    );

    if (requestId.value) {
      window.location.href = `/application/${requestId.value}?bp=${
        bp.value || ""
      }&ca=${ca.value || ""}&action=${action.value || "view"}`;
    } else {
      window.location.href = `/application?bp=${bp.value || ""}&ca=${
        ca.value || ""
      }&service=${service.value || ""}&temp=${temp.value || ""}&action=${
        action.value || "view"
      }`;
    }
  }
}

watch(
  () => businessPartnerForm.value,
  () => {
    if (fetchComplete.value && businessPartner.value?.id) {
      businessPartnerForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => addressIdCardForm.value,
  () => {
    if (fetchComplete.value && addressIdCard?.value?.id != null) {
      addressIdCardForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => addressRequestForm.value,
  () => {
    if (fetchComplete.value && addressRequest.value?.id) {
      addressRequestForm.value.status = true;
    }
  },
  { deep: true }
);
watch(
  () => addressBillingForm.value,
  () => {
    if (fetchComplete.value && addressBilling.value?.id) {
      addressBillingForm.value.status = true;
    }
  },
  { deep: true }
);

watch(
  () => businessPartnerForm.value.nationality,
  (newValue) => {
    if (fetchComplete.value) {
      if (newValue != "TH" && newValue != "" && newValue != null) {
        tempNationality.value = businessPartnerForm.value.nationality;
      }
    }
  }
);

watch(
  () => businessPartnerForm.value.title_text,
  (newValue) => {
    if (fetchComplete.value) {
      if (!newValue) {
        businessPartnerForm.value.gender = null;
      } else if (newValue == "นาย" || newValue == "Mr.") {
        businessPartnerForm.value.gender = 1;
      } else {
        businessPartnerForm.value.gender = 2;
      }
    }
  }
);
businessPartnerForm.value.title = computed(() => {
  return nameTitles.value.find(
    (obj) => obj.title_name == businessPartnerForm.value.title_text
  )?.id;
});
businessPartnerForm.value.legal_form_description = computed(() => {
  return legalForms.value.find(
    (obj) => obj.id == businessPartnerForm.value.legal_form
  )?.description;
});

watch(
  () => businessPartnerForm.value.business_type_code,
  (newValue, oldValue) => {
    if (fetchComplete.value) {
      if (newValue != oldValue && businessPartnerForm.value.legal_type == 3) {
        businessPartnerForm.value.business_type_sector = null;
        businessPartnerForm.value.business_type_description = null;
      }
    }
  }
);

watch(
  () => businessPartnerForm.value.legal_type,
  async (newValue) => {
    if (fetchComplete.value) {
      if (EDIT_ACTION.value) {
        const _bpForm = await getLocalStorage(`${requestId.value}_bpForm`);

        switch (businessPartnerDetail.value?.customerType) {
          case "thai":
            switch (newValue) {
              case 1:
                if (businessPartner.value?.bp_no == bp.value) {
                  businessPartnerStore.copyFields(businessPartner.value);
                } else {
                  if (_bpForm) {
                    businessPartner.value = { ..._bpForm };
                  } else {
                    businessPartnerStore.setBpFormByBpDetail();
                  }
                }
                break;
              default:
                businessPartnerStore.clearBpFormInformation();
                break;
            }
            break;
          case "juristic":
            switch (newValue) {
              case 3:
                if (businessPartner.value?.bp_no == bp.value) {
                  businessPartnerStore.copyFields(businessPartner.value);
                } else {
                  if (_bpForm) {
                    businessPartner.value = { ..._bpForm };
                  } else {
                    businessPartnerStore.setBpFormByBpDetail();
                  }
                }
                break;
              default:
                businessPartnerStore.clearBpFormInformation();
                break;
            }
            break;
          default:
            if (businessPartner.value?.legal_type == newValue) {
              // businessPartnerStore.copyFields(businessPartner.value);
            } else {
              if (_bpForm) {
                businessPartner.value = { ..._bpForm };
              } else {
                businessPartnerStore.setBpFormByBpDetail();
              }
            }
            break;
        }

        if (businessPartnerForm.value.legal_type == 1) {
          businessPartnerForm.value.nationality = "TH";
        } else {
          if (
            businessPartnerForm.value.nationality == "TH" ||
            tempNationality.value
          ) {
            businessPartnerForm.value.nationality = tempNationality.value;
          }
        }
      }
    }
  }
);
</script>

<template>
  <Alert :data="dataAlert" />
  <AlertConfirm :text="saveButtonLabel" @confirm-click="comfirmSubmit" />
  <ModalCancelRequest />
  <div class="wraper_all">
    <FormDetailsRequest />
    <div class="section_createbp">
      <q-form
        ref="validateBpForm1"
        @validation-error="
          (ref) =>
            ref.$el.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest',
            })
        "
      >
        <StatusBar custom-class="active1" />
        <!-- <pre>{{ businessPartnerForm }}</pre> -->
        <!-- <pre>{{ businessPartnerDetail }}</pre> -->
        <FormCustomerType class="form_mt" />
        <FormAddressIDcard
          class="form_mt"
          v-if="businessPartnerForm.legal_type != 2"
        />
        <FormAddressService class="form_mt" />
        <FormAddressBilling class="form_mt" />
        <FormElectricityUsers class="form_mt" />
        <div class="box_btn_center q-mt-xl">
          <q-btn
            flat
            :label="BUTTON_TEXT.PREV"
            :href="backUrl.value || backUrl"
            class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
          />
          <q-btn
            @click="openCancelRequestModal()"
            flat
            :label="BUTTON_TEXT.REQUEST.CANCEL"
            class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
            v-if="requestId && CAN_EDIT.CANCEL.value"
          />
          <q-btn
            :href="setCurrentPath({ action: `edit` })"
            flat
            :label="BUTTON_TEXT.REQUEST.EDIT"
            class="q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
            v-if="CAN_EDIT.BP.value && businessPartner?.id && !EDIT_ACTION"
          />
          <q-btn
            @click="nextStep"
            flat
            :label="BUTTON_TEXT.NEXT"
            class="link q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white create-bp-next"
          />
        </div>
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
</route>
 -->
