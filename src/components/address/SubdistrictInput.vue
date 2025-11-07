<script setup lang="ts">
const props = defineProps([
  "disable",
  "dataOptions",
  "readonly",
  "hideDropdownIcon",
]);
const emit = defineEmits(["selected"]);
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
    class="border_dashed input_filled_custom select-sub-district"
    filled
    bg-color="white"
    color="primary"
    label-color="grey-14"
    label="ตำบล / แขวง"
    hide-bottom-space
    emit-value
    map-options
    lazy-rules
    use-input
    input-debounce="0"
    hide-selected
    fill-input
    clearable
    @filter="filterFn"
    :options="filteredMaterials"
    :option-value="(option) => `${option.id ?? ''}`"
    :option-label="(option) => `${option.name ?? ''}`"
    @update:model-value="selectedLocal"
    :disable="props.disable"
    :readonly="props.readonly"
    :hide-dropdown-icon="props.hideDropdownIcon"
    :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกตำบล / แขวง']"
  >
    <template #label>ตำบล / แขวง<span class="color_negative">*</span></template>
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
