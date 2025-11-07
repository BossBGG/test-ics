<script setup lang="ts">
const masterDataStore = useMasterDataStore();
const requestStore = useRequestStore();
const {
  request,
  contact_logs,
  requestForm,
  requestServiceForm,
  nowRequestCode,
  requestTransformerForm,
  validateRequestForm,
  validateStatusCustomerForm,
} = storeToRefs(requestStore);
const { isNewCitySameOffice, isRequestDone } = storeToRefs(requestStore);
const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, contractAccount, businessPartnerDetail } =
  storeToRefs(businessPartnerStore);
const modalConfirm = useModalConfirmStore();
const { isModalConfirm, isModalAlert, isModalAlertReload, dataAlert } =
  storeToRefs(modalConfirm);
const uploadStore = useUploadStore();
const contact = ref("true");
const dateTime = ref(getCurrentDateTime());
const uid = useParams("uid");
const action = useQuery("action");
const text = ref("");
const success = ref(false);
const saveButtonLabel = computed(() =>
  contact.value === "true" ? "บันทึกและค้นหาข้อมูล BP" : "บันทึกและรอการติดต่อ"
);

onMounted(async () => {
  await businessPartnerStore.fetchBusinessPartnersByRequestID(
    request.value.requests?.customer_request_no
  );
});

const searchBpLink = computed(() =>
  peaUrl(
    `search-customer?request_id=${uid.value}&first_name=${requestForm.value.first_name}&last_name=${requestForm.value.last_name}&email=${requestForm.value.email}&mobile_no=${requestForm.value.mobile_no}&service_y3_type=${nowRequestCode.value}`
  )
);

const nextLink = computed(
  () =>
    `/createBp/${uid.value}?bp=${businessPartner?.value?.bp_no || ""}&ca=${
      contractAccount?.value?.ca_no || ""
    }&action=view`
);

const columns = [
  {
    name: "index",
    required: true,
    label: "ลำดับ",
    align: "center",
    field: (row) => row.name,
    format: (val) => `${val}`,
    style: "width:10%",
  },
  {
    name: "date",
    align: "center",
    label: "วันที่ติดต่อ",
    field: "date",
    style: "width:20%",
  },
  {
    name: "detail",
    align: "center",
    label: "รายละเอียด",
    field: "detail",
    style: "width:70%",
  },
];

const contactLogs = computed(() => ({
  is_contact: contact.value === "true",
  contact_date: convertDateTimeFormat(dateTime.value),
  detail: text,
}));

async function checkConfirm() {
  const isValidated = await validateRequestForm.value.validate();
  const isValidatedStatus = await validateStatusCustomerForm.value.validate();

  if (isValidated && isValidatedStatus) {
    isModalConfirm.value = true;
  } else {
    if (!isValidated) {
      validateRequestForm.value.$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else if (!isValidatedStatus) {
      validateStatusCustomerForm.value.$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
}

async function onSubmitGotoSearchBP() {
  loading.start();
  requestForm.value.service_code = nowRequestCode.value;
  requestForm.value.channel = 0;
  requestForm.value.contact_logs_model = contactLogs.value;
  requestForm.value.transformers = requestTransformerForm.value;

  if( typeof requestServiceForm.value.document_file !== 'string' ) {
    const documentFilePath = await uploadDocumentFile();
    requestServiceForm.value.document_file = documentFilePath;
  }

  requestForm.value = {
    ...requestForm.value,
    ...requestServiceForm.value,
  };

  const _request = await requestStore.fetchGetRequestsByUID(uid.value, true);
  if (
    _request?.requests?.contact_status ||
    _request?.contact_Logs.length != contact_logs.value?.length
  ) {
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

  const { status: apiStatus } = await requestStore.updateOrCreateRequestByUID(
    uid.value,
    requestForm.value
  );

  if (apiStatus) {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลสำเร็จ",
      text: saveButtonLabel,
      icon: "check",
    };

    isModalAlert.value = true;
    success.value = true;
    loading.stop();
  } else {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "บันทึกข้อมูลไม่สำเร็จ",
      text: saveButtonLabel,
      icon: "close",
    };

    isModalAlert.value = true;
    loading.stop();
  }
}

watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && success.value) {
      if (requestForm.value.contact_logs_model.is_contact) {
        window.location.href = searchBpLink.value;
      } else {
        window.location.reload();
      }
    }
  }
);

