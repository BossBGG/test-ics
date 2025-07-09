<script setup lang="ts">
const { readonly } = defineProps(["readonly"]);
const requestStore = useRequestStore();
const {
  requestServiceForm,
  validateTimeStatusForm,
  validateTimeStatusFormText,
} = storeToRefs(requestStore);

const isCheckboxSelected = computed(() => {
  return (
    requestServiceForm.value.morning_flag ||
    requestServiceForm.value.afternoon_flag
  );
});

watch(
  () => isCheckboxSelected.value,
  (newValue) => {
    validateTimeStatusForm.value = newValue;
    if (newValue) validateTimeStatusFormText.value = false;
  },
);

onMounted(() => {
  if (isCheckboxSelected.value) validateTimeStatusForm.value = true;
  else validateTimeStatusForm.value = false;
});
</script>

<template>
  <!-- <pre> {{ requestServiceForm }} </pre> -->
  <!-- {{ validateTimeStatusForm }} -->
  <div class="bg_field_gray rounded" id="formCreateApplicationStatus">
    <div class="row q-pa-sm">
      <div class="q-pt-md text-weight-600 col-12 q-px-sm text-sub-head">
        ช่วงเวลาที่สะดวกให้ติดต่อกลับ
      </div>
      <div class="q-px-sm col-12 q-pt-sm text-sub-head2">
        *สามารถเลือกได้มากกว่าหนึ่งตัวเลือก
      </div>
      <div class="q-pa-sm col-12">
        <div class="col-12 col-md-12">
          <q-checkbox
            v-model="requestServiceForm.morning_flag"
            label-color="grey-14"
            bg-color="white"
            right-label
            color="secondary"
            size="42px"
            val="ช่วงเช้า (9.00 - 12.00)"
            label="ช่วงเช้า (9.00 - 12.00)"
            class="custom_checkbox input_checkbox_costom checkbox-morning-flag"
            :disable="readonly"
          />
        </div>
        <div class="col-12 col-md-12">
          <q-checkbox
            v-model="requestServiceForm.afternoon_flag"
            label-color="grey-14"
            bg-color="white"
            right-label
            color="secondary"
            size="42px"
            val="ช่วงบ่าย (13.00 - 16.00)"
            label="ช่วงบ่าย (13.00 - 16.00)"
            class="custom_checkbox input_checkbox_costom checkbox-afternoon-flag"
            :disable="readonly"
          />
        </div>
        <span
          class="font-validate color_negative"
          v-if="validateTimeStatusFormText"
          >กรุณาเลือกอย่างน้อยหนึ่งช่วงเวลา</span
        >
      </div>

      <div class="q-pa-sm col-12 col-md-12">
        <q-input
          v-model="requestServiceForm.detail"
          class="full-width input_filled_custom input-detail"
          rows="2"
          label-color="grey-14"
          label="รายละเอียดเพิ่มเติม"
          stack-label
          :dense="dense"
          filled
          type="textarea"
          bg-color="white"
          color="grey-14"
          :readonly="readonly"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
.font-validate {
  font-size: 12px;
}
</style>
