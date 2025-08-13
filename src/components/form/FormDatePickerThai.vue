<script setup lang="ts">
const props = defineProps(["customClass", "labelText"]);
const model = defineModel();

// const formattedDate = computed({
//   get: () => model.value ? new Date(model.value).toLocaleDateString('en-GB') : '',
//   set: (val) => {
//     const [day, month, year] = val.split('/')
//     const date = new Date(`${year}-${month}-${day}`)
//     model.value = date.toISOString()
//   },
// })
const now = useNow();
const formattedDate = ref(dateFormatMonth(model.value));

const popupRef = ref(null);

const myLocale = {
  /* starting with Sunday */
  days: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
  daysShort: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
  months:
    "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split(
      "_"
    ),
  monthsShort:
    "ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split("_"),
  firstDayOfWeek: 0, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: "วัน",
};

function closePopup() {
  if (popupRef.value) popupRef.value.hide();
}

function update(value, reason, details) {
  const newDate = new Date(details.year, details.month - 1, details.day);
  const formattedDate = dateFormat(newDate, "YYYY/MM/DD HH:mm:ss");

  model.value = formattedDate;
}

onMounted(() => {
  // if (!model.value)
  // formattedDate.value = dateFormatMonth(now.value)
});
</script>

<template>
  <!-- {{ formattedDate }} -->
  <!-- {{ formattedDate }} -->
  <div :class="props.customClass">
    <q-input
      v-model="formattedDate"
      class="input_filled input_filled_custom"
      label-color="grey-14"
      bg-color="white"
      type="text"
      filled
      label
      hide-bottom-space
      :rules="[
        (val) => (val !== null && val !== '') || `กรุณาเลือก${props.labelText}`,
      ]"
    >
      <template #label>
        {{ props.labelText }} <span class="color_negative">*</span>
      </template>
      <template #append>
        <q-icon name="calendar_today" color="secondary" class="cursor-pointer">
          <q-popup-proxy
            ref="popupRef"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="formattedDate"
              mask="DD MMMM YYYY"
              :locale="myLocale"
              @update:model-value="update"
            >
              <div class="row items-center justify-end">
                <q-btn label="Close" color="primary" flat @click="closePopup" />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>

  <!-- <div v-if="model" :class="props.customClass">
    <q-input
      v-model="formattedDate" class="input_filled input_filled_custom" label-color="grey-14" bg-color="white"
      type="text" filled label hide-bottom-space :rules="[
        (val) => (val !== null && val !== '') || `กรุณาเลือก${props.labelText}`,
      ]"
    >
      <template #label>
        {{ props.labelText }} <span class="color_negative">*</span>
      </template>

      <template #append>
        <q-icon name="calendar_today" color="secondary" class="cursor-pointer">
          <q-popup-proxy ref="popupRef" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="formattedDate" :locale="myLocale" mask="DD MMMM YYYY">
              <div class="row items-center justify-end">
                <q-btn label="Close" color="primary" flat @click="closePopup" />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div> -->
</template>

<style lang="scss" scoped>
@import "@style";
</style>
