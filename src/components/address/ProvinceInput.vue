<script setup lang="ts">
const props = defineProps(["disable", "readonly", "hideDropdownIcon"]);
const emit = defineEmits(["selected"]);
const model = defineModel("model");
const newOptions = defineModel("options");

const addressStore = useAddressStore();
const { provinces } = storeToRefs(addressStore);

function selectedProvince(val) {
  emit("selected", val);
}

const options = computed(() => {
  return newOptions.value || provinces.value || [];
});
const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return options.value;
  }
  const needle = filterValue.value.toLowerCase();
  return options.value.filter((option) => {
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
    class="border_dashed input_filled_custom select-province"
    filled
    bg-color="white"
    color="primary"
    label-color="grey-14"
    hide-bottom-space
    emit-value
    map-options
    lazy-rules
    use-input
    input-debounce="0"
    hide-selected
    fill-input
    label="จังหวัด"
    clearable
    @filter="filterFn"
    :options="filteredMaterials"
    :option-value="(option) => option?.id ?? ''"
    :option-label="(option) => option?.name ?? ''"
    :disable="props.disable"
    :readonly="props.readonly"
    :hide-dropdown-icon="props.hideDropdownIcon"
    :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกจังหวัด']"
  >
    <template #label>จังหวัด<span class="color_negative">*</span></template>
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
