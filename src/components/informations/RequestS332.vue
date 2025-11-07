<script setup>
import FormSolarType from "../form/ServiceItem/FormSolarType.vue";

const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอบริการหน่วยธุรกิจ PEA Easy D"
      :canEdit="CAN_EDIT.REQUEST.value"
    />
    
    <FormSolarType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.solar_type"
      custom-class="q-pa-sm col-12 col-md-12"
    />
    <FormSolarBrand
        :data-solar="requestServiceForm .solar_type"
        v-model="requestServiceForm.brand_id"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="!CAN_EDIT.REQUEST.value"
    />
    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
