<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const serviceItemStore = useServiceItemStore();
const { equipmentTypes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchEquipmentType();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return equipmentTypes.value;
  }
  const needle = filterValue.value.toLowerCase();
  return equipmentTypes.value.filter((option) => {
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
  <!-- {{ model }} -->
  <div :class="props.customClass">
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom select-equipment-type"
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
      :readonly="props.readonly"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกประเภทอุปกรณ์ไฟฟ้า',
      ]"
    >
      <template #label>
        ประเภทอุปกรณ์ไฟฟ้า<span class="color_negative">*</span>
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
