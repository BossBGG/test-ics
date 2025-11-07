<script setup lang="ts">
const props = defineProps(["readonly"]);
const requestStore = useRequestStore();
const { requestTransformerForm } = storeToRefs(requestStore);

const dialogVisible = ref(false);
const formToRemoveIndex = ref<number | null>(null);

function addForm() {
  const newForm = {
    transformer_brand: null,
    transformer_phase: null,
    transformer_type: null,
    transformer_serial: "",
    transformer_size: null,
    transformer_voltage: null,
  };

  requestTransformerForm.value.push(newForm);
}

// function removeForm(index) {
//   requestTransformerForm.value.splice(index, 1);
// }

function confirmRemoveForm(index) {
  formToRemoveIndex.value = index;
  dialogVisible.value = true;
}

function removeForm() {
  if (formToRemoveIndex.value !== null) {
    requestTransformerForm.value.splice(formToRemoveIndex.value, 1);
    formToRemoveIndex.value = null;
    dialogVisible.value = false;
  }
}

onMounted(async () => {
  if (requestTransformerForm.value.length < 1) {
    const newForm = {
      transformer_brand: null,
      transformer_phase: null,
      transformer_type: null,
      transformer_serial: null,
      transformer_size: null,
      transformer_voltage: null,
      transformer_voltage_other: null,
    };

    requestTransformerForm.value.push(newForm);
  }
});
</script>

<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 500px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>ลบหม้อแปลง</h5>
      </q-bar>
      <q-card-section> คุณแน่ใจหรือไม่ว่าต้องการลบหม้อแปลงนี้? </q-card-section>
      <q-card-actions
        align="center"
        class="q-px-xl q-pb-md q-pt-md btn-modal-alert-cancel"
      >
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ยกเลิก"
            color="primary"
            class="q-btn-size bg-drak-blue full-width text-white"
            @click="dialogVisible = false"
          />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm btn-modal-alert-confirm">
          <q-btn
            flat
            label="ยืนยัน"
            color="primary"
            class="q-btn-size bg-secondary full-width text-white request-submit app-confirm-save-btn"
            @click="removeForm"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <div class="text-sub-head q-px-sm q-pt-md text-weight-600 col-12 q-mb-sm">
    รายละเอียดหม้อแปลง
  </div>
  <div
    v-for="(form, index) in requestTransformerForm"
    :key="index"
    class="width-100"
  >
    <div class="row box_header items-center">
      <div
        v-if="index > 0"
        class="text-sub-head q-pt-md q-mb-sm q-px-sm text-weight-600"
      >
        <span>รายละเอียดหม้อแปลง {{ index + 1 }}</span>
      </div>
      <q-btn
        v-if="index > 0 && !props.readonly"
        class="box_remove text-right"
        @click="confirmRemoveForm(index)"
        :disabled="props.readonly"
        :outline="false"
        :glossy="false"
        :ripple="false"
        unelevated
      >
        <div class="wraper_q_remove">
          <q-icon
            class="icon_remove q-icon material-icons-outlined"
            color="secondary"
            size="24px"
          >
            delete_forever
          </q-icon>
          <span class="text-sub-head text-weight-600 color_secondary">
            ลบหม้อแปลง
          </span>
        </div>
      </q-btn>
    </div>

    <div class="row">
      <FormTransformerBrand
        v-model="form.transformer_brand"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />
      <FormTransformerPhase
        v-model="form.transformer_phase"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />
      <FormTransformerType
        :data-phase="form.transformer_phase"
        v-model="form.transformer_type"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />

      <div class="q-pa-sm col-12 col-md-6">
        <q-input
          v-model="form.transformer_serial"
          bg-color="white"
          color="primary"
          label-color="grey-14"
          filled
          label="Serial"
          class="input_filled input_filled_custom"
          hide-bottom-space
          :rules="[(val) => (val && val.length > 0) || 'กรุณากรอก Serial']"
          :readonly="props.readonly"
          maxlength="20"
          lazy-rules
          @keypress="allowAllExceptThai"
          @paste="allowAllExceptThai"
        >
          <template #label>
            Serial<span class="color_negative">*</span>
          </template>
        </q-input>
      </div>

      <FormTransformerSize
        v-model="form.transformer_size"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />

      <FormTransformerVoltage
        v-model:voltage="form.transformer_voltage"
        v-model:voltage_other="form.transformer_voltage_other"
        custom-class="q-pa-sm col-12 col-md-6"
        :readonly="props.readonly"
      />
    </div>
  </div>

  <div class="q-pa-sm col-12 col-md-6">
    <q-btn
      v-if="!props.readonly"
      flat
      icon="add"
      label="เพิ่มหม้อแปลง"
      class="bg-secondary text-white"
      @click="addForm"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.box_header {
  @include justify-content(space-between);
}
.q-bar--standard {
  height: 46px;
}
</style>
