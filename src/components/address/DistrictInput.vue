<script setup lang="ts">
const props = defineProps([
  "disable",
  "dataOptions",
  "readonly",
  "hideDropdownIcon",
]);

const model = defineModel();

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return props.dataOptions;
  }
  const needle = filterValue.value.toLowerCase();

  return props.dataOptions.filter((option) => {
    const code = option.name ? option.name.toLowerCase() : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <q-select
    v-model="model"
    class="border_dashed input_filled_custom select-district"
    label="อำเภอ / เขต"
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
    :option-value="(option) => `${option.id ?? ''}`"
    :option-label="(option) => `${option.name ?? ''}`"
    :disable="props.disable"
    :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกอำเภอ / เขต']"
    :readonly="props.readonly"
    :hide-dropdown-icon="props.hideDropdownIcon"
  >
    <template #label>อำเภอ / เขต<span class="color_negative">*</span></template>
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
