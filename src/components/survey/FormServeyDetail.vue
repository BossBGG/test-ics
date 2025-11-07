<script setup lang="ts">
const surveyStore = useSurveyStore();
const { survey_men, surveyLogForm } = storeToRefs(surveyStore);
const props = defineProps<{
  disable?: boolean
}>()

const requestStore = useRequestStore();
const { request, nowRequestCode } = storeToRefs(requestStore);

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return survey_men.value;
  }
  const needle = filterValue.value.toLowerCase();
  return survey_men.value.filter((option) => {
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

const popupRef = ref(null);
function closePopup() {
  if (popupRef.value) popupRef.value.hide();
}
</script>

<template>
  <div class="box_details_request" v-if="request.requests?.status == `I` || nowRequestCode === SERVICE.S16">
    <div class="title q-py-sm q-px-md">
      <h4>รายละเอียดผลสำรวจ</h4>
    </div>
    <div class="bg_field_gray">
      <div class="row q-pa-sm">
        <div class="col-12 text-sub-head q-px-sm q-pt-md text-weight-600">
          สถานะการสำรวจ
        </div>
        <div class="q-pa-sm col-12 q-gutter-lg">
          <q-radio
            v-model="surveyLogForm.complete"
            class="input_radio_costom"
            color="secondary"
            :val="true"
            label="ผ่าน"
            checked
            :disable="disable"
          />
          <q-radio
            v-model="surveyLogForm.complete"
            class="input_radio_costom"
            color="secondary"
            :val="false"
            label="ไม่ผ่าน"
            :disable="disable"
          />
        </div>

        <div class="q-pa-sm col-12 col-md-12">
          <q-input
            v-model="surveyLogForm.detail"
            class="full-width input_filled_custom"
            label-color="grey-14"
            label="ผลสำรวจ"
            :dense="dense"
            filled
            type="text"
            bg-color="white"
            color="grey-14"
            lazy-rules
            :rules="[
              (val) =>
                (!surveyLogForm.complete ? val && val.length > 0 : true) ||
                'กรุณากรอกผลสำรวจ',
            ]"
            :readonly="disable"
          />
        </div>

        <div v-if="!surveyLogForm.complete" class="row width-100">
          <div
            class="col-12 text-sub-head q-px-sm q-pt-md q-pb-md text-weight-600"
          >
            นัดสำรวจอีกครั้ง
          </div>
          <div class="q-pa-sm col-12 col-md-6">
            <q-select
              v-model="surveyLogForm.survey_by"
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
              class="input_filled input_filled_custom"
              :readonly="isDisabled"
              input-debounce="0"
              filled
              emit-value
              use-input
              fill-input
              hide-selected
              @filter="filterFn"
              :rules="[
                (val) =>
                  (val !== null && val !== '' && !survey?.id) ||
                  'กรุณาเลือกผู้ดำเนินการสำรวจ',
              ]"
              hide-bottom-space
            >
              <template #label>
                ผู้ดำเนินการสำรวจ<span class="color_negative">*</span>
              </template>
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    ไม่พบข้อมูล
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <FormDatePicker
            v-model="surveyLogForm.appointment_datetime"
            custom-class="q-pa-sm col-12 col-md-6"
            label-text="วันที่นัดสำรวจ"
            type="contactDate"
            :readonly="isDisabled"
            :rules="[
              (val) =>
                (val !== null && val !== '') || 'กรุณาเลือกวันที่นัดสำรวจ',
            ]"
          />

          <!-- <FormDateTimePicker
            v-model="surveyLogForm.appointment_datetime"
            custom-class="q-pa-sm col-12 col-md-6"
            label-text="วันที่และเวลาที่ทำการติดต่อ"
          /> -->

          <!-- <div class="q-pa-sm col-12 col-md-6">
            <q-input
              v-model="surveyLogForm.appointment_datetime"
              class="input_filled input_filled_custom"
              label-color="grey-14"
              bg-color="white"
              type="text"
              filled
              label
              mask="date"
              hide-bottom-space
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  'กรุณาเลือกวันที่และเวลาที่ทำการติดต่อ',
              ]"
            >
              <template #label>
                วันที่และเวลาที่ทำการติดต่อ<span class="color_negative">*</span>
              </template>
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
                    <q-date v-model="surveyLogForm.appointment_datetime">
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
      font-size: 20px;
      font-weight: 500;
    }
  }
}
</style>
