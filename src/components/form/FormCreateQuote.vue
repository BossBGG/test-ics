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

const filterValue = ref("");
const filteredMaterials = computed(() => {
  const _users = users.value.filter(
    (option) =>
      option.username != quotationForm.value.approved_by &&
      option.username != userProfile.value.username
  );
  if (!filterValue.value) {
    return _users;
  }
  const needle = filterValue.value.toLowerCase();
  return _users.filter((option) => {
    const username = option.username
      ? String(option.username).toLowerCase()
      : "";
    const first_name = option.first_name ? option.first_name.toLowerCase() : "";
    const last_name = option.last_name ? option.last_name.toLowerCase() : "";
    return (
      username.includes(needle) ||
      first_name.includes(needle) ||
      last_name.includes(needle)
    );
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};

const filterValue2 = ref("");
const filteredMaterials2 = computed(() => {
  const _users = users.value.filter(
    (option) =>
      option.username != quotationForm.value.reviewed_by &&
      option.username != userProfile.value.username
  );
  if (!filterValue2.value) {
    return _users;
  }
  const needle = filterValue2.value.toLowerCase();
  return _users.filter((option) => {
    const username = option.username
      ? String(option.username).toLowerCase()
      : "";
    const first_name = option.first_name ? option.first_name.toLowerCase() : "";
    const last_name = option.last_name ? option.last_name.toLowerCase() : "";
    return (
      username.includes(needle) ||
      first_name.includes(needle) ||
      last_name.includes(needle)
    );
  });
});

const filterFn2 = (val, update) => {
  filterValue2.value = val;
  update();
};

const popupRef = ref(null);
function closePopup() {
  if (popupRef.value) popupRef.value.hide();
}
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
</script>

<template>
  <div class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>{{ quotationTitle }}</h4>
    </div>
    <div class="bg_field_gray">
      <div class="row q-pa-sm approver">
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
                {{
                  quotationForm.quotation_by ||
                  `${userProfile.first_name} ${userProfile.last_name}`
                }}
              </div>
            </template>
          </q-field>
        </div>

        <FormDatePicker
          v-model="quotation_date"
          custom-class="col-12 col-md-6 q-pa-sm"
          label-text="วันที่สร้างข้อมูล"
          type="minDate"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'กรุณาเลือกวันที่สร้างข้อมูล',
          ]"
        />

        <!-- <div class="col-12 col-md-6 q-pa-sm">
          <q-input
            v-model="quotation_date"
            class="input_filled input_filled_custom"
            bg-color="white"
            label-color="grey-14"
            hide-bottom-space
            filled
            label="วันที่สร้างข้อมูล"
            mask="date"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'กรุณาเลือกวันที่สร้างข้อมูล',
            ]"
          >
            <template #append>
              <q-icon
                name="calendar_today"
                color="secondary"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="popupRef"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="quotationForm.quotation_date"
                    mask="YYYY-MM-DD[T]HH:mm:ss"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        @click="closePopup"
                        label="Close"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div> -->
        <div class="col-12 col-md-6 q-pa-sm">
          <q-select
            v-model="quotationForm.reviewed_by"
            label-color="grey-14"
            bg-color="white"
            :options="filteredMaterials"
            :option-value="(option) => `${option.username}`"
            :option-label="
              (option) =>
                `${option.username} : ${option.first_name} ${option.last_name}`
            "
            map-options
            label
            class="input_filled input_filled_custom color_text_input"
            :readonly="isDisabled"
            input-debounce="0"
            filled
            emit-value
            use-input
            fill-input
            hide-selected
            @filter="filterFn"
            hide-bottom-space
            clearable
          >
            <template #label>ผู้ดำเนินการตรวจสอบ</template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-6 q-pa-sm">
          <q-select
            v-model="quotationForm.approved_by"
            label-color="grey-14"
            bg-color="white"
            :options="filteredMaterials2"
            :option-value="(option) => `${option.username}`"
            :option-label="
              (option) =>
                `${option.username} : ${option.first_name} ${option.last_name}`
            "
            map-options
            label
            class="input_filled input_filled_custom qt-approver"
            :readonly="isDisabled"
            input-debounce="0"
            filled
            emit-value
            use-input
            fill-input
            hide-selected
            clearable
            @filter="filterFn2"
            :rules="[
              (val) =>
                (val !== null && val !== '' && !survey?.id) ||
                'กรุณาเลือกผู้ดำเนินการอนุมัติ',
            ]"
            hide-bottom-space
          >
            <template #label>
              ผู้ดำเนินการอนุมัติ<span class="color_negative">*</span>
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
              </q-item>
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
