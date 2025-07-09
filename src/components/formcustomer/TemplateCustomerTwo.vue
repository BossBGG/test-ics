<script setup lang="ts">
const requestStore = useRequestStore();
const modalConfirmStore = useModalConfirmStore();
const businessPartnerStore = useBusinessPartnerStore();
const addressStore = useAddressStore();
const addressFormStore = useAddressFormStore();

const { request } = storeToRefs(requestStore);
const { isModalAlert, dataAlert } = storeToRefs(modalConfirmStore);
const { businessPartner, businessPartnerForm } =
  storeToRefs(businessPartnerStore);
const { provinces } = storeToRefs(addressStore);
const { addressIdCardForm } = storeToRefs(addressFormStore);

const addressLoading = ref(false);

const loadingModel = defineModel("loading");

async function searchID() {
  loadingModel.value = true;

  const data = await businessPartnerStore.searchDbd();
  if (!data?.data) {
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ไม่พบข้อมูล",
      text: "ไม่พบหมายเลขในระบบ DBD",
      icon: "close",
    };
    isModalAlert.value = true;
  } else {
    // console.log("data.data: ", data.data.AddressInformations[0]);
  }
  loadingModel.value = false;
}

onMounted(() => {
  businessPartnerStore.checkInitialValue(); // ✅ Run check only once

});

</script>

<template>
  <!-- <pre>
  hasQuery('bp') : {{ hasQuery('bp') }}
  CAN_EDIT.BP.value : {{ CAN_EDIT.BP.value }}
  businessPartner?.id : {{ businessPartner?.id }}
  EDIT_ACTION : {{ EDIT_ACTION }}
  </pre> -->

  <div class="box_form_info" id="box-legal-entity">
    <div class="row q-pa-sm">
      <div class="col-12 col-md-4 q-pa-sm">
        <q-input
          v-model="businessPartnerForm.cid"
          filled
          color="primary"
          label="หมายเลขนิติบุคคล"
          class="input_filled input-legal-entity"
          hide-bottom-space
          maxlength="13"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'กรุณากรอกหมายเลขนิติบุคคล',
          ]"
          :readonly="
            !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
          "
        >
          <template #label>
            หมายเลขนิติบุคคล<span class="color_negative">*</span>
          </template>
          <template #append>
            <q-icon
              class="curser_pointer search-ID"
              name="search"
              color="secondary"
              @click="searchID"
              v-if="
                (!hasQuery('bp') && EDIT_ACTION && CAN_EDIT.BP.value) ||
                (!businessPartner?.id && !hasQuery('bp'))
              "
            />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4 q-pa-sm tex-number">
        <q-input
          v-model="businessPartnerForm.tax_id"
          filled
          bg-color="white"
          label="เลขประจำตัวผู้เสียภาษี"
          class="input_filled input_filled_custom"
          hide-bottom-space
          :maxlength="13"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'กรุณากรอกเลขประจำตัวผู้เสียภาษี',
          ]"
          :readonly="
            !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
          "
        >
          <template #label>
            เลขประจำตัวผู้เสียภาษี<span class="color_negative">*</span>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4 q-pa-sm branch-code">
        <q-input
          v-model="businessPartnerStore.businessPartnerForm.branch_code"
          filled
          bg-color="white"
          label="รหัสสาขา"
          class="input_filled input_filled_custom"
          hide-bottom-space
          :maxlength="5"
          :rules="[
              (val) => (val && val.length > 0) || 'กรุณากรอกรหัสสาขา',
              (val) => ([4, 5].includes(val.length)) || 'กรุณากรอกรหัสสาขาให้ครบ 5 หลัก',
                        (val) => (
                businessPartnerStore.isInitialAlpha || /^[0-9]+$/.test(val)
              ) || 'กรุณากรอกเฉพาะตัวเลข'
          ]"
            :readonly="businessPartnerStore.shouldDisableInput"
        >
          <template #label>
            รหัสสาขา<span class="color_negative">*</span>
          </template>
        </q-input>
      </div>

      <div class="row box_in_row">
        <div class="q-pa-sm sub_input_name legal-entity-name">
          <q-input
            v-model="businessPartnerForm.juristic_name"
            filled
            bg-color="white"
            label="ชื่อนิติบุคคล"
            class="input_filled input_filled_custom"
            hide-bottom-space
            :maxlength="255"
            :rules="[(val) => (val && val !== '') || 'กรุณากรอกชื่อนิติบุคคล']"
            :readonly="
              !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
            "
          >
            <template #label>
              ชื่อนิติบุคคล<span class="color_negative">*</span>
            </template>
          </q-input>
        </div>
        <div class="q-pa-sm sub_radio">
          <FormBusinessTypeCode
            v-model="businessPartnerForm.business_type_code"
            custom-class="box_radio option-business-type-code"
            :disable="
              !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
            "
          />
        </div>
      </div>

      <FormLegal
        v-model="businessPartnerForm.legal_form"
        custom-class="col-12 col-md-6 q-pa-sm"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)"
      />

      <FormBusinessTypeID
        v-model="businessPartnerForm.business_type_sector"
        custom-class="col-12 col-md-6 q-pa-sm"
        :data-type="businessPartnerForm.business_type_code"
        :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
