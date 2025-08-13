<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const serviceItemStore = useServiceItemStore();
const { requestTimes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchRequestTime();
});
</script>

<template>
  <div :class="props.customClass">
    <!-- {{ model }} -->
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom"
      label
      filled
      :stack-label="model ?? false"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      hide-bottom-space
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกช่วงเวลา']"
      option-value="id"
      emit-value
      :options="requestTimes"
      :option-label="(option) => `${option.option_title}`"
      map-options
      :readonly="props.readonly"
    >
      <template #label>
        เลือกช่วงเวลา (เฉพาะวันทำการ)<span class="color_negative">*</span>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
