<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const masterDataStore = useMasterDataStore();
const { legalForms } = storeToRefs(masterDataStore);

onMounted(async () => {
  await masterDataStore.fetchLegalForm();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return legalForms.value;
  }
  const needle = filterValue.value.toLowerCase();
  return legalForms.value.filter((option) => {
    const code = option.description ? option.description.toLowerCase() : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <!-- <pre>
  {{ legalForms }}
  </pre> -->
  <div :class="props.customClass">
    <q-select
      v-model="model"
      filled
      :options="filteredMaterials"
      input-debounce="0"
      hide-selected
      fill-input
      @filter="filterFn"
      lazy-rules
      use-input
      clearable
      label
      class="input_filled select-legal-forms"
      hide-bottom-space
      map-options
      emit-value
      option-value="id"
      :disable="legalForms.length < 1"
      :option-label="(option) => `${option?.description ?? ''}`"
      :rules="[
        (val) => (val !== null && val !== '') || 'กรุณาเลือกรูปแบบตามกฏหมาย',
      ]"
      :readonly="props.readonly"
    >
      <template #label
        >รูปแบบตามกฏหมาย<span class="color_negative">*</span>
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
