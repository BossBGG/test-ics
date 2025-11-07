<script setup lang="ts">
import S316New from './S316-new.vue'

const { readonly, title } = defineProps(["readonly", "title"]);
const requestStore = useRequestStore();
const {
  request,
  nowRequestCode,
  requestForm,
  requestServiceForm,
  validateApplicationForm,
} = storeToRefs(requestStore);

const serviceStore = useServiceStore();
const { services } = storeToRefs(serviceStore);

const serviceCode = useQuery("serviceCode");

interface Service {
  request_code: string;
  name: string;
}

const computedOptions = computed(() => {
  return services.value.length
    ? services.value
    : [{ request_code: "", name: "กรุณาเลือกบริการ" }];
});


const optionLabel = (option: Service) => {
  return option.request_code && option.name
    ? `${option.request_code} : ${option.name}`
    : "กรุณาเลือกบริการ";
};

const appReadonly = computed(() => {
  if (!CAN_EDIT.APP.value && request.value?.requests?.id) {
    return true;
  }
  return !EDIT_ACTION.value;
});
</script>

<template>
  <q-form
    ref="validateApplicationForm"
    v-if="requestServiceForm"
    id="applicationForm"
    >
    <div class="box_details_request">
      <div class="q-py-sm title q-px-md">
        <h4>สร้างแบบคำร้อง{{ title }}</h4>
      </div>
      <div class="bg_field_gray">
        <div class="row q-pa-sm align-center">
          <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12 text-primary">
            บริการที่ต้องการขอใช้
          </div>
          <div class="q-pa-sm col-12 col-md-12">
            <q-select
              v-model="requestForm.service_code"
              class="border_dashed input_filled_custom"
              filled
              bg-color="white"
              color="primary"
              label-color="grey-14"
              hide-bottom-space
              :options="computedOptions"
              option-value="request_code"
              :option-label="optionLabel"
              :readonly="readonly"
              emit-value
              map-options
              :rules="[
                (val) => (val !== null && val !== '') || 'กรุณาเลือกบริการ',
              ]"
            />
          </div>
          <S301 v-if="nowRequestCode == SERVICE.S1" :readonly="appReadonly" />
          <S302 v-if="nowRequestCode == SERVICE.S2" :readonly="appReadonly" />
          <S303 v-if="nowRequestCode == SERVICE.S3" :readonly="appReadonly" />
          <S304 v-if="nowRequestCode == SERVICE.S4" :readonly="appReadonly" />
          <S305 v-if="nowRequestCode == SERVICE.S5" :readonly="appReadonly" />
          <S306 v-if="nowRequestCode == SERVICE.S6" :readonly="appReadonly" />
          <S307 v-if="nowRequestCode == SERVICE.S7" :readonly="appReadonly" />
          <S308 v-if="nowRequestCode == SERVICE.S8" :readonly="appReadonly" />
          <S309 v-if="nowRequestCode == SERVICE.S9" :readonly="appReadonly" />
          <S310 v-if="nowRequestCode == SERVICE.S10" :readonly="appReadonly" />
          <S311 v-if="nowRequestCode == SERVICE.S11" :readonly="appReadonly" />
          <S312 v-if="nowRequestCode == SERVICE.S12" :readonly="appReadonly" />
          <S313 v-if="nowRequestCode == SERVICE.S13" :readonly="appReadonly" />
          <S314 v-if="nowRequestCode == SERVICE.S14" :readonly="appReadonly" />
          <S315 v-if="nowRequestCode == SERVICE.S15" :readonly="appReadonly" />
          <RequestS316New
            v-if="nowRequestCode == SERVICE.S16"
            :readonly="appReadonly"
            :disabled-section="true"
            :allow-update-item="true"
          />
          <S317 v-if="nowRequestCode == SERVICE.S17" :readonly="appReadonly" />
          <S318 v-if="nowRequestCode == SERVICE.S18" :readonly="appReadonly" />
          <S319 v-if="nowRequestCode == SERVICE.S19" :readonly="appReadonly" />
          <S320 v-if="nowRequestCode == SERVICE.S20" :readonly="appReadonly" />
          <S321 v-if="nowRequestCode == SERVICE.S21" :readonly="appReadonly" />
          <S322 v-if="nowRequestCode == SERVICE.S22" :readonly="appReadonly" />
          <S323 v-if="nowRequestCode == SERVICE.S23" :readonly="appReadonly" />
          <S324 v-if="nowRequestCode == SERVICE.S24" :readonly="appReadonly" />
          <S325 v-if="nowRequestCode == SERVICE.S25" :readonly="appReadonly" />
          <!-- <S326 v-if="nowRequestCode == SERVICE.S26" :readonly="appReadonly" /> -->
          <S327 v-if="nowRequestCode == SERVICE.S27" :readonly="appReadonly" />
          <S328 v-if="nowRequestCode == SERVICE.S28" :readonly="appReadonly" />
          <S329 v-if="nowRequestCode == SERVICE.S29" :readonly="appReadonly" />
          <S332 v-if="nowRequestCode == SERVICE.S32" :readonly="appReadonly" />
          <S399 v-if="nowRequestCode == SERVICE.S99" :readonly="appReadonly" />
        </div>
      </div>
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
@import "@style";

.box_details_request {
  .title {
    background-color: $primary;
    color: $white;
    @include border-radius-separate(8px, 8px, 0, 0);

    h4 {
      font-size: 20px;
      font-weight: 500;

      @media (max-width: $breakpoint-xs-max) {
        font-size: 14px !important;
      }
    }
  }
}
</style>
