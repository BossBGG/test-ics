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
  <!-- <pre>
    {{ requestServiceForm }}
  </pre> -->
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอเช่าฉนวนครอบสายไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.qty"
        bg-color="white"
        color="primary"
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        :rules="[(val) => val > 0 || 'กรุณาเลือกจำนวนฉนวนครอบสาย']"
      >
        <template #label>
          จำนวนฉนวนครอบสาย<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_startdate"
      custom-class="q-pa-sm col-12 col-md-2"
      label-text="วันที่เริ่มต้น"
      :date-start="true"
    />

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_enddate"
      custom-class="q-pa-sm col-12 col-md-2"
      label-text="วันที่สิ้นสุด"
      type="endDate"
      :date-end="true"
    />

    <div class="q-pa-sm col-12 col-md-2">
      <q-input
        readonly
        v-model.number="requestServiceForm.days"
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
