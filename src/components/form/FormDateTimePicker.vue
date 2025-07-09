<script setup lang="ts">
const props = defineProps(["customClass", "labelText", "readonly"]);
const model = defineModel();

const popupDateRef = ref(null);
const popupTimeRef = ref(null);

function closePopupDate() {
  if (popupDateRef.value) popupDateRef.value.hide();
}

function closePopupTime() {
  if (popupTimeRef.value) popupTimeRef.value.hide();
}

function validateDateTime(val) {
  const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
  if (!val) {
    return `กรุณาเลือก${props.labelText}`;
  } else if (!regex.test(val)) {
    return `รูปแบบวันที่และเวลาควรเป็น DD/MM/YYYY HH:mm`;
  }
  return true;
}

function restrictInput(event) {
  const regex = /[0-9\/: ]/;
  if (!regex.test(event.key)) {
    event.preventDefault();
  }
}

function handlePaste(event) {
  const regex = /[0-9\/: ]/;
  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  if (!pastedText.split("").every((char) => regex.test(char))) {
    event.preventDefault();
  }
}
</script>

<template>
  <div :class="props.customClass">
    <q-input
      maxlength="16"
      v-model="model"
      type="text"
      :readonly="props.readonly"
      label
      label-color="grey-14"
      bg-color="white"
      class="input_filled input_filled_custom"
      filled
      hide-bottom-space
      :rules="[validateDateTime]"
      @keypress="restrictInput"
      @paste="blockCopy"
    >
      <template #label>
        {{ props.labelText }}<span class="color_negative">*</span>
      </template>
      <template #append>
        <q-icon
          name="access_time"
          class="cursor-pointer"
          color="secondary"
          style="margin-right: 10px"
        >
          <q-popup-proxy
            ref="popupTimeRef"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-time
              :disable="props.readonly"
              v-model="model"
              mask="DD/MM/YYYY HH:mm"
              format24h
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                  @click="closePopupTime"
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
        <q-icon name="calendar_today" color="secondary" class="cursor-pointer">
          <q-popup-proxy
            ref="popupDateRef"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              :disable="props.readonly"
              v-model="model"
              mask="DD/MM/YYYY HH:mm"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                  @click="closePopupDate"
                />
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
