<script setup lang="ts">
const props = defineProps({
  disable: { type: Boolean, default: false },
})

const requestStore = useRequestStore()
const {
  request,
  requestForm,
  requestServiceForm,
  nowRequestCode,
  validateRequestForm,
  isNewCitySameOffice,
  transferRequest,
} = storeToRefs(requestStore)

const addressFormStore = useAddressFormStore()
const { addressInformationForm } = storeToRefs(addressFormStore)

const latLngString = computed(() => {
  if (requestForm.value.latitude && requestForm.value.longitude) {
    return `${requestForm.value.latitude}, ${requestForm.value.longitude}`
  }
  return ''
})

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
     if (newValue) requestForm.value.address_district = newValue;
  }
);

watch(
  () => addressInformationForm.value.address_post_code,
  (newValue) => {
    if (newValue) requestForm.value.address_post_code = newValue;
  }
);
</script>

<template>
  <div class="box_form_customer_type">
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

        <q-card>
          <div class="row q-pa-sm request-address-form">
            <div v-if="true" class="row col-12 col-md-12">
              <div class="col-12">
                <div class="text-sub-head q-px-sm q-pt-sm text-weight-600 text-primary">
                  ที่อยู่สำหรับขอรับบริการ
                </div>
              </div>
              <div class="q-pa-sm col-12">
                <google-map
                  v-model:latitude="requestForm.latitude"
                  v-model:longitude="requestForm.longitude"
                  :default-address="
                    request?.latitude
                      ? ''
                      : (request?.address ?? '')
                  "
                  :disable="disable && nowRequestCode !== SERVICE.S16"
                />
                <div class="col-12">
                  <div class="q-px-sm q-pt-sm text-11px">
                    รูปสถานที่ขอรับบริการ
                  </div>
                </div>
                <div class="q-pa-sm col-12 flex items-end">
                  <img width="130px" height="73px" :style="{ borderRadius: '4px' }" src="@img/map.png" @click="openImagePreview">
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
                v-model="requestForm.address"
                :readonly="!CAN_EDIT.REQUEST.value && nowRequestCode !== SERVICE.S16"
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
              :disable-address-details="true"
              :readonly="!CAN_EDIT.REQUEST.value && nowRequestCode !== SERVICE.S16"
              :only-pea="true"
              address-class="q-pa-sm col-12 col-md-4"
            />
            <div
              v-if="true"
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
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>
