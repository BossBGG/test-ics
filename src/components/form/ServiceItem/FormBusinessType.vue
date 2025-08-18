<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();
const serviceItemStore = useServiceItemStore();
const { businessTypes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchBusinessType();
});
</script>

<template>
  <div :class="props.customClass">
    <!-- {{ model }} -->
    <q-select v-model="model" class="border_dashed input_filled_custom" label filled stack-label bg-color="white"
      color="primary" label-color="grey-14" hide-bottom-space :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกประเภทธุรกิจ',
      ]" option-value="code" emit-value :options="businessTypes" :option-label="(option) => `${option.text}`"
      map-options :readonly="props.readonly">
      <template #label>
        ประเภทธุรกิจ<span class="color_negative">*</span>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