async function conFirmClick(status) {
  if (status) {
    onSubmitGotoSearchBP();
  }
}

async function goSearch(status) {
  if (status) {
    onSubmitGotoSearchBP();
  }
}

const nowDateTime = ref(getCurrentDateTime());

const lastTime = computed(() => {
  if (contact_logs.value?.length === 0 || !contact_logs.value) {
    return null;
  }
  return contact_logs.value[(contact_logs.value.length || 1) - 1];
});

const dateTimeLast = ref(
  lastTime.value
    ? dateFormatBy(lastTime.value.contact_date, "DD/MM/YYYY HH:mm")
    : nowDateTime.value
);
const nextCondition = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    return CAN_ACCESS_PAGE.BP.value;
  }
  return !CAN_EDIT.REQUEST.value;
});

if (dateTime.value !== "") {
  dateTime.value = dateTimeLast.value;
}

async function uploadDocumentFile() {
  if (requestServiceForm.value.document_file && uid.value) {
    const fileUrl = requestServiceForm.value.document_file;
    try {
      const response = await uploadStore.uploadFile(uid.value, fileUrl);
      return import.meta.env.VITE_API_URL + 'internal/file/' + response.path
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  } else {
    console.warn("No document file to upload.");
    return null;
  }
}
</script>

<template>
  <Alert :data="dataAlert" @confirm-click="goSearch" />
  <AlertReload :data="dataAlert" />
  <AlertConfirm :text="saveButtonLabel" @confirm-click="conFirmClick" />
  <q-list class="box_form_customer_type rounded-borders title">
    <q-expansion-item header-class="bg_field_primary" default-opened>
      <template #header>
        <q-item-section avatar>
          <q-icon color="white" name="data_saver_off" />
        </q-item-section>
        <q-item-section class="text_expansion">
          สถานะการติดต่อผู้ขอรับบริการ
        </q-item-section>
      </template>
      <q-card>
        <q-form ref="validateStatusCustomerForm">
          <div class="bg_field_gray rounded">
            <div class="row q-pa-sm">
              <div v-if="CAN_EDIT.REQUEST.value" class="q-pa-sm col-12">
                <div class="col-12 col-md-12">
                  <q-radio
                    :disable="!CAN_EDIT.REQUEST.value"
                    v-model="contact"
                    class="input_radio_costom"
                    val="true"
                    label="ติดต่อได้"
                    color="secondary"
                  />
                </div>

                <div class="col-12 col-md-12">
                  <q-radio
                    :disable="!CAN_EDIT.REQUEST.value"
                    v-model="contact"
                    class="input_radio_costom"
                    val="false"
                    label="ไม่สามารถติดต่อได้"
                    color="secondary"
                  />
                </div>
              </div>

              <!-- {{ dateTime }} -->
              <div class="row q-pa-sm col-12">
                <FormDateTimePicker
                  v-if="CAN_EDIT.REQUEST.value"
                  v-model="dateTime"
                  :readonly="!CAN_EDIT.REQUEST.value"
                  custom-class="q-pa-sm col-4 col-md-4"
                  label-text="วันที่และเวลาที่ทำการติดต่อ"
                />

                <div v-if="CAN_EDIT.REQUEST.value" class="q-pa-sm col-8 col-md-8">
                  <q-input
                    v-model="text"
                    :readonly="!CAN_EDIT.REQUEST.value"
                    class="full-width input_filled_custom"
                    rows="1"
                    label-color="grey-14"
                    label="หมายเหตุ"
                    stack-label
                    :dense="dense"
                    filled
                    type="textarea"
                    bg-color="white"
                    color="grey-14"
                  />
                </div>
              </div>

              <div v-if="contact_logs?.length" class="q-pa-sm col-12 col-md-12">
                <q-table
                  flat
                  :rows="contact_logs"
                  :columns="columns"
                  row-key="index"
                  hide-pagination
                  :rows-per-page-options="[0]"
                  class="table-costom request"
                >
                  <template #body="props">
                    <q-tr :props="props">
                      <q-td key="index" :props="props">
                        <span class="table-label table-label-nocolor">
                          {{ props.rowIndex + 1 }}
                        </span>
                      </q-td>
                      <q-td key="date" :props="props">
                        <span class="">
                          {{
                            dateFormatBy(
                              props.row.contact_date,
                              "DD/MM/YYYY HH:mm น."
                            )
                          }}
                        </span>
                      </q-td>
                      <q-td key="detail" :props="props">
                        <span class="">
                          {{
                            props.row.is_contact
                              ? "ติดต่อได้ : "
                              : "ไม่สามารถติดต่อได้ :"
                          }}
                          {{
                            props.row.detail == ""
                              ? "ไม่ได้ระบุไว้"
                              : props.row.detail
                          }}
                        </span>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>

              <div v-else class="q-pa-sm col-12 col-md-12">
                <div
                  class="table-costom request q-table__middle scroll q-table__container q-table--horizontal-separator column no-wrap q-table__card q-table--flat q-table--bordered q-table--no-wrap"
                >
                  <table class="q-table">
                    <thead>
                      <tr>
                        <th class="sortable text-center">ลำดับ</th>
                        <th class="sortable text-center">วันที่ติดต่อ</th>
                        <th class="text-center">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="q-tr">
                        <td class="q-td text-center" style="width: 10%" colspan="3">
                          <span
                            class="table-label table-label-nocolor w-100 text-center"
                          >ไม่พบข้อมูล</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-expansion-item>
  </q-list>

  <!-- {{ isRequestDone }} -->
  <!-- custom -->
  <div class="box_btn_center q-mt-xl">
    <q-btn
      flat
      :label="BUTTON_TEXT.PREV"
      class="q-btn-size-small bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      :href="peaUrlDashboard(request?.service_group_id)"
    />
    <q-btn
      flat
      :label="BUTTON_TEXT.REQUEST.CANCEL"
      class="btn-cancel-request q-btn-size-small bg-secondary width-270 width-xs-200 text-weight-600 text-white"
      @click="openCancelRequestModal()"
      v-if="CAN_EDIT.CANCEL.value"
    />
    <!-- <q-btn
      v-if="CAN_EDIT.REQUEST.value"
      flat
      :label="saveButtonLabel"
      class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white request-save-btn"
      @click="checkConfirm()"
      :disable="!isNewCitySameOffice"
      type="submit"
    /> -->
    <q-btn
      v-if="CAN_EDIT.REQUEST.value"
      flat
      :label="saveButtonLabel"
      class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white request-save-btn"
      @click="checkConfirm()"
      type="submit"
    />
    <q-btn
      v-if="isShowSearchBP()"
      flat
      :label="BUTTON_TEXT.BP.SEARCH"
      :href="searchBpLink"
      class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
    />
    <q-btn
      v-else-if="nextCondition"
      flat
      :label="BUTTON_TEXT.NEXT"
      :href="nextLink"
      class="q-btn-size-small bg-primary width-270 width-xs-200 text-weight-600 text-white"
    />
    <q-btn
      flat
      :label="BUTTON_TEXT.REQUEST.TRANSFER"
      v-if="CAN_EDIT.REQUEST.value"
      class="bg-warning width-270 width-xs-200 text-weight-600 q-btn-size-small text-white request-transfer-btn"
      @click="openTransferRequestModal()"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.table-costom {
  :deep(.q-table th) {
    background-color: #e3d3df !important;
    color: $primary !important;
  }
}
</style>
