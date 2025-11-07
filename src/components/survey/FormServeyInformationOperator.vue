<script setup lang="ts">
const surveyStore = useSurveyStore();
const { survey_men, surveyLogForm, isDisabled } = storeToRefs(surveyStore);

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
            ผู้ดำเนินการสำรวจ
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="row q-pa-sm" id="surveyForm">
              <div class="col-12 col-md-6 q-pa-sm">
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
                  class="input_filled input_filled_custom surveyman-select"
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

              <!-- <div class="col-12 col-md-6 q-pa-sm">
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
                      (val !== null && val !== '' && !survey?.id) ||
                      'กรุณาเลือกวันที่นัดสำรวจ',
                  ]"
                  :readonly="isDisabled"
                >
                  <template #label>
                    วันที่นัดสำรวจ<span class="color_negative">*</span>
                  </template>
                  <template #append v-if="!isDisabled">
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

              <FormDatePicker
                v-model="surveyLogForm.appointment_datetime"
                custom-class="col-12 col-md-6 q-pa-sm"
                label-text="วันที่นัดสำรวจ"
                type="surveyDate"
                :readonly="isDisabled"
                :rules="[
                  (val) =>
                    (val !== null && val !== '' && !survey?.id) ||
                    'กรุณาเลือกวันที่นัดสำรวจ',
                ]"
              />
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
