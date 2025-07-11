<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
const serviceItemStore = useServiceItemStore();
const { kwSizes } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchKwSize();
});

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return kwSizes.value;
  }
  const needle = filterValue.value.toLowerCase();
  return kwSizes.value.filter((option) => {
    const code = option.option_title ? option.option_title.toLowerCase() : "";

    return code.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate
  )
);
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="แบบคำร้องขอเช่าเครื่องกำเนิดไฟฟ้า"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <div class="q-pa-sm col-12 col-md-6">
      <q-select
        v-model="requestServiceForm.kw_size"
        class="border_dashed input_filled_custom select-m-business-type"
        label="จำนวน kW"
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
        input-debounce="0"
        map-options
        clearable
        @filter="filterFn"
        :options="filteredMaterials"
        :option-value="(option) => `${option.id}`"
        :option-label="(option) => `${option.option_title}`"
        :readonly="!CAN_EDIT.REQUEST.value"
        :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกจำนวน kW']"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="q-pa-sm col-12 col-md-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.qty"
        bg-color="white"
        color="primary"
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
      >
        <template #label> จำนวนเครื่อง </template>
      </q-input>
    </div>

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_startdate"
      custom-class="q-pa-sm col-12 col-md-4"
      label-text="วันที่เริ่มต้น"
      :date-start="true"
    />

    <FormDatePicker
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.rental_enddate"
      custom-class="q-pa-sm col-12 col-md-4"
      label-text="วันที่สิ้นสุด"
      type="endDate"
      :date-end="true"
    />

    <div class="q-pa-sm col-12 col-md-4">
      <q-input
        v-model="requestServiceForm.days"
        readonly
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
      >
        <template #label> จำนวนวัน </template>
      </q-input>
    </div>

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
