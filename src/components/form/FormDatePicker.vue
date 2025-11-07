<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm, propsDateOG } = storeToRefs(requestStore);

const props = defineProps({
  readonly: Boolean,
  customClass: String,
  labelText: String,
  type: String,
  modelValue: String,
  dateStart: Boolean,
  dateEnd: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const formattedDate = computed({
  get: () =>
    props.modelValue
      ? new Date(props.modelValue).toLocaleDateString("en-GB")
      : "",
  set: (val) => {
    if (val) {
      const [day, month, year] = val.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      emit("update:modelValue", date.toISOString());
    }
  },
});

const popupRef = ref(null);

function closePopup() {
  if (popupRef.value) popupRef.value.hide();
}

function checkEndDateStart(val) {
  if (!val)
    return

  if (props.dateStart) {
    propsDateOG.value = useDateFormat(val, "YYYY/MM/DD").value;

    if (val > requestServiceForm.value.rental_enddate) {
      requestServiceForm.value.rental_enddate = val;
    }
  }

  if (props.dateEnd) {
    if (requestServiceForm.value.rental_startdate > val) {
      requestServiceForm.value.rental_startdate = null;
    }
  }
}
onMounted(() => {
  if (!props.modelValue) {
    emit("update:modelValue", new Date().toISOString());
  }

  if (props.dateStart != false) {
    propsDateOG.value = useDateFormat(props.modelValue, "YYYY/MM/DD").value;
    // propsDateOG.value;
    // console.log("propsDateOG.value: ", propsDateOG.value);
  }

  // if (props.dateEnd != false) {
  //   console.log(props.dateEnd != false);

  //   if (requestServiceForm.value.rental_enddate) {
  //     requestServiceForm.value.rental_enddate = useDateFormat(
  //       props.modelValue,
  //       "YYYY/MM/DD",
  //     );

  //     console.log("rental_enddate: ", requestServiceForm.value.rental_enddate);
  //   }
  // }
  const val = props.modelValue;
  // checkEndDateStart(val)
});

const dateOG = ref(
  useDateFormat(requestServiceForm.value.rental_startdate, "YYYY/MM/DD"),
);

watch(
  () => props.modelValue,
  (val) => {
    checkEndDateStart(val);
  },
);

const formatted = useDateFormat(useNow(), "YYYY/MM/DD");

function optionsFn(date) {
  if (props.type == "birthDate") {
    return date <= formatted.value;
  } else if (
    props.type == "surveyDate" ||
    props.type == "contactDate" ||
    props.type == "minDate"
  ) {
    return date >= formatted.value;
  } else if (props.type == "start") {
    return date >= dateOG.value;
  } else if (props.type == "endDate") {
    return date >= propsDateOG.value;
  } else {
    return true;
  }
}
</script>

<template>
  <div :class="props.customClass">
    <q-input
      v-model="formattedDate"
      maxlength="10"
      class="input_filled input_filled_custom"
      label-color="grey-14"
      bg-color="white"
      type="text"
      filled
      label
      hide-bottom-space
      @paste="blockCopy"
      @keypress="allowOnlyNumbers"
      :rules="[
        (val) => (val !== null && val !== '') || `กรุณาเลือก${props.labelText}`,
      ]"
      :readonly="props.readonly"
    >
      <template #label>
        {{ props.labelText }}<span class="color_negative">*</span>
      </template>
      <template #append v-if="!props.readonly">
        <q-icon name="calendar_today" color="secondary" class="cursor-pointer">
          <q-popup-proxy
            ref="popupRef"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="formattedDate"
              mask="DD/MM/YYYY"
              :readonly="props.readonly"
              :options="optionsFn"
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
</template>

<style lang="scss" scoped>
@import "@style";
</style>
