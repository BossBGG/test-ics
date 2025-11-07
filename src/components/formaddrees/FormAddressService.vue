<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requestForm, nowRequestCode } = storeToRefs(requestStore);
const modalConfirm = useModalConfirmStore();
const { isModalAlert, dataAlert } = storeToRefs(modalConfirm);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerForm } =
  storeToRefs(businessPartnerStore);

const props = defineProps(["props"]);

const addressStore = useAddressStore();
const { peaProvinces } = storeToRefs(addressStore);
const addressFormStore = useAddressFormStore();
const { addressIdCardForm, addressRequestForm } = storeToRefs(addressFormStore);

// addressRequestForm.value.address_room_no = addressIdCardForm.value.address_room_no ?? null;
const addressLoading = ref(false);

watch(
  () => addressIdCardForm.value,
  () => newValue(),
  {
    deep: true,
  }
);
watch(
  () => addressRequestForm.value.same_address,
  () => newValue(true, true)
);

function newValue(setNull = false, checkProvince = false) {
  if (addressRequestForm.value.same_address) {
    if (checkProvince && nowRequestCode.value !== "S332") {
      const selectedProvince = peaProvinces.value?.find(
        (option) => option?.id == addressIdCardForm.value.address_province_id
      );
      if (!selectedProvince) {
        addressRequestForm.value.same_address = false;
        dataAlert.value = {
          colorText: "primary",
          colorIcon: "white",
          title: `ไม่สามารถดำเนินการได้`,
          text: `เนื่องจาก${
            useTitleFormAddressIDcard() ?? "ที่อยู่ตามบัตรประชาชน"
          }อยู่นอกเหนือพื้นที่ให้บริการ`,
          icon: "close",
        };
        isModalAlert.value = true;
        return;
      }
    }
    addressRequestForm.value.address_room_no =
      addressIdCardForm.value.address_room_no ?? null;
    addressRequestForm.value.address_floor =
      addressIdCardForm.value.address_floor ?? null;
    addressRequestForm.value.address_house_name =
      addressIdCardForm.value.address_house_name ?? null;
    addressRequestForm.value.address_house_no =
      addressIdCardForm.value.address_house_no ?? null;
    addressRequestForm.value.address_house_id =
      addressIdCardForm.value.address_house_id ?? null;
    addressRequestForm.value.address_moo =
      addressIdCardForm.value.address_moo ?? null;
    addressRequestForm.value.address_street =
      addressIdCardForm.value.address_street ?? null;
    addressRequestForm.value.address_lane =
      addressIdCardForm.value.address_lane ?? null;
    addressRequestForm.value.address_alley =
      addressIdCardForm.value.address_alley ?? null;
    addressRequestForm.value.address_district_id =
      addressIdCardForm.value.address_district_id ?? null;
    addressRequestForm.value.address_district =
      addressIdCardForm.value.address_district ?? null;
    addressRequestForm.value.address_city_id =
      addressIdCardForm.value.address_city_id ?? null;
    addressRequestForm.value.address_city =
      addressIdCardForm.value.address_city ?? null;
    addressRequestForm.value.address_province_id =
      addressIdCardForm.value.address_province_id ?? null;
    addressRequestForm.value.address_province =
      addressIdCardForm.value.address_province ?? null;
    addressRequestForm.value.address_post_code =
      addressIdCardForm.value.address_post_code ?? null;
  } else if (setNull === true) {
    addressRequestForm.value.address_room_no = null;
    addressRequestForm.value.address_floor = null;
    addressRequestForm.value.address_house_name = null;
    addressRequestForm.value.address_house_no = null;
    addressRequestForm.value.address_house_id = null;
    addressRequestForm.value.address_moo = null;
    addressRequestForm.value.address_street = null;
    addressRequestForm.value.address_lane = null;
    addressRequestForm.value.address_alley = null;
    addressRequestForm.value.address_province_id = null;
    addressRequestForm.value.address_province = null;
    addressRequestForm.value.address_city_id = null;
    addressRequestForm.value.address_city = null;
    addressRequestForm.value.address_district_id = null;
    addressRequestForm.value.address_district = null;
    addressRequestForm.value.address_post_code = null;
  }
}
</script>

<template>
  <div class="box_form_customer_type" id="formAddressService">
    <q-list class="rounded-borders">
      <q-expansion-item
        header-class="bg_field_light_gray icon_color_gray"
        default-opened
      >
        <template #header>
          <q-item-section avatar>
            <q-icon color="black" name="holiday_village" />
          </q-item-section>

          <q-item-section class="text_expansion">
            ที่อยู่สำหรับขอรับบริการ
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="box_sevice">
              <div class="row q-px-sm">
                <div class="col-12 q-pa-sm">
                  <div class="wraper_form">
                    <q-field
                      filled
                      label="CA No."
                      stack-label
                      readonly
                      bg-color="white"
                    >
                      <template #control>
                        <div
                          class="full-width no-outline self-center"
                          tabindex="0"
                        >
                          {{
                            businessPartnerForm?.ca_no
                              ? businessPartnerForm?.ca_no
                              : "-"
                          }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>
                <div class="col-12 q-px-sm" v-if="!requestForm?.channel">
                  <div class="title">
                    <p>ที่อยู่จาก e-Service</p>
                  </div>
                </div>
                <div class="col-12 q-pa-sm" v-if="!requestForm?.channel">
                  <div class="wraper_form">
                    <q-field
                      filled
                      label="ที่อยู่"
                      stack-label
                      readonly
                      bg-color="white"
                    >
                      <template #control>
                        <div
                          class="full-width no-outline self-center"
                          tabindex="0"
                        >
                          {{ request?.address }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>
                <div
                  v-if="
                    businessPartnerForm.legal_type != 2 &&
                    CAN_EDIT.BP.value &&
                    (EDIT_ACTION || !businessPartner?.id)
                  "
                  class="col-12 q-pa-sm"
                >
                  <q-checkbox
                    v-model="addressRequestForm.same_address"
                    left-label
                    color="secondary"
                    size="48px"
                    :label="useTitleSameFormAddressIDcard()"
                    class="custom_checkbox checkbox-same-address"
                  />
                </div>
              </div>
            </div>
            <div class="box_form_info">
              <div class="row q-px-sm q-pb-sm">
                <AddressInput
                  v-model="addressRequestForm"
                  v-model:loading="addressLoading"
                  :readonly="
                    !CAN_EDIT.BP.value ||
                    (businessPartner?.id && !EDIT_ACTION) ||
                    addressRequestForm.same_address
                  "
                  :onlyPea="true"
                />
              </div>
            </div>
          </q-card-section>
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
</template>

<style lang="scss" scoped>
@import "@style";
</style>
