<!-- YourComponent.vue -->
<script setup lang="ts">
const props = defineProps({
  customClass: String,
  isShowLabel: { type: Boolean, default: true },
  readonly: Boolean,
});

const model = defineModel();
const serviceItemStore = useServiceItemStore();
const { mBusinessTypes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchMBusinessType();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return mBusinessTypes.value;
  }
  const needle = filterValue.value.toLowerCase();
  return mBusinessTypes.value.filter((option) => {
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
  <div v-if="props.isShowLabel" :class="props.customClass">
    <q-select v-model="model" class="border_dashed input_filled_custom select-m-business-type" label="ประเภทธุรกิจ"
      filled bg-color="white" color="primary" label-color="grey-14" hide-bottom-space hide-selected emit-value use-input
      fill-input lazy-rules input-debounce="0" map-options clearable @filter="filterFn" :options="filteredMaterials"
      :option-value="(option) => `${option.id}`" :option-label="(option) => `${option.name}`" :readonly="props.readonly"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกประเภทธุรกิจ',
      ]">
      <template v-if="props.isShowLabel" #label>
        ประเภทธุรกิจ<span class="color_negative">*</span>
      </template>
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <div v-else :class="props.customClass">
    <q-select v-model="model" class="border_dashed input_filled_custom select-m-business-type" label="ประเภทธุรกิจ"
      filled bg-color="white" color="primary" label-color="grey-14" hide-bottom-space hide-selected emit-value use-input
      fill-input lazy-rules input-debounce="0" map-options clearable @filter="filterFn" :options="filteredMaterials"
      :option-value="(option) => `${option.id}`" :option-label="(option) => `${option.name}`" :readonly="props.readonly"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกประเภทธุรกิจ',
      ]">
      <template v-if="props.isShowLabel" #label>
        ประเภทธุรกิจ<span class="color_negative">*</span>
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
