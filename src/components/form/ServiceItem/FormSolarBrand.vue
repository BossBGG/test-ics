<script setup lang="ts">
  const { customClass, dataSolar, readonly } = defineProps([
    "customClass",
    "dataSolar",
    "readonly",
  ]);
  const model = defineModel();
  
  const serviceItemStore = useServiceItemStore();
  const solarBrand = ref([]);
  
  watch(
    () => dataSolar,
    async (newValue, oldValue) => {
      if (dataSolar != null) {
        solarBrand.value =
          (await serviceItemStore.fetchSolarBrandLevel2(newValue)) ?? [];
        if (model.value) {
          const selected = solarBrand.value.find(
            (item) => item.id == model.value,
          );
          if (!selected?.id) {
            model.value = null;
          }
        }
      }
    },
    { immediate: true },
  );
  
  const filterValue = ref("");
  const filteredMaterials = computed(() => {
    if (!filterValue.value) {
      return solarBrand.value;
    }
    const needle = filterValue.value.toLowerCase();
    return solarBrand.value.filter((option) => {
      const code = option.option_title ? option.option_title.toLowerCase() : "";
  
      return code.includes(needle);
    });
  });
  
  const filterFn = (val, update) => {
    filterValue.value = val;
    update();
  };

  const change = (value) => {
    // Handle change event if needed
  };

  // Initialize brands on mount if dataSolar is already set
  onMounted(async () => {
    if (dataSolar) {
      solarBrand.value =
        (await serviceItemStore.fetchSolarBrandLevel2(dataSolar)) ?? [];
    }
  });
  </script>
  
  <template>
    <div :class="customClass">
      <q-select
        v-model="model"
        class="border_dashed input_filled_custom"
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
        @update:model-value="change"
        @filter="filterFn"
        :options="filteredMaterials"
        :option-value="(option) => `${option.id}`"
        :option-label="(option) => `${option.option_title}`"
        :readonly="readonly"
        :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกยี่ห้อ']"
      >
        <template #label>ยี่ห้อ<span class="color_negative">*</span></template>
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
  