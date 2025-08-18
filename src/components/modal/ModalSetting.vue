<script setup lang="ts">
const loading = useLoadingStore();
const modalConfirm = useModalConfirmStore();
const { isModalAlert, dataAlert } = storeToRefs(modalConfirm);
const userDataStore = useUserDataStore();
const { selectedPeaOffice, peaOffices, showSettingModal } =
  storeToRefs(userDataStore);
const settingPeaOffice = ref(selectedPeaOffice.value);

const submitChangePeaOffice = async () => {
  loading.start();
  const { status } = await userDataStore.changePeaOffice(
    settingPeaOffice.value
  );
  if (status) {
    window.location.href = peaUrl("");
  } else {
    loading.stop();
    dataAlert.value = {
      colorText: "primary",
      colorIcon: "white",
      title: "ตั้งค่าการไฟฟ้าไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      icon: "close",
    };
    isModalAlert.value = true;
  }
};
const filterValue = ref("");
const filteredMaterials = computed(() => {
  if (!filterValue.value) {
    return peaOffices.value;
  }
  const needle = filterValue.value.toLowerCase();
  return peaOffices.value.filter((option) => {
    const setting_region = option.regiongroup
      ? option.regiongroup.toLowerCase()
      : "";
    const setting_peaNameFull = option.peaNameFull
      ? option.peaNameFull.toLowerCase()
      : "";
    const setting_office = option.office ? option.office.toLowerCase() : "";

    return (
      setting_region.includes(needle) ||
      setting_peaNameFull.includes(needle) ||
      setting_office.includes(needle)
    );
  });
});

const filterFn = (val, update) => {
  filterValue.value = val;
  update();
};
</script>

<template>
  <q-dialog v-model="showSettingModal" persistent>
    <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>ตั้งค่าการไฟฟ้า</h5>
      </q-bar>
      <q-card-section class="row items-center">
        <q-select
          v-model="settingPeaOffice"
          class="input_filled full-width input_filled_custom"
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
          :stack-label="settingPeaOffice ?? false"
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
            การไฟฟ้า<span class="color_negative">*</span>
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
            @click="
              closeSettingModal();
              settingPeaOffice = selectedPeaOffice;
            "
          />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ยืนยัน"
            color="primary"
            class="q-btn-size bg-secondary full-width text-white"
            :disable="!settingPeaOffice"
            @click="submitChangePeaOffice()"
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
