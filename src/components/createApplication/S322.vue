<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
const serviceItemStore = useServiceItemStore();
const { packages } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchPackage();
});
</script>

<template>
  <FormMBusinessType
    v-model="requestServiceForm.business_type_id"
    custom-class="q-pa-sm col-12"
    :is-show-label="false"
    :readonly="readonly"
  />

  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    เลือก Package<span class="color_negative text-weight-400">*</span>
  </div>
  <q-field
    :model-value="requestServiceForm.size_install"
    lazy-rules
    :rules="[
      (val) => !!val || 'กรุณาเลือก Package',
      (val) => packages.some((item) => item.id == val) || 'กรุณาเลือก Package',
    ]"
    hide-bottom-space
    borderless
    class="q-pl-sm field_radio_custom"
  >
    <div class="col-12" v-if="packages.length">
      <div
        class="col-12 col-md-12"
        v-for="(option, index) in packages"
        :key="index"
      >
        <q-radio
          :disable="readonly"
          v-model="requestServiceForm.size_install"
          label-color="grey-14"
          bg-color="white"
          right-label
          color="secondary"
          size="42px"
          :val="option.id"
          :label="option.option_title"
          :checked="option.id == requestServiceForm.size_install"
          class="custom_checkbox input_radio_costom_checkbox"
        />
      </div>
    </div>
  </q-field>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
