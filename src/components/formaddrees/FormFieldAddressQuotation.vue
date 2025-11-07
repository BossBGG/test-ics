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
      (obj) => obj.title_name == newValue,
    )?.id;
  },
  { immediate: true }
);
</script>

<template>
  <div class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>ที่อยู่รับใบเสนอราคาและใบเสร็จ</h4>
    </div>
    <div class="bg_field_gray">
      <div class="row q-pa-sm">
        <div class="col-12 col-md-2 q-pa-sm"
          v-if="businessPartner?.legal_type == 1 || 
        businessPartner?.legal_type == 2">
          <q-field filled label="คำนำหน้าชื่อ" readonly stack-label bg-color="white" class="label_q_field">
            <template #control>
              <div class="full-width no-outline color_text_input self-center font-size-normal" tabindex="0">
                {{ businessPartnerQuotationForm.title_text ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-12 col-md-5 q-pa-sm"
          v-if="businessPartner?.legal_type == 1 || 
        businessPartner?.legal_type == 2">
          <q-field filled label="ชื่อ" readonly stack-label bg-color="white" class="label_q_field">
            <template #control>
              <div class="full-width no-outline color_text_input self-center font-size-normal" tabindex="0">
                {{ businessPartnerQuotationForm.first_name ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-12 col-md-5 q-pa-sm"
          v-if="businessPartner?.legal_type == 1 || 
        businessPartner?.legal_type == 2">
          <q-field filled label="นามสกุล" readonly stack-label bg-color="white" class="label_q_field">
            <template #control>
              <div class="full-width no-outline color_text_input self-center font-size-normal" tabindex="0">
                {{ businessPartnerQuotationForm.last_name ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <div v-else class="col-12 q-pa-sm">
          <q-field filled :label="businessPartner?.legal_type == 3
              ? 'ชื่อนิติบุคคล'
              : 'ชื่อผู้ใช้ไฟ'
            " readonly stack-label bg-color="white" 
          class="label_q_field">
            <template #control>
              <div class="full-width no-outline color_text_input self-center font-size-normal" tabindex="0">
                {{ businessPartnerQuotationForm.juristic_name ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <AddressInput
          v-model="addressBillingForm" v-model:loading="addressLoading" :disable="useArdressIDcode"
          :readonly="true" :hide-dropdown-icon="true"
        />
      </div>
      <q-inner-loading :showing="addressLoading" label="กำลังโหลด..." 
        label-class="color_primary"
        style="background-color: rgb(245 247 248)"/>
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
