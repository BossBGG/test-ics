<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <FormRequestService
    v-model="requestServiceForm.request_service"
    custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly"
  />
  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model="requestServiceForm.ca_no"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label
      class="input_filled input_filled_custom"
      hide-bottom-space
      :readonly="readonly"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
    >
      <template #label>
        หมายเลขผู้ใช้ไฟฟ้า (CA/Ref No.1) สำหรับผู้ใช้ไฟฟ้า กฟภ.
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
