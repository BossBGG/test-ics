<script setup>
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormEquipment
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.equipment_id"
      custom-class="q-pa-sm col-12 col-md-12"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        v-model.number="requestServiceForm.amps_size"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label="ขนาดที่ต้องการ"
        class="input_filled input_filled_custom"
        hide-bottom-space
        :readonly="readonly"
        :rules="[
          (val) =>
            (val !== null && val !== undefined && val !== '') ||
            'กรุณากรอกขนาดที่ต้องการ',
        ]"
        @keypress="allowNumberDecimal"
        @paste="allowNumberDecimal"
      >
        <template #label>
          ขนาดที่ต้องการ<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>
    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        v-model.number="requestServiceForm.qty"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label="จำนวน"
        class="input_filled input_filled_custom"
        hide-bottom-space
        :readonly="readonly"
        :rules="[
          (val) =>
            (val !== null && val !== undefined && val !== '') ||
            'กรุณากรอกจำนวน',
        ]"
        @keypress="quantityNumbers"
        @paste="quantityNumbers"
      >
        <template #label> จำนวน<span class="color_negative">*</span> </template>
      </q-input>
    </div>
    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
