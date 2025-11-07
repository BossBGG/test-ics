<script setup lang="ts">
const { customClass, dataPhase, readonly } = defineProps([
  "customClass",
  "dataPhase",
  "readonly",
]);
const model = defineModel();

const serviceItemStore = useServiceItemStore();
const transformerTypes = ref([]);

watch(
  () => dataPhase,
  async (newValue, oldValue) => {
    // console.log('dataPhase: ', dataPhase);

    if (dataPhase != null) {
      transformerTypes.value =
        (await serviceItemStore.fetchTransformerPhaseLevel2(newValue)) ?? [];
      if (model.value) {
        const selected = transformerTypes.value.find(
          (item) => item.id == model.value,
        );
        if (!selected?.id) {
          model.value = null;
        }
      }
    }
  },
  { immediate: true },
);

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return transformerTypes.value;
  }
  const needle = filterValue.value.toLowerCase();
  return transformerTypes.value.filter((option) => {
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
  <div :class="customClass">
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
      @filter="filterFn"
      :options="filteredMaterials"
      :option-value="(option) => `${option.id}`"
      :option-label="(option) => `${option.option_title}`"
      :readonly="readonly"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกประเภท']"
    >
      <template #label>ประเภท<span class="color_negative">*</span></template>
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
