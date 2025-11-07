<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const serviceItemStore = useServiceItemStore();
const { placeForms } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchPlaceForm();
});
</script>

<template>
  <div :class="props.customClass">
    <!-- {{ model }} -->
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom"
      label
      :stack-label="model ?? false"
      filled
      bg-color="white"
      color="primary"
      label-color="grey-14"
      hide-bottom-space
      :rules="[
        (val) =>
          (val !== null && val !== '') || 'กรุณาเลือกรูปแบบสถานที่ใช้ไฟฟ้า',
      ]"
      option-value="id"
      emit-value
      :options="placeForms"
      :option-label="(option) => `${option.option_title}`"
      map-options
      :readonly="props.readonly"
    >
      <template #label>
        รูปแบบสถานที่ใช้ไฟฟ้า<span class="color_negative">*</span>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
