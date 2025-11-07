<script setup lang="ts">
const requestStore = useRequestStore();
const masterDataStore = useMasterDataStore();
const modalConfirm = useModalConfirmStore();
const {
  request,
  showTransferRequestModal,
  requestForm,
  isNewCitySameOffice,
  transferRequest,
} = storeToRefs(requestStore);
const { allPeaOffice } = storeToRefs(masterDataStore);
const { isModalConfirm, isModalAlert, dataAlert } = storeToRefs(modalConfirm);

const uid = useParams("uid");

async function onSubmitBtn() {
  const form = ref({
    address: requestForm.value.address,
    address_province: requestForm.value.address_province,
    address_city: requestForm.value.address_city,
    address_district: requestForm.value.address_district,
    address_post_code: requestForm.value.address_post_code,
    pea_office: transferRequest.value,
    latitude: requestForm.value.latitude,
    longitude: requestForm.value.longitude,
  });

  if (uid.value && transferRequest.value) {
    const { status } = await requestStore.transferRequestByUID(
      uid.value,
      form.value
    );
    if (status) {
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "โอนย้ายคำร้องสำเร็จ",
        icon: "check",
      };
      isModalAlert.value = true;
      isNewCitySameOffice.value = true;
      requestForm.value.pea_office = transferRequest.value;
    } else {
      dataAlert.value = {
        colorText: "primary",
        colorIcon: "white",
        title: "โอนย้ายคำร้องไม่สำเร็จ",
        text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        icon: "close",
      };
      isModalAlert.value = true;
    }
  }
  if (transferRequest.value == requestForm.value.pea_office) {
    isNewCitySameOffice.value = true;
  }
  showTransferRequestModal.value = false;
}

onMounted(() => {
  if (requestForm.value.pea_office) {
    transferRequest.value = requestForm.value.pea_office;
  }
});

watch(
  () => requestForm.value.pea_office,
  (newValue) => {
    if (newValue) transferRequest.value = newValue;
  }
);

watch(
  () => isModalAlert.value,
  (newValue) => {
    if (!newValue && isNewCitySameOffice.value)
      window.location.href = peaUrlDashboard(request.value?.service_group_id);
  }
);

const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return allPeaOffice.value;
  }
  const needle = filterValue.value.toLowerCase();
  return allPeaOffice.value.filter((option) => {
    const code_region = option.regiongroup
      ? option.regiongroup.toLowerCase()
      : "";
    const code_peaNameFull = option.peaNameFull
      ? option.peaNameFull.toLowerCase()
      : "";
    const code_office = option.office ? option.office.toLowerCase() : "";

    return (
      code_region.includes(needle) ||
      code_peaNameFull.includes(needle) ||
      code_office.includes(needle)
    );
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <q-dialog v-model="showTransferRequestModal" persistent>
    <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>โอนคำร้อง</h5>
      </q-bar>
      <q-card-section class="row items-center">
        <q-select
          v-model="transferRequest"
          class="input_filled full-width input_filled_custom select-area-transfer"
          label
          filled
          label-color="grey-9"
          hide-bottom-space
          hide-selected
          emit-value
          use-input
          fill-input
          lazy-rules
          map-options
          input-debounce="0"
          clearable
          :stack-label="transferRequest ?? false"
          @filter="filterFn"
          :options="filteredMaterials"
          :option-value="(option) => `${option.office}`"
          :option-label="
            (option) =>
              option.office
                ? `${option.regiongroup} : ${option.peaNameFull} [${option.office}]`
                : 'กรุณาเลือกพื้นที่รับผิดชอบ'
          "
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'กรุณาเลือกพื้นที่รับผิดชอบ',
          ]"
        >
          <template #label>
            พื้นที่รับผิดชอบ<span class="color_negative">*</span>
          </template>
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
            @click="closeTransferRequestModal()"
          />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ยืนยันโอนคำร้อง"
            color="primary"
            class="q-btn-size bg-secondary full-width text-white btn-request-confirm-transfer"
            :disable="!allPeaOffice || !transferRequest"
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
