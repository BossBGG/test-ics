<script setup lang="ts">
const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerForm } =
  storeToRefs(businessPartnerStore);
onMounted(() => {
});
</script>

<template>
  <div class="box_form_info">
    <div class="row q-pa-sm" id="foreignerPeople">
      <FormIdPassport v-model="businessPartnerForm.passport_no" custom-class="col-12 q-pa-sm col-md-7 idPassport"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormDatePicker v-model="businessPartnerForm.birth_date" custom-class="col-12 q-pa-sm col-md-5 birthDate"
        type="birthDate" label-text="วัน เดือน ปี เกิด"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormTitleName v-model="businessPartnerForm.title_text" custom-class="col-12 col-md-2 q-pa-sm"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormInput v-model="businessPartnerForm.first_name" custom-class="col-12 col-md-5 q-pa-sm firstName"
        :rule="(val) => (val && val.length > 0) || 'กรุณากรอกชื่อ'" label="ชื่อ" :max-length="120"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormInput v-model="businessPartnerForm.last_name" custom-class="col-12 col-md-5 q-pa-sm lastName"
        :rule="(val) => (val && val.length > 0) || 'กรุณากรอกนามสกุล'" label="นามสกุล" :max-length="150"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormGender v-model="businessPartnerForm.gender" custom-class="col-12 col-md-2 q-pa-sm"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormMartialStatus v-model="businessPartnerForm.marital_status" custom-class="col-12 col-md-5 q-pa-sm"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />

      <FormNationality v-model="businessPartnerForm.nationality" custom-class="col-12 col-md-5 q-pa-sm"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
