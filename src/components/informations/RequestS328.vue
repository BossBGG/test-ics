<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormRequestService
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.request_service"
      custom-class="q-pa-sm col-12 col-md-6"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model="requestServiceForm.ca_no"
        bg-color="white"
        color="primary"
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        maxlength="12"
      >
        <template #label>
          หมายเลขผู้ใช้ไฟฟ้า (CA/Ref No.1) สำหรับผู้ใช้ไฟฟ้า กฟภ.
        </template>
      </q-input>
    </div>

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
