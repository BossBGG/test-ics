<script setup lang="ts">
const requestStore = useRequestStore();
const masterDataStore = useMasterDataStore();

const {
  request,
  requestForm,
  requestServiceForm,
  nowRequestCode,
  validateRequestForm,
  isNewCitySameOffice,
  transferRequest,
} = storeToRefs(requestStore);

const addressFormStore = useAddressFormStore();
const { addressInformationForm } = storeToRefs(addressFormStore);
const addressLoading = ref(false);

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
      // requestForm.value.address = '';

      await masterDataStore.fetchAllPeaOffice(newValue);

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
</script>

<template>
  <!-- <pre>{{ requestForm }}</pre>
  <pre>{{ setAddress }}</pre> -->
  <!-- <pre>{{ services }}</pre> -->

  <div v-if="request">
    <q-form ref="validateRequestForm">
      <!-- <pre>{{ dataAddress.postcode }}</pre> -->
      <div class="box_form_customer_type">
        <div class="">
          <q-list class="rounded-borders">
            <q-expansion-item header-class="bg_field_light_gray" default-opened>
              <template #header>
                <q-item-section avatar>
                  <q-icon color="black" name="person" />
                </q-item-section>
                <q-item-section class="text_expansion">
                  ประเภทลูกค้า
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
                  <div class="q-pa-sm col-12 col-md-6">
                    <q-input
                      v-model="requestForm.first_name"
                      :readonly="!CAN_EDIT.REQUEST.value"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      class="input_filled input_filled_custom input-first-name"
                      hide-bottom-space
                      :rules="[
                        (val) => (val && val.length > 0) || 'กรุณากรอกชื่อ',
                      ]"
                      @keypress="blockNumbers"
                      @paste="copyOnlyText"
                    >
                      <template #label>
                        ชื่อ<span class="color_negative">*</span>
                      </template>
                    </q-input>
                  </div>
                  <div class="q-pa-sm col-12 col-md-6">
                    <q-input
                      v-model="requestForm.last_name"
                      bg-color="white"
                      color="primary"
                      :readonly="!CAN_EDIT.REQUEST.value"
                      label-color="grey-14"
                      filled
                      label
                      class="input_filled input_filled_custom input-last-name"
                      hide-bottom-space
                      :rules="[
                        (val) => (val && val.length > 0) || 'กรุณากรอกนามสกุล',
                      ]"
                      @keypress="blockNumbers"
                      @paste="copyOnlyText"
                    >
                      <template #label>
                        นามสกุล<span class="color_negative">*</span>
                      </template>
                    </q-input>
                  </div>
                  <div class="q-pa-sm col-12 col-md-6">
                    <q-input
                      v-model="requestForm.mobile_no"
                      :readonly="!CAN_EDIT.REQUEST.value"
                      bg-color="white"
                      color="primary"
                      maxlength="10"
                      label-color="grey-14"
                      filled
                      label
                      class="input_filled input_filled_custom input-mobile"
                      hide-bottom-space
                      :rules="mobileRules"
                      @keypress="quantityNumbers"
                      @paste="copyOnlyNumber"
                    >
                      <template #label>
                        เบอร์ติดต่อ<span class="color_negative">*</span>
                      </template>
                    </q-input>
                  </div>
                  <div class="q-pa-sm col-12 col-md-6">
                    <q-input
                      v-model="requestForm.email"
                      :readonly="!CAN_EDIT.REQUEST.value"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label
                      class="input_filled input_filled_custom input-email"
                      :rules="emailRules"
                      hide-bottom-space
                    >
                      <template #label> อีเมล </template>
                    </q-input>
                  </div>
                </div>
                <div class="row q-pa-sm request-address-form">
                  <div class="col-12">
                    <div class="text-sub-head q-px-sm q-pt-sm text-weight-600">
                      ที่อยู่สำหรับขอรับบริการ
                    </div>
                  </div>
                  <div class="q-pa-sm col-12">
                    <!-- <img src="@img/map.png" style="width: 100%" /> -->

                    <ArcGISMap
                      v-model:latitude="requestForm.latitude"
                      v-model:longitude="requestForm.longitude"
                      :default-address="
                        request?.requests?.latitude
                          ? ''
                          : request?.address.replace(
                              request?.requests?.address + ` `,
                              ``
                            )
                      "
                      :disable="!CAN_EDIT.REQUEST.value"
                    />
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
                    :disableAddressDetails="true"
                    :readonly="!CAN_EDIT.REQUEST.value"
                    :onlyPea="true"
                  />
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
                <!-- {{ nowRequestCode }} : {{ SERVICE.S1 }} -->
                <div class="form-request-service">
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
                  <RequestS316 v-if="nowRequestCode == SERVICE.S16" />
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
    </q-form>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
