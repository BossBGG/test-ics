<script setup lang="ts">
const requestStore = useRequestStore();
const masterDataStore = useMasterDataStore();
const $q = useQuasar();

import RequestS316New from './RequestS316New.vue'
import { copyToClipboard } from '~/utils/utils'

const props = defineProps(['readonly', 'disableMapSection', 'hideFormRequest'])
const { readonly, disableMapSection = false, hideFormRequest = false } = props

const {
  request,
  requestForm,
  nowRequestCode,
  validateRequestForm,
  isNewCitySameOffice,
  transferRequest,
  requestServiceForm,
} = storeToRefs(requestStore);

const addressFormStore = useAddressFormStore();
const { addressInformationForm } = storeToRefs(addressFormStore);
const addressLoading = ref(false);
const openImagePreviewDialog = ref(false);
const contactTime = ref('');

const { allPeaOffice } = storeToRefs(masterDataStore);

watch(
  () => addressInformationForm.value.address_province_id,
  (newValue) => {
    if (newValue) requestForm.value.address_province = newValue;
  }
);

watch(
  () => addressInformationForm.value.address_city_id,
  (newValue) => {
    if (newValue) requestForm.value.address_city = newValue;
  }
);

watch(
  () => addressInformationForm.value.address_district_id,
  async (newValue) => {
    if (newValue) {
      requestForm.value.address_district = newValue;
      transferRequest.value = "";

      const districtParam = nowRequestCode.value === "S332"
        ? undefined
        : requestForm.value.address_district !== undefined
          ? Number(requestForm.value.address_district)
          : undefined;
      await masterDataStore.fetchAllPeaOffice(districtParam);
      // await masterDataStore.fetchAllPeaOffice(newValue);

      if (allPeaOffice.value) {
        isNewCitySameOffice.value = checkSameOffice(
          requestForm.value.pea_office,
          allPeaOffice.value
        );
      } else {
        isNewCitySameOffice.value = false;
      }
    }
  }
);

watch(
  () => addressInformationForm.value.address_post_code,
  (newValue) => {
    if (newValue) requestForm.value.address_post_code = newValue;
  }
);

watch(
  () => requestForm.value.pea_office,
  (newValue) => {
    if (newValue) requestForm.value.pea_office = newValue;
  }
);

watch(
  () => requestServiceForm.value,
  () => {
    if (requestServiceForm.value.afternoon_flag || requestServiceForm.value.morning_flag) {
      contactTime.value = requestServiceForm.value.afternoon_flag
        ? '2'
        : requestServiceForm.value.morning_flag ? '1' : ''
    }
  }
  , { immediate: true, deep: true },
)

watch(
  () => contactTime.value,
  (newValue) => {
    if (newValue === '1') {
      requestServiceForm.value.morning_flag = true
      requestServiceForm.value.afternoon_flag = false
    }
    else if (newValue === '2') {
      requestServiceForm.value.morning_flag = false
      requestServiceForm.value.afternoon_flag = true
    }
  },
)

const latLngString = computed<string>({
  get() {
    const lat = requestForm.value.latitude ?? ''
    const lng = requestForm.value.longitude ?? ''
    return lat && lng ? `${lat}, ${lng}` : ''
  },
  set(value: string) {
    const [latStr, lngStr] = value.split(',').map(v => v.trim())
    requestForm.value.latitude = Number(latStr) || null
    requestForm.value.longitude = Number(lngStr) || null
  },
})

const showDocumentUpload = computed(() => {
  return requestServiceForm.value.customer_type === '1'
    && requestServiceForm.value.government_objective === '2'
    && nowRequestCode.value === SERVICE.S16
})

const showS16Fields = computed(() => {
  return nowRequestCode.value === SERVICE.S16 
})

const mobileRules = [
  (val) =>
    (val !== null && val !== undefined && val !== "") ||
    "กรุณากรอกเบอร์ติดต่อมือถือ",
  (val) =>
    (typeof val === "string" && val.length === 10) ||
    "รูปแบบเบอร์ติดต่อมือถือไม่ถูกต้อง",
];
const emailRules = [
  (val) =>
    (val ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : true) ||
    "รูปแบบอีเมลไม่ถูกต้อง",
];

