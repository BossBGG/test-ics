<script setup lang="ts">
const businessPartnerStore = useBusinessPartnerStore();
const requestStore = useRequestStore();

const { businessPartner, businessPartnerForm } =
  storeToRefs(businessPartnerStore);
const { request } = storeToRefs(requestStore);

const telRules = [
  (val) =>
    (val ? val.length == 9 : true) || "รูปแบบเบอร์ติดต่อโทรศัพท์บ้านไม่ถูกต้อง",
];
const faxRules = [
  (val) => (val ? val.length == 9 : true) || "รูปแบบเบอร์แฟกซ์ไม่ถูกต้อง",
];
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
  <div class="box_form_customer_type">
    <q-list class="rounded-borders">
      <q-expansion-item
        header-class="bg_field_light_gray icon_color_gray"
        default-opened
      >
        <template #header>
          <q-item-section avatar>
            <q-icon color="black" name="find_in_page" />
          </q-item-section>

          <q-item-section class="text_expansion">
            ข้อมูลติดต่อผู้ใช้ไฟฟ้า
          </q-item-section>
        </template>

        <q-card>
          <q-card-section id="formElectricityUser">
            <div class="row q-pa-sm">
              <div class="col-12 col-md-6 q-pa-sm">
                <q-input
                  v-model="businessPartnerForm.tel_no"
                  label-color="grey-14"
                  bg-color="white"
                  filled
                  label="เบอร์ติดต่อ
                โทรศัพท์บ้าน"
                  class="input_filled input_filled_custom input-home-telephone"
                  maxlength="9"
                  type="text"
                  hide-bottom-space
                  @keypress="quantityNumbers"
                  @paste="copyOnlyNumber"
                  :rules="telRules"
                  :readonly="
                    !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                  "
                />
              </div>
              <div class="col-12 col-md-6 q-pa-sm">
                <q-input
                  v-model="businessPartnerForm.mobile_no"
                  label-color="grey-14"
                  bg-color="white"
                  filled
                  label="เบอร์ติดต่อ มือถือ"
                  class="input_filled input_filled_custom input-mobile"
                  maxlength="10"
                  type="tel"
                  hide-bottom-space
                  @keypress="quantityNumbers"
                  @paste="copyOnlyNumber"
                  :rules="mobileRules"
                  lazy-rules
                  :readonly="
                    !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                  "
                >
                  <template #label>
                    เบอร์ติดต่อ มือถือ<span class="color_negative">*</span>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-6 q-pa-sm">
                <q-input
                  v-model="businessPartnerForm.fax_no"
                  label-color="grey-14"
                  bg-color="white"
                  filled
                  label="เบอร์แฟกซ์"
                  class="input_filled input_filled_custom input-fax"
                  type="tel"
                  maxlength="9"
                  hide-bottom-space
                  @keypress="allowOnlyNumbers"
                  @paste="copyOnlyNumber"
                  :rules="faxRules"
                  :readonly="
                    !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                  "
                />
              </div>

              <div class="col-12 col-md-6 q-pa-sm">
                <q-input
                  v-model="businessPartnerForm.email"
                  label-color="grey-14"
                  bg-color="white"
                  filled
                  label="อีเมลติดต่อ"
                  class="input_filled input_filled_custom input-email"
                  hide-bottom-space
                  type="text"
                  :rules="emailRules"
                  :readonly="
                    !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                  "
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
