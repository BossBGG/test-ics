<script setup lang="ts">
const props = defineProps(["customClass", "disable"]);
const model = defineModel();

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartnerForm } = storeToRefs(businessPartnerStore);

const serviceItemStore = useServiceItemStore();
const { businessTypeFilters, businessTypes } = storeToRefs(serviceItemStore);

watch(model, (newValue) => {
  if (newValue) {
    const filters = businessTypes?.value?.filter(
      (item) => item.type == newValue,
    );
    serviceItemStore.setBusinessTypeFilters(filters);
  } else {
    serviceItemStore.setBusinessTypeFilters(businessTypes.value);
  }
});
</script>

<template>
  <div :class="props.customClass">
    <q-radio
      v-model="model"
      color="secondary"
      val="TSIC"
      label="TSIC"
      :disable="props.disable"
    />
    <q-radio
      v-model="model"
      color="secondary"
      val="TGSC"
      label="TGSC"
      :disable="props.disable"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
