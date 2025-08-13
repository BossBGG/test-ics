<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();

const serviceItemStore = useServiceItemStore();
const { requestServices } = storeToRefs(serviceItemStore);

const RequestStore = useRequestStore();
const { nowRequestCode } = storeToRefs(RequestStore);

const requestRules = [
  (val) => {
    if (nowRequestCode.value === "S328") {
      return val !== null && val !== ""
        ? true
        : "กรุณาเลือกความต้องการขอรับบริการ";
    }
    return true;
  },
  (val) => (val !== null && val !== "" ? true : "กรุณาเลือกประเภทการให้บริการ"),
];

onMounted(async () => {
  await serviceItemStore.fetchRequestService();

  const hasData = requestServices.value.find((obj) => obj.id === model.value);

  if (!hasData) {
    model.value = null;
  }
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return requestServices.value;
  }
  const needle = filterValue.value.toLowerCase();
  return requestServices.value.filter((option) => {
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
  <div v-if="requestServices" :class="props.customClass">
    <!-- {{ model }} -->
    <q-select
      v-model="model"
      class="border_dashed input_filled_custom"
      :stack-label="model ?? false"
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
      :rules="requestRules"
    >
      <template #label v-if="nowRequestCode === 'S328'">
        ความต้องการขอรับบริการ<span class="color_negative">*</span>
      </template>
      <template #label v-else>
        ประเภทการให้บริการ<span class="color_negative">*</span>
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
