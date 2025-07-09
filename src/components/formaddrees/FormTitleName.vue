<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const masterDataStore = useMasterDataStore();
const { nameTitles } = storeToRefs(masterDataStore);

onMounted(async () => {
  await masterDataStore.fetchNameTitle();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return nameTitles.value;
  }
  const needle = filterValue.value.toLowerCase();
  return nameTitles.value.filter((option) => {
    const code = option.title_name ? option.title_name.toLowerCase() : "";

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
      class="input_filled input_filled_custom select-title-name"
      label="คำนำหน้าชื่อ"
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
      :option-value="(option) => `${option.title_name}`"
      :option-label="(option) => `${option.title_name}`"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกคำนำหน้าชื่อ',
      ]"
      :readonly="props.readonly"
    >
      <template #label>
        คำนำหน้าชื่อ<span class="color_negative">*</span>
      </template>
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
