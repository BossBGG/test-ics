<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const masterDataStore = useMasterDataStore();
const { genders } = storeToRefs(masterDataStore);

onMounted(async () => {
  await masterDataStore.fetchGender();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return genders.value;
  }
  const needle = filterValue.value.toLowerCase();
  return genders.value.filter((option) => {
    const code = option.gender_name ? option.gender_name.toLowerCase() : "";

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
      class="input_filled select-gender"
      label="เพศ"
      bg-color="white"
      filled
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
      :option-value="(option) => option?.id"
      :option-label="(option) => `${option.gender_name}`"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกเพศ']"
      :readonly="props.readonly"
    >
      <template #label> เพศ<span class="color_negative">*</span> </template>
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
