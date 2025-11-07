<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <FormServiceItems v-model="requestServiceForm.equipment_type" custom-class="q-pa-sm col-12 col-md-6"
    :readonly="readonly" />

  <div class="q-pa-sm col-12 col-md-6">
    <q-input v-model.number="requestServiceForm.qty" bg-color="white" color="primary" label-color="grey-14" filled label
      class="input_filled input_filled_custom input-qty" hide-bottom-space @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers" :readonly="readonly">
      <template #label> จำนวน </template>
    </q-input>
  </div>

  <FilePreview :links="splitTextWith(requestServiceForm.files, ',')" custom-class="col-12 row q-pa-sm" />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
