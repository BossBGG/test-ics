<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);

// const dateTime = ref(dateFormatThaiMonth())
requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate
  )
);
</script>

<template>
  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.qty"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="จำนวนฉนวนครอบสาย"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[(val) => val > 0 || 'กรุณากรอกจำนวนฉนวนครอบสาย']"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
      :readonly="readonly"
    >
      <template #label>
        จำนวนฉนวนครอบสาย<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>

  <FormDatePicker
    v-model="requestServiceForm.rental_startdate"
    custom-class="q-pa-sm col-12 col-md-2"
    label-text="วันที่เริ่มต้น"
    :readonly="readonly"
  />

  <FormDatePicker
    v-model="requestServiceForm.rental_enddate"
    custom-class="q-pa-sm col-12 col-md-2"
    label-text="วันที่สิ้นสุด"
    :readonly="readonly"
  />

  <div class="q-pa-sm col-12 col-md-2">
    <q-input
      v-model.number="requestServiceForm.days"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label="จำนวนวัน"
      class="input_filled input_filled_custom"
      hide-bottom-space
      @keypress="allowOnlyNumbers"
      readonly
    >
      <template #label>
        จำนวนวัน <span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
