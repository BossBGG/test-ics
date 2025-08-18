<script setup lang="ts">
const props = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm  } = storeToRefs(requestStore);

</script>

<template>

  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12 q-mb-sm">
    บริการโซลาร์
  </div>

    <div class="row">

      <FormSolarType
        v-model="requestServiceForm .solar_type"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />
      <FormSolarBrand
        :data-solar="requestServiceForm .solar_type"
        v-model="requestServiceForm .brand_id"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />

    </div>


</template>

<style lang="scss" scoped>
@import "@style";

.box_header {
  @include justify-content(space-between);
}
.q-bar--standard {
  height: 46px;
}
</style>
