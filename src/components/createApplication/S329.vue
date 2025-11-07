<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
const serviceItemStore = useServiceItemStore();
const { renewableSources } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchRenewableSource();
});

function renewableSourceChecked(option) {
  if (option.is_other)
    requestServiceForm.value.renewable_source_other[option.id] = null;
  else if (
    requestServiceForm.value.renewable_source_other?.hasOwnProperty(option.id)
  )
    delete requestServiceForm.value.renewable_source_other[option.id];
}
</script>

<template>
  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    1. สำรวจความต้องการใบรับรองพลังงานหมุนเวียน
  </div>

  <FormRenewableType
    v-model="requestServiceForm.renewable_type"
    custom-class="q-pa-sm col-12"
    :readonly="readonly"
  />

  <div class="col-12">
    <div class="text-sub-head q-px-sm q-pt-md text-weight-600">
      2. แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ
    </div>
    <div class="text-sub-head2 q-px-sm q-pt-sm">
      *สามารถเลือกได้มากกว่าหนึ่งตัวเลือก
    </div>
  </div>
  <div class="q-pa-sm col-12">
    <div v-for="(option, index) in renewableSources" :key="index">
      <div class="col-12 col-md-12">
        <q-checkbox
          v-model="requestServiceForm.renewable_source"
          :disable="readonly"
          label-color="grey-14"
          bg-color="white"
          right-label
          color="secondary"
          size="42px"
          :val="option.id"
          :label="option.option_title"
          class="custom_checkbox input_checkbox_costom"
          @click="renewableSourceChecked(option)"
        />
      </div>
      <div class="col-12 col-md-12">
        <q-input
          v-if="
            option.is_other === true &&
            requestServiceForm?.renewable_source?.find(
              (item) => item == option.id
            )
          "
          :key="option.id"
          v-model="requestServiceForm.renewable_source_other[option.id]"
          :disable="readonly"
          bg-color="white"
          color="primary"
          label-color="grey-14"
          filled
          label
          class="input_filled input_filled_custom"
          hide-bottom-space
          maxlength="500"
          :rules="[
            (val) =>
              (requestServiceForm?.renewable_source?.find(
                (item) => item == option.id
              )
                ? val && val.length > 0
                : true) || 'กรุณากรอก',
          ]"
          @keypress="allowOnlyAlphanumericAndThai"
          @paste="allowOnlyAlphanumericAndThai"
        >
          <template #label>
            {{ option.option_title }}<span class="color_negative">*</span>
          </template>
        </q-input>
      </div>
    </div>
  </div>
  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12">
    3. ปีที่มีความต้องการซื้อ REC
  </div>
  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.qty"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[(val) => (val !== null && val !== '') || 'กรุณากรอกจำนวน']"
      :readonly="readonly"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
    >
      <template #label> จำนวน<span class="color_negative">*</span> </template>
    </q-input>
  </div>

  <div class="q-pa-sm col-12 col-md-6">
    <q-input
      v-model.number="requestServiceForm.year"
      :readonly="readonly"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label
      class="input_filled input_filled_custom"
      hide-bottom-space
      :rules="[(val) => val > 0 || 'กรุณาระบุปี (พ.ศ.)']"
      @keypress="allowOnlyNumbers"
      @paste="allowOnlyNumbers"
    >
      <template #label>
        ระบุปี (พ.ศ.)<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
