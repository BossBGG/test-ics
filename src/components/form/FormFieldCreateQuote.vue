<script setup lang="ts">
const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);
const requestStore = useRequestStore();
const { request } = storeToRefs(requestStore);

const quotationStore = useQuotationStore();
const { users, quotation, quotationForm, isDisabled } =
  storeToRefs(quotationStore);

const quotation_date = ref(quotationForm.value.quotation_date);

watch(
  () => quotationForm.value.quotation_date,
  (val) => {
    quotation_date.value = val;
  }
);

const popupRef = ref(null);
const quotationTitle = computed(() => {
  if (request.value?.requests?.status == "S") {
    return "สร้างใบเสนอราคา";
  } else if (
    request.value?.requests?.status == "E" ||
    request.value?.requests?.status == "R"
  ) {
    return "ยกเลิกใบเสนอราคา";
  }

  if (quotation.value?.id) {
    switch (quotation.value?.status) {
      case "Q":
        if (quotationForm.value.reviewed_by == userProfile.value?.username) {
          return "ตรวจสอบใบเสนอราคา";
        } else if (
          quotationForm.value.approved_by == userProfile.value?.username
        ) {
          return "อนุมัติใบเสนอราคา";
        } else if (isDisabled.value) {
          return "รออนุมัติใบเสนอราคา";
        }
        break;
      case "A":
      case "P":
        if (isDisabled.value) {
          return "สรุปใบเสนอราคา";
        }
        break;
    }
  }

  return "แก้ไขใบเสนอราคา";
});

function closePopup() {
  if (popupRef.value) popupRef.value.hide();
}
</script>

<template>
  <div class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>{{ quotationTitle }}</h4>
    </div>

    <div class="bg_field_gray">
      <div class="row q-pa-sm">
        <div class="col-12 col-md-6 q-pa-sm">
          <q-field
            filled
            label="ผู้สร้างใบเสนอราคา"
            readonly
            stack-label
            bg-color="white"
            class="label_q_field"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center font-size-normal"
                tabindex="0"
              >
                {{ quotationForm.quotation_by ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-12 col-md-6 q-pa-sm">
          <q-field
            filled
            label="วันที่สร้างข้อมูล"
            readonly
            stack-label
            bg-color="white"
            class="label_q_field"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center font-size-normal"
                tabindex="0"
              >
                {{ dateFormat(quotationForm.quotation_date ?? "-") }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="col-12 col-md-6 q-pa-sm">
          <q-select
            v-model="quotationForm.reviewed_by"
            label-color="grey-14"
            bg-color="white"
            :options="users"
            :option-value="(option) => `${option.username}`"
            :option-label="
              (option) =>
                `${option.username} : ${option.first_name} ${option.last_name}`
            "
            map-options
            label
            class="input_filled input_filled_custom color_text_input"
            input-debounce="0"
            filled
            emit-value
            hide-bottom-space
            readonly
          >
            <template #label> ผู้ดำเนินการตรวจสอบ </template>
          </q-select>
        </div>
        <div class="col-12 col-md-6 q-pa-sm">
          <q-select
            v-model="quotationForm.approved_by"
            label-color="grey-14"
            bg-color="white"
            :options="users"
            :option-value="(option) => `${option.username}`"
            :option-label="
              (option) =>
                `${option.username} : ${option.first_name} ${option.last_name}`
            "
            map-options
            label
            class="input_filled input_filled_custom"
            input-debounce="0"
            filled
            emit-value
            hide-bottom-space
            readonly
          >
            <template #label>
              ผู้ดำเนินการอนุมัติ<span class="color_negative">*</span>
            </template>
          </q-select>
        </div>
      </div>
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
