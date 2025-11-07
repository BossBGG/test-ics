<script setup lang="ts">
const serviceStore = useServiceStore();
const requestStore = useRequestStore();
const {
  requestForm,
  requestServiceForm,
  setRequestCode,
  nowRequestCode,
  requestTransformerForm,
} = storeToRefs(requestStore);
const { services, showChangeServiceModal } = storeToRefs(serviceStore);
const uid = useParams("uid");

const originalFiles = ref({
  files: "",
  service: "",
});

onMounted(async () => {
  originalFiles.value.files = requestServiceForm.value.files;
  originalFiles.value.service = requestForm.value.service_code;
});

function onSubmitBtn() {
  // console.log(
  //   "requestForm.value.service_code: ",
  //   requestForm.value.service_code,
  // );
  setRequestCode.value = requestForm.value.service_code;
  //   console.log(
  //   "requestForm.value.service_code: ",
  //   requestForm.value.service_code,
  // );

  if (setRequestCode.value == originalFiles.value.service) {
    requestServiceForm.value.files = originalFiles.value.files;
  } else {
    requestServiceForm.value.files = null;
  }

  if (
    requestServiceForm.value.service_code != "S305" &&
    requestServiceForm.value.service_code != "S313"
  ) {
    requestTransformerForm.value = [];
  }

  closeEditServiceModal();
}

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return services.value;
  }
  const needle = filterValue.value.toLowerCase();
  return services.value.filter((option) => {
    const code = option.request_code ? option.request_code.toLowerCase() : "";
    const title_name = option.name ? option.name.toLowerCase() : "";

    return code.includes(needle) || title_name.includes(needle);
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <!-- isOpen : {{ isOpen }} -->

  <q-dialog v-model="showChangeServiceModal" persistent>
    <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>แก้ไขประเภทคำร้อง</h5>
      </q-bar>
      <q-card-section class="row items-center">
        <!-- {{ requestForm.service_code }} -->
        <q-select
          v-model="requestForm.service_code"
          label="ประเภทคำร้อง"
          class="input_filled full-width input_filled_custom"
          filled
          label-color="grey-9"
          emit-value
          map-options
          use-input
          fill-input
          input-debounce="0"
          hide-selected
          hide-bottom-space
          lazy-rules
          clearable
          @filter="filterFn"
          :options="filteredMaterials"
          :option-value="(option) => `${option.request_code}`"
          :option-label="(option) => `${option.request_code} : ${option.name}`"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'กรุณาเลือกพื้นที่รับผิดชอบ',
          ]"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey"> ไม่พบข้อมูล </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-none">
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ปิด"
            color="primary"
            class="q-btn-size bg-drak-blue full-width text-white"
            @click="closeEditServiceModal()"
          />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            :disable="!requestForm.service_code"
            flat
            label="ยืนยัน"
            color="primary"
            class="q-btn-size bg-secondary full-width text-white"
            @click="onSubmitBtn()"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "@style";

.q-bar--standard {
  height: 46px;
}
</style>
