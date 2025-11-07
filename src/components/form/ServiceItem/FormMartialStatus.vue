<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const masterDataStore = useMasterDataStore();
const { maritalStatus } = storeToRefs(masterDataStore);

onMounted(async () => {
  await masterDataStore.fetchMaritalStatus();

  // console.log("maritalStatus.value: ", maritalStatus.value);
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return maritalStatus.value;
  }
  const needle = filterValue.value.toLowerCase();
  return maritalStatus.value.filter((option) => {
    const code = option.marital_status_name
      ? option.marital_status_name.toLowerCase()
      : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <!-- {{ model }} -->
  <div :class="props.customClass">
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom select-martial-status"
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
      :option-value="(option) => option?.id"
      :option-label="(option) => `${option.marital_status_name}`"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกสถานภาพ']"
      :readonly="props.readonly"
    >
      <template #label> สถานภาพ<span class="color_negative">*</span> </template>
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