const inputFields = computed(() => [
  {
    type: 'text',
    label: 'ชื่อ',
    required: true,
    model: 'first_name',
    value: requestForm.value.first_name,
    readonly: !CAN_EDIT.REQUEST.value,
    rules: [val => (val && val.length > 0) || 'กรุณากรอกชื่อ'],
    keypress: blockNumbers,
    paste: copyOnlyText,
  },
  {
    type: 'text',
    label: 'นามสกุล',
    required: true,
    model: 'last_name',
    value: requestForm.value.last_name,
    readonly: !CAN_EDIT.REQUEST.value,
    rules: [val => (val && val.length > 0) || 'กรุณากรอกนามสกุล'],
    keypress: blockNumbers,
    paste: copyOnlyText,
  },
  {
    type: 'text',
    label: 'ชื่อองค์กร/หน่วยงาน',
    model: 'pea_office',
    value: requestForm.value.pea_office,
    readonly: !CAN_EDIT.REQUEST.value,
  },
  {
    type: 'text',
    label: 'อีเมล',
    required: false,
    model: 'email',
    value: requestForm.value.email,
    readonly: !CAN_EDIT.REQUEST.value,
    rules: emailRules,
  },
  {
    type: 'text',
    label: 'เบอร์ติดต่อ',
    required: true,
    model: 'mobile_no',
    value: requestForm.value.mobile_no,
    readonly: !CAN_EDIT.REQUEST.value,
    rules: mobileRules,
    maxlength: 10,
    keypress: quantityNumbers,
    paste: copyOnlyNumber,
  },
  {
    type: 'upload',
    label: 'เอกสารรับรององค์กร/หน่วยงาน',
    model: 'document_file',
    value: requestServiceForm.value.document_file,
    readonly: !CAN_EDIT.REQUEST.value && !showS16Fields.value,
    //readonly: false,
    show: showDocumentUpload.value,
  },
  {
    type: 'select',
    label: 'วัตถุประสงค์การใช้งานเครื่องกำเนิดไฟฟ้า',
    model: 'government_objective',
    value: requestServiceForm.value.government_objective,
    //readonly: false,
    readonly: !CAN_EDIT.REQUEST.value && !showS16Fields.value,
    show: showS16Fields.value,
    options: [
      { id: '2', label: 'เพื่อสาธารณะประโยชน์', value: '2' },
      { id: '1', label: 'อื่นๆ', value: '1' },
    ],
  },
  {
    type: 'select',
    label: 'ช่วงเวลาที่สะดวกให้ติดต่อกลับ',
    model: 'cc',
    value: contactTime.value,
    readonly: !CAN_EDIT.REQUEST.value && !showS16Fields.value,
    //readonly: !CAN_EDIT.REQUEST.value,
    show: showS16Fields.value,
    options: [
      { id: '1', label: 'ช่วงเช้า (9.00-12.00)', value: '1' },
      { id: '2', label: 'ช่วงบ่าย (13.00-16.00)', value: '2' },
    ],
  },
])

function openImagePreview() {
  openImagePreviewDialog.value = true
}

watch(() => showDocumentUpload.value, (newValue) => {
  console.log(`showDocumentUpload.value`, showDocumentUpload.value)
})

watch(() => requestServiceForm.value.document_file, (newValue) => {
  console.log(`document_file value:`, newValue, typeof newValue)
}, { immediate: true })
</script>

