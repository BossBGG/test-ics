<script setup lang="ts">
const props = defineProps(["props"]);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerForm } =
  storeToRefs(businessPartnerStore);

const addressFormStore = useAddressFormStore();
const { addressIdCardForm, addressBillingForm, addressRequestForm } =
  storeToRefs(addressFormStore);
const addressLoading = ref(false);

watch(() => addressIdCardForm.value, newValue, {
  deep: true,
});

watch(
  () => addressBillingForm.value.same_address,
  () => newValue(true)
);

function newValue(setNull = false) {
  if (
    addressBillingForm.value.same_address &&
    businessPartnerForm.value.legal_type != 2
  ) {
    addressBillingForm.value.address_room_no =
      addressIdCardForm.value.address_room_no ?? null;
    addressBillingForm.value.address_floor =
      addressIdCardForm.value.address_floor ?? null;
    addressBillingForm.value.address_house_name =
      addressIdCardForm.value.address_house_name ?? null;
    addressBillingForm.value.address_house_no =
      addressIdCardForm.value.address_house_no ?? null;
    addressBillingForm.value.address_house_id =
      addressIdCardForm.value.address_house_id ?? null;
    addressBillingForm.value.address_moo =
      addressIdCardForm.value.address_moo ?? null;
    addressBillingForm.value.address_street =
      addressIdCardForm.value.address_street ?? null;
    addressBillingForm.value.address_lane =
      addressIdCardForm.value.address_lane ?? null;
    addressBillingForm.value.address_alley =
      addressIdCardForm.value.address_alley ?? null;
    addressBillingForm.value.address_district_id =
      addressIdCardForm.value.address_district_id ?? null;
    addressBillingForm.value.address_district =
      addressIdCardForm.value.address_district ?? null;
    addressBillingForm.value.address_city_id =
      addressIdCardForm.value.address_city_id ?? null;
    addressBillingForm.value.address_city =
      addressIdCardForm.value.address_city ?? null;
    addressBillingForm.value.address_province_id =
      addressIdCardForm.value.address_province_id ?? null;
    addressBillingForm.value.address_province =
      addressIdCardForm.value.address_province ?? null;
    addressBillingForm.value.address_post_code =
      addressIdCardForm.value.address_post_code ?? null;
  } else if (
    addressBillingForm.value.same_address &&
    businessPartnerForm.value.legal_type == 2
  ) {
    addressBillingForm.value.address_room_no =
      addressRequestForm.value.address_room_no ?? null;
    addressBillingForm.value.address_floor =
      addressRequestForm.value.address_floor ?? null;
    addressBillingForm.value.address_house_name =
      addressRequestForm.value.address_house_name ?? null;
    addressBillingForm.value.address_house_no =
      addressRequestForm.value.address_house_no ?? null;
    addressBillingForm.value.address_house_id =
      addressRequestForm.value.address_house_id ?? null;
    addressBillingForm.value.address_moo =
      addressRequestForm.value.address_moo ?? null;
    addressBillingForm.value.address_lane =
      addressRequestForm.value.address_lane ?? null;
    addressBillingForm.value.address_street =
      addressRequestForm.value.address_street ?? null;
    addressBillingForm.value.address_alley =
      addressRequestForm.value.address_alley ?? null;
    addressBillingForm.value.address_district_id =
      addressRequestForm.value.address_district_id ?? null;
    addressBillingForm.value.address_district =
      addressRequestForm.value.address_district ?? null;
    addressBillingForm.value.address_city_id =
      addressRequestForm.value.address_city_id ?? null;
    addressBillingForm.value.address_city =
      addressRequestForm.value.address_city ?? null;
    addressBillingForm.value.address_province_id =
      addressRequestForm.value.address_province_id ?? null;
    addressBillingForm.value.address_province =
      addressRequestForm.value.address_province ?? null;
    addressBillingForm.value.address_post_code =
      addressRequestForm.value.address_post_code ?? null;
  } else if (setNull === true) {
    addressBillingForm.value.address_room_no = null;
    addressBillingForm.value.address_floor = null;
    addressBillingForm.value.address_house_name = null;
    addressBillingForm.value.address_house_no = null;
    addressBillingForm.value.address_house_id = null;
    addressBillingForm.value.address_moo = null;
    addressBillingForm.value.address_street = null;
    addressBillingForm.value.address_lane = null;
    addressBillingForm.value.address_alley = null;
    addressBillingForm.value.address_province_id = null;
    addressBillingForm.value.address_province = null;
    addressBillingForm.value.address_city_id = null;
    addressBillingForm.value.address_city = null;
    addressBillingForm.value.address_district_id = null;
    addressBillingForm.value.address_district = null;
    addressBillingForm.value.address_post_code = null;
  }
}
</script>

<template>
  <div class="box_form_customer_type" id="formAddressBilling">
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
            ที่อยู่ออกบิลใบเสร็จ
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="box_sevice box_billing">
              <div
                class="row q-px-sm"
                v-if="
                  CAN_EDIT.BP.value && (EDIT_ACTION || !businessPartner?.id)
                "
              >
                <div class="col-12 q-pa-sm">
                  <q-checkbox
                    v-model="addressBillingForm.same_address"
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
                  v-model="addressBillingForm"
                  v-model:loading="addressLoading"
                  :readonly="
                    !CAN_EDIT.BP.value ||
                    (businessPartner?.id && !EDIT_ACTION) ||
                    addressBillingForm.same_address
                  "
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
