<script setup lang="ts">
const surveyStore = useSurveyStore();
const { surveyForm, isDisabled } = storeToRefs(surveyStore);

const telRules = [
  (val) =>
    (val ? val.length == 9 : true) || "รูปแบบเบอร์ติดต่อโทรศัพท์บ้านไม่ถูกต้อง",
];
const faxRules = [
  (val) => (val ? val.length == 9 : true) || "รูปแบบเบอร์แฟกซ์ไม่ถูกต้อง",
];
const mobileRules = [
  (val) => (val !== null && val !== "") || "กรุณากรอกเบอร์ติดต่อมือถือ",
  (val) => val?.length == 10 || "รูปแบบเบอร์ติดต่อมือถือไม่ถูกต้อง",
];
const emailRules = [
  (val) =>
    (val ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : true) ||
    "รูปแบบอีเมลไม่ถูกต้อง",
];
</script>

<template>
  <div class="box_form_customer_type" id="formCustomerType">
    <q-list class="rounded-borders">
      <q-expansion-item header-class="bg_field_light_gray icon_color_gray" default-opened>
        <template #header>
          <q-item-section avatar>
            <q-icon color="black" name="find_in_page" />
          </q-item-section>

          <q-item-section class="text_expansion">
            ข้อมูลติดต่อผู้ใช้ไฟฟ้า
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="row q-pa-sm">
              <div class="col-12 col-md-6 q-pa-sm">
                <q-input v-model="surveyForm.tel_no" label-color="grey-14" bg-color="white" filled label="เบอร์ติดต่อ
                โทรศัพท์บ้าน" class="input_filled input_filled_custom input-home-telephone" maxlength="9" type="text"
                  hide-bottom-space @keypress="allowOnlyNumbersNotSymbol" @paste="allowOnlyNumbersNotSymbol"
                  :rules="telRules" :readonly="isDisabled" />
              </div>

              <div class="col-12 col-md-6 q-pa-sm">
                <q-input v-model="surveyForm.mobile_no" label-color="grey-14" bg-color="white" filled
                  label="เบอร์ติดต่อ มือถือ" class="input_filled input_filled_custom input-mobile" maxlength="10"
                  type="tel" hide-bottom-space @keypress="allowOnlyNumbersNotSymbol" @paste="allowOnlyNumbersNotSymbol"
                  :rules="mobileRules" :readonly="isDisabled" />
              </div>

              <div class="col-12 col-md-6 q-pa-sm">
                <q-input v-model="surveyForm.fax_no" label-color="grey-14" bg-color="white" filled label="เบอร์แฟกซ์"
                  class="input_filled input_filled_custom input-fax" type="tel" maxlength="9" hide-bottom-space
                  @keypress="allowOnlyNumbersNotSymbol" @paste="allowOnlyNumbersNotSymbol" :rules="faxRules"
                  :readonly="isDisabled" />
              </div>

              <div class="col-12 col-md-6 q-pa-sm">
                <q-input v-model="surveyForm.email" label-color="grey-14" bg-color="white" filled label="อีเมลติดต่อ"
                  class="input_filled input_filled_custom input-email" hide-bottom-space type="text" :rules="emailRules"
                  :readonly="isDisabled" />
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