<template>
  <!-- <pre>{{ requestForm }}</pre>
  <pre>{{ setAddress }}</pre> -->
  <!-- <pre>{{ services }}</pre> -->
  <ImagePreviewDialog
    v-if="openImagePreviewDialog"
    v-model="openImagePreviewDialog"
    :images="requestServiceForm.requests_serviceS316_picture?.length > 0 
      ? requestServiceForm.requests_serviceS316_picture.map(item => item.picture_url)
      : []"
    :start-index="0"
  />

  <div v-if="request">
    <q-form ref="validateRequestForm">
      <!-- <pre>{{ dataAddress.postcode }}</pre> -->
      <div class="box_form_customer_type">
        <div class="">
          <q-list class="rounded-borders title">
            <q-expansion-item header-class="bg_field_primary" default-opened>
              <template #header>
                <q-item-section avatar>
                  <q-icon color="white" name="person" />
                </q-item-section>
                <q-item-section class="text_expansion">
                  ข้อมูลผู้ขอรับบริการ
                </q-item-section>
              </template>
              <!-- <hr>

            <select id="" v-model="nowRequestCode" name="">
              <option v-for="(s, index) in SERVICE" :key="index" :value="s">
                {{ s }}
              </option>
            </select>
            <hr> -->
              <q-card>
                <div class="row q-pa-sm request-customer-type">
                  <div class="col-12">
                    <div class="text-sub-head q-px-sm q-pt-sm text-weight-600 text-primary">
                      ข้อมูลส่วนตัว
                    </div>
                  </div>

                  <div
                    v-for="input in inputFields"
                    :key="input.model"
                    class="q-pa-sm col-12 col-md-4"
                  >
                    <q-input
                      v-if="input.type === 'text'"
                      v-show="input.show !== false"
                      v-model="requestForm[input.model]"
                      :readonly="input.readonly"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      hide-bottom-space
                      class="input_filled input_filled_custom"
                      :rules="input.rules"
                      :maxlength="input.maxlength"
                      @keypress="input.keypress"
                      @paste="input.paste"
                    >
                      <template #label>
                        {{ input.label }}
                        <span v-if="input.required" class="color_negative">*</span>
                      </template>
                    </q-input>
                    <!-- Select input: government_objective -->
                    <q-select
                      v-else-if="input.type === 'select' && input.model === 'government_objective'"
                      v-show="input.show !== false"
                      v-model="requestServiceForm.government_objective"
                      :options="input.options"
                      :readonly="input.readonly"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      hide-bottom-space
                      class="input_filled input_filled_custom"
                      :rules="input.rules"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                    >
                      <template #label>
                        {{ input.label }}
                        <span v-if="input.required" class="color_negative">*</span>
                      </template>
                    </q-select>
                    <!-- Select input: contact time -->
                    <q-select
                      v-else-if="input.type === 'select' && input.model === 'cc'"
                      v-show="input.show !== false"
                      v-model="contactTime"
                      :options="input.options"
                     :readonly="input.readonly"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      hide-bottom-space
                      class="input_filled input_filled_custom"
                      :rules="input.rules"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                    >
                      <template #label>
                        {{ input.label }}
                        <span v-if="input.required" class="color_negative">*</span>
                      </template>
                    </q-select>
                    <!-- Upload input -->
                    <form-upload
                      v-else-if="input.type === 'upload' && input.show"
                      v-model="requestServiceForm[input.model]"
                      :label-text="input.label"
                    />
                  </div>
                </div>

                <div class="row q-pa-sm request-address-form">
                  <div v-if="!disableMapSection" class="row col-12 col-md-12">
                    <div class="col-12">
                      <div class="text-sub-head q-px-sm q-pt-sm text-weight-600 text-primary">
                        ที่อยู่สำหรับขอรับบริการ
                      </div>
                    </div>
                    <div class="q-pa-sm col-12">
                      <!-- <img src="@img/map.png" style="width: 100%" /> -->
                      <!--
                    <ArcGISMap
                      v-model:latitude="requestForm.latitude"
                      v-model:longitude="requestForm.longitude"
                      :default-address="
                        request?.latitude
                          ? ''
                          : (request?.address ?? '')
                      "
                      :disable="!CAN_EDIT.REQUEST"
                    />
                    -->
                      <google-map
                        v-model:latitude="requestForm.latitude"
                        v-model:longitude="requestForm.longitude"
                        :default-address="
                          request?.latitude
                            ? ''
                            : (request?.address ?? '')
                        "
                        :disable="false"
                      />
                      <div class="col-12">
                        <div class="q-px-sm q-pt-sm text-11px">
                          รูปสถานที่ขอรับบริการ
                        </div>
                      </div>
                      <div class="q-pa-sm col-12 flex items-end" v-if="requestServiceForm.requests_serviceS316_picture?.length > 0">
                        <img 
                          width="130px" 
                          height="73px" 
                          :style="{ borderRadius: '4px', cursor: 'pointer', objectFit: 'cover' }" 
                          :src="requestServiceForm.requests_serviceS316_picture?.[0]?.picture_url || ''" 
                          @click="openImagePreview"
                        >
                        <q-icon
                          name="download"
                          :style="{ color: '#994C80', cursor: 'pointer' }"
                          size="20px"
                          class="q-ml-sm"
                          variant="filled"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="col-12">
                      <div class="text-sub-head q-px-sm q-pt-sm text-weight-600 text-primary">
                        ที่อยู่
                      </div>
                    </div>
                  </div>

                  <div class="q-pa-sm col-12 col-md-12">
                    <q-input
                      :readonly="!CAN_EDIT.REQUEST.value"
                      v-model="requestForm.address"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      class="input_filled input_filled_custom"
                      hide-bottom-space
                      type="textarea"
                      :input-style="{ height: '80px' }"
                      :rules="[
                        (val) => (val && val.length > 0) || 'กรุณากรอกที่อยู่',
                      ]"
                    >
                      <template #label>
                        ที่อยู่<span class="color_negative">*</span>
                      </template>
                    </q-input>
                  </div>
                  <AddressInput
                    v-model="addressInformationForm"
                    v-model:loading="addressLoading"
                    :disable-address-details="true"
                    :readonly="!CAN_EDIT.REQUEST.value"
                    :only-pea="true"
                    address-class="q-pa-sm col-12 col-md-4"
                  />
                  <div
                    v-if="!disableMapSection"
                    class="q-pa-sm col-12 col-md-4"
                  >
                    <q-input
                      v-model="latLngString"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label="ตำแหน่ง Lat, Long"
                      readonly
                    >
                      <template #append>
                        <div style="font-size: 12px; color: #994C80; cursor: pointer" @click="copyToClipboard(`${requestForm.latitude}, ${requestForm.longitude}`)">
                          <q-icon
                            name="content_copy"
                            class="cursor-pointer"
                            style="color: #994C80"
                          />
                          คัดลอก
                        </div>
                      </template>
                    </q-input>
                  </div>
                  <!-- <AddressInput
                    v-if="dataAddress.postcode"
                    :data-address="dataAddress"
                    address-class="q-pa-sm col-12 col-md-4"
                    @update:data-address="setAddress = $event"
                  /> -->

                  <!-- <div class="q-pa-sm col-12 col-md-4">
                  <q-select
                    class="border_dashed input_filled_custom"
                    filled
                    stack-label
                    bg-color="white"
                    color="primary"
                    label-color="grey-14"
                    hide-bottom-space
                    v-model="requestForm.address_province"
                    :options="provinceOptions"
                  >
                  </q-select>
                </div>

                <div class="q-pa-sm col-12 col-md-4">
                  <q-select v-model="requestForm.address_city" class="border_dashed input_filled_custom" filled
                    stack-label bg-color="white" color="primary" label-color="grey-14" hide-bottom-space
                    :options="provinceOptions" />
                </div>

                <div class="q-pa-sm col-12 col-md-4">
                  <q-select v-model="requestForm.address_district" class="border_dashed input_filled_custom" filled
                    stack-label bg-color="white" color="primary" label-color="grey-14" hide-bottom-space
                    :options="provinceOptions" />
                </div>

                <div class="q-pa-sm col-12 col-md-4">
                  <q-field class="border_dashed input_filled_custom" filled label="รหัสไปรษณีย์" stack-label
                    label-color="grey-14" readonly bg-color="white" type="email">
                    <template #control>
                      <div class="full-width no-outline self-center" tabindex="0">
                        {{ requests.address_post_code ?? "-" }}
                      </div>
                    </template>
                  </q-field>
                </div> -->
                </div>

                <q-inner-loading
                  :showing="addressLoading"
                  label="กำลังโหลด..."
                  label-class="color_primary"
                  style="background-color: rgb(245 247 248)"
                />
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>

      <div class="space" />

      <!-- {{ nowRequestCode }} : {{ SERVICE.S1 }} -->

      <div v-if="!hideFormRequest" class="form-request-service">
        <RequestS301 v-if="nowRequestCode == SERVICE.S1" />
        <RequestS302 v-if="nowRequestCode == SERVICE.S2" />
        <RequestS303 v-if="nowRequestCode == SERVICE.S3" />
        <RequestS304 v-if="nowRequestCode == SERVICE.S4" />
        <RequestS305 v-if="nowRequestCode == SERVICE.S5" />
        <RequestS306 v-if="nowRequestCode == SERVICE.S6" />
        <RequestS307 v-if="nowRequestCode == SERVICE.S7" />
        <RequestS308 v-if="nowRequestCode == SERVICE.S8" />
        <RequestS309 v-if="nowRequestCode == SERVICE.S9" />
        <RequestS310 v-if="nowRequestCode == SERVICE.S10" />
        <RequestS311 v-if="nowRequestCode == SERVICE.S11" />
        <RequestS312 v-if="nowRequestCode == SERVICE.S12" />
        <RequestS313 v-if="nowRequestCode == SERVICE.S13" />
        <RequestS314 v-if="nowRequestCode == SERVICE.S14" />
        <RequestS315 v-if="nowRequestCode == SERVICE.S15" />
        <RequestS316New v-if="nowRequestCode == SERVICE.S16" />
        <RequestS317 v-if="nowRequestCode == SERVICE.S17" />
        <RequestS318 v-if="nowRequestCode == SERVICE.S18" />
        <RequestS319 v-if="nowRequestCode == SERVICE.S19" />
        <RequestS320 v-if="nowRequestCode == SERVICE.S20" />
        <RequestS321 v-if="nowRequestCode == SERVICE.S21" />
        <RequestS322 v-if="nowRequestCode == SERVICE.S22" />
        <RequestS323 v-if="nowRequestCode == SERVICE.S23" />
        <RequestS324 v-if="nowRequestCode == SERVICE.S24" />
        <RequestS325 v-if="nowRequestCode == SERVICE.S25" />
        <!-- <RequestS326 v-if="nowRequestCode == SERVICE.S26" /> -->
        <RequestS327 v-if="nowRequestCode == SERVICE.S27" />
        <RequestS328 v-if="nowRequestCode == SERVICE.S28" />
        <RequestS329 v-if="nowRequestCode == SERVICE.S29" />
        <RequestS332 v-if="nowRequestCode == SERVICE.S32" />
        <RequestS399 v-if="nowRequestCode == SERVICE.S99" />
      </div>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
.space {
  margin-bottom: 19px;
}
</style>
