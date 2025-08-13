<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอซ่อมแซมอุปกรณ์ไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <FormServiceItems
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.equipment_type"
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
      >
        <template #label>จำนวน</template>
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
