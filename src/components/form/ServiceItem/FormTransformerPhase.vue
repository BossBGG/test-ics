<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const requestStore = useRequestStore();
const { request } = storeToRefs(requestStore);

const serviceItemStore = useServiceItemStore();
const { transformerPhases } = storeToRefs(serviceItemStore);

const id = computed(() => model.value);

onMounted(async () => {
  await serviceItemStore.fetchTransformerPhase();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return transformerPhases.value;
  }
  const needle = filterValue.value.toLowerCase();
  return transformerPhases.value.filter((option) => {
    const code = option.option_title ? option.option_title.toLowerCase() : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <div :class="props.customClass">
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom"
      label
      filled
      bg-color="white"
      color="primary"
      label-color="grey-14"
      hide-bottom-space
      hide-selected
      emit-value
      use-input
      fill-input
      lazy-rules
      map-options
      input-debounce="0"
      clearable
      @update:model-value="change"
      @filter="filterFn"
      :options="filteredMaterials"
      :option-value="(option) => `${option.id}`"
      :option-label="(option) => `${option.option_title}`"
      :readonly="props.readonly"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกเฟส']"
    >
      <template #label>เฟส<span class="color_negative">*</span> </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
