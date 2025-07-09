<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const masterDataStore = useMasterDataStore();
const { nationalities } = storeToRefs(masterDataStore);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartnerForm } = storeToRefs(businessPartnerStore);

onMounted(async () => {
  await masterDataStore.fetchNationality();
});

const filterValue = ref("");

const filteredMaterials = computed(() => {
  const needle = filterValue.value.toLowerCase();

  let filteredOptions = nationalities.value;

  if (businessPartnerForm.value.legal_type !== 1) {
    filteredOptions = filteredOptions.filter((data) => data.nameShort !== "TH");
  }

  if (needle) {
    filteredOptions = filteredOptions.filter((option) => {
      const code = option.nameFull ? option.nameFull.toLowerCase() : "";
      return code.includes(needle);
    });
  }

  return filteredOptions;
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <div :class="props.customClass">
    <!-- {{ filteredMaterials }} -->
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom select-nationality"
      label
      filled
      bg-color="white"
      color="primary"
      label-color="grey-14"
      hide-bottom-space
      option-value="nameShort"
      emit-value
      lazy-rules
      :options="filteredMaterials"
      input-debounce="0"
      hide-selected
      fill-input
      @filter="filterFn"
      use-input
      clearable
      :option-label="(option) => `${option?.nameFull ?? ''}`"
      map-options
      :readonly="props.readonly || businessPartnerForm.legal_type == 1"
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกสัญชาติ']"
    >
      <template #label>สัญชาติ<span class="color_negative">*</span></template>
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
