<script setup lang="ts">
const surveyStore = useSurveyStore();
const { survey, surveyForm, isDisabled } = storeToRefs(surveyStore);

const addressStore = useAddressStore();
const { addressRequest } = storeToRefs(addressStore);

const addressFormStore = useAddressFormStore();
const { addressRequestForm } = storeToRefs(addressFormStore);
const addressLoading = ref(false);

watch(
  () => surveyForm.value.same_requesting_address,
  (newValue) => {
    if (newValue) {
      addressRequestForm.value.address_room_no =
        addressRequest.value.address_room_no ?? null;
      addressRequestForm.value.address_floor =
        addressRequest.value.address_floor ?? null;
      addressRequestForm.value.address_house_name =
        addressRequest.value.address_house_name ?? null;
      addressRequestForm.value.address_house_no =
        addressRequest.value.address_house_no ?? null;
      addressRequestForm.value.address_house_id =
        addressRequest.value.address_house_id ?? null;
      addressRequestForm.value.address_moo =
        addressRequest.value.address_moo ?? null;
      addressRequestForm.value.address_street =
        addressRequest.value.address_street ?? null;
      addressRequestForm.value.address_lane =
        addressRequest.value.address_lane ?? null;
      addressRequestForm.value.address_alley =
        addressRequest.value.address_alley ?? null;
      addressRequestForm.value.address_province_id =
        addressRequest.value.address_province_id ?? null;
      addressRequestForm.value.address_province =
        addressRequest.value.address_province ?? null;
      addressRequestForm.value.address_city_id =
        addressRequest.value.address_city_id ?? null;
      addressRequestForm.value.address_city =
        addressRequest.value.address_city ?? null;
      addressRequestForm.value.address_district_id =
        addressRequest.value.address_district_id ?? null;
      addressRequestForm.value.address_district =
        addressRequest.value.address_district ?? null;
      addressRequestForm.value.address_post_code =
        addressRequest.value.address_post_code ?? null;
      addressRequestForm.value.address_service_type =
        addressRequest.value.address_service_type ?? 5;
      addressRequestForm.value.status = false;
    }
    // else {
    //   addressRequestForm.value.address_room_no = null;
    //   addressRequestForm.value.address_floor = null;
    //   addressRequestForm.value.address_house_name = null;
    //   addressRequestForm.value.address_house_no = null;
    //   addressRequestForm.value.address_house_id = null;
    //   addressRequestForm.value.address_moo = null;
    //   addressRequestForm.value.address_street = null;
    //   addressRequestForm.value.address_lane = null;
    //   addressRequestForm.value.address_alley = null;
    //   addressRequestForm.value.address_province_id = null;
    //   addressRequestForm.value.address_province = null;
    //   addressRequestForm.value.address_city_id = null;
    //   addressRequestForm.value.address_city = null;
    //   addressRequestForm.value.address_district_id = null;
    //   addressRequestForm.value.address_district = null;
    //   addressRequestForm.value.address_post_code = null;
    //   addressRequestForm.value.address_service_type = 5;
    // }
  }
);
</script>

<template>
  <div class="box_form_customer_type">
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
            <div class="row q-px-sm q-pb-sm q-pt-sm">
              <div class="col-12 q-pa-sm">
                <q-checkbox
                  v-model="surveyForm.same_requesting_address"
                  label-color="grey-14"
                  bg-color="white"
                  left-label
                  color="secondary"
                  size="48px"
                  label="ใช้ที่อยู่เดียวกับที่อยู่สำหรับขอรับบริการ"
                  class="custom_checkbox input_checkbox_costom"
                  maxlength="10"
                  :disable="isDisabled"
                />
              </div>
              <AddressInput
                v-model="addressRequestForm"
                v-model:loading="addressLoading"
                :readonly="surveyForm.same_requesting_address"
                :enableHouseID="true"
                :onlyPea="true"
              />
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
