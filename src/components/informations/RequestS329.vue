<script setup lang="ts">
const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
const serviceItemStore = useServiceItemStore();
const { renewableSources } = storeToRefs(serviceItemStore);

onMounted(async () => {
  await serviceItemStore.fetchRenewableSource();
});
</script>

<template>
  <div v-if="requestServiceForm" class="row q-pa-sm">
    <RequestNormalDetail
      title="ขอซื้อขายใบรับรองการผลิตพลังงานหมุนเวียน"
      :canEdit="CAN_EDIT.REQUEST.value"
    />

    <div class="col-12">
      <div class="text-sub-head q-px-sm q-pt-sm text-weight-600">
        1. สำรวจความต้องการใบรับรองพลังงานหมุนเวียน
        <!-- <span class="color_negative text-weight-400">*</span> -->
      </div>
    </div>

    <FormRenewableType
      :readonly="!CAN_EDIT.REQUEST.value"
      v-model="requestServiceForm.renewable_type"
      custom-class="q-pa-sm col-12 col-md-12"
    />

    <div class="col-12">
      <!-- <div class="text-sub-head q-px-sm q-pt-sm text-weight-600">
        แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ<br class="show_mb" />
        <span class="text-weight-400"> (เลือกได้มากกว่า 1 ข้อ)</span>
      </div> -->
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
            :disable="!CAN_EDIT.REQUEST.value"
            v-model="requestServiceForm.renewable_source"
            label-color="grey-14"
            bg-color="white"
            right-label
            color="secondary"
            size="42px"
            :val="option.id"
            :label="option.option_title"
            class="custom_checkbox input_checkbox_costom"
            @click="
              if (option.is_other) {
                requestServiceForm.renewable_source_other[option.id] = null;
              } else if (
                requestServiceForm?.renewable_source_other?.hasOwnProperty(
                  option.id
                )
              ) {
                delete requestServiceForm.renewable_source_other[option.id];
              }
            "
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
            :disable="!CAN_EDIT.REQUEST.value"
            v-model="requestServiceForm.renewable_source_other[option.id]"
            bg-color="white"
            color="primary"
            label-color="grey-14"
            filled
            label
            :key="option.id"
            class="input_filled input_filled_custom"
            hide-bottom-space
            @keypress="allowOnlyAlphanumericAndThai"
            @paste="allowOnlyAlphanumericAndThai"
            maxlength="500"
            :rules="[
              (val) =>
                (requestServiceForm?.renewable_source?.find(
                  (item) => item == option.id
                )
                  ? val && val.length > 0
                  : true) || 'กรุณากรอก',
            ]"
          >
            <template #label>
              {{ option.option_title }}<span class="color_negative">*</span>
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="text-sub-head q-px-sm q-pt-sm text-weight-600">
        3. ปีที่มีความต้องการซื้อ REC
      </div>
    </div>
    <div class="q-pa-sm col-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.qty"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        :rules="[(val) => val > 0 || 'กรุณากรอกจำนวน']"
        :maxlength="10"
      >
        <template #label>จำนวน<span class="color_negative">*</span></template>
      </q-input>
    </div>
    <div class="q-pa-sm col-6">
      <q-input
        :readonly="!CAN_EDIT.REQUEST.value"
        v-model.number="requestServiceForm.year"
        bg-color="white"
        color="primary"
        label-color="grey-14"
        filled
        label
        :maxlength="4"
        class="input_filled input_filled_custom"
        hide-bottom-space
        @keypress="allowOnlyNumbers"
        @paste="allowOnlyNumbers"
        :rules="[(val) => val > 0 || 'กรุณาระบุปี (พ.ศ.)']"
      >
        <template #label>
          ระบุปี (พ.ศ.)<span class="color_negative">*</span>
        </template>
      </q-input>
    </div>

    <RequestEditServiceBtn :canEdit="CAN_EDIT.REQUEST.value" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
