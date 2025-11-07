<script setup lang="ts">
const props = defineProps(["props"]);

const useArdressIDcode = ref(false);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerQuotationForm } =
  storeToRefs(businessPartnerStore);

const masterDataStore = useMasterDataStore();
const { nameTitles } = storeToRefs(masterDataStore);

const addressFormStore = useAddressFormStore();
const { addressBillingForm } = storeToRefs(addressFormStore);
const addressLoading = ref(false);

watch(
  () => businessPartnerQuotationForm.value.title_text,
  (newValue) => {
    businessPartnerQuotationForm.value.title = nameTitles.value.find(
      (obj) => obj.title_name == newValue
    )?.id;
  },
  { immediate: true }
);
</script>

<template>
  <div class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>ที่อยู่ออกบิลใบเสร็จ</h4>
    </div>

    <div class="bg_field_gray">
      <div class="row q-pa-sm">
        <FormTitleName v-model="businessPartnerQuotationForm.title_text" custom-class="col-12 col-md-2 q-pa-sm"
          v-if="businessPartner?.legal_type == 1 || businessPartner?.legal_type == 2" />

        <FormInput v-model="businessPartnerQuotationForm.first_name" custom-class="col-12 col-md-5 q-pa-sm"
          :rule="(val) => (val && val.length > 0) || 'กรุณากรอกชื่อ'" label="ชื่อ" :max-length="120"
          v-if="businessPartner?.legal_type == 1 || businessPartner?.legal_type == 2" />

        <FormInput v-model="businessPartnerQuotationForm.last_name" custom-class="col-12 col-md-5 q-pa-sm"
          :rule="(val) => (val && val.length > 0) || 'กรุณากรอกนามสกุล'" label="นามสกุล" :max-length="150"
          v-if="businessPartner?.legal_type == 1 || businessPartner?.legal_type == 2" />

        <FormInput v-model="businessPartnerQuotationForm.juristic_name" custom-class="col-12 q-pa-sm" :rule="(val) =>
          (val && val.length > 0) ||
          (businessPartner?.legal_type == 3
            ? 'ชื่อนิติบุคคล'
            : 'ชื่อผู้ใช้ไฟ')
          " :label="businessPartner?.legal_type == 3 ? 'ชื่อนิติบุคคล' : 'ชื่อผู้ใช้ไฟ'
            " :max-length="255" v-else />
        <AddressInput v-model="addressBillingForm" v-model:loading="addressLoading" :readonly="useArdressIDcode" />
      </div>
      <q-inner-loading :showing="addressLoading" label="กำลังโหลด..." label-class="color_primary"
        style="background-color: rgb(245 247 248)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.box_details_request {
  .title {
    background-color: $primary;
    color: $white;
    @include border-radius-separate(8px, 8px, 0, 0);

    h4 {
      font-size: 14px;
      font-weight: 500;

      @media #{$screen-mds-min} {
        font-size: 20px;
      }
    }
  }
}
</style>
