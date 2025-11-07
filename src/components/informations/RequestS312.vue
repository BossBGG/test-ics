<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอทดสอบอุปกรณ์ไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormMBusinessType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.business_type_id"
      custom-class="q-pa-sm col-12 "
    />

    <FormEquipmentType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.equipment_type_id"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.qty"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        :rules="[(val) => val > 0 || 'กรุณาเลือกจำนวน']"
      >
        <template #label>จำนวน<span class="color_negative">*</span></template>
      </q-input>
    </div>

    <FilePreview
      :links="splitTextWith(requestServiceForm.files, ',')"
      custom-class="col-12 row q-pa-sm"
    />

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
