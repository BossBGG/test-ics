<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate
  )
);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอเช่าหม้อแปลง"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormMBusinessType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.business_type_id"
      custom-class="q-pa-sm col-12 col-md-12"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.transformer_qty"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        :rules="[(val) => val > 0 || 'กรุณากรอกจำนวนหม้อแปลง']"
      >
        <template #label>
          ขนาดหม้อแปลง<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.transformer_size"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        :rules="[(val) => val > 0 || 'กรุณากรอกขนาดหม้อแปลง']"
      >
        <template #label>
          จำนวนหม้อแปลง<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_startdate"
      custom-class="q-pa-sm col-12 col-md-4"
      label-text="วันที่เริ่มต้น"
      :date-start="true"
    />

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_enddate"
      custom-class="q-pa-sm col-12 col-md-4"
      label-text="วันที่สิ้นสุด"
      type="endDate"
      :date-end="true"
    />

    <div class="q-pa-sm col-12 col-md-4">
      <q-input
        readonly
        v-model="requestServiceForm.days"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
      >
        <template #label> จำนวนวัน </template>
      </q-input>
    </div>

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
