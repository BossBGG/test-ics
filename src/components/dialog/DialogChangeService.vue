<script setup lang="ts">
const alert = ref(false);
const confirm = ref(false);
const prompt = ref(false);
const address = ref("");
const text = ref("");

const confirmTransferRequest = ref(false);

const transferRequest = ref("");
const transferRequestOptions = [
  "พื้นที่รับผิดชอบ01",
  "พื้นที่รับผิดชอบ02",
  "พื้นที่รับผิดชอบ03",
];

const showUserName = ref(false);

function closeDialogChangeService() {
  confirmTransferRequest.value = false;
}

function closeDialogChangeServiceCancel() {
  confirmTransferRequest.value = false;
}

function showDialogChangeService() {
  confirmTransferRequest.value = true;
}

async function dialogChangeService() {
  alert("ggg");
}
</script>

<template>
  <q-dialog v-model="confirmDialogChangeService" persistent>
    <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>แก้ไขประเภทคำร้อง</h5>
      </q-bar>
      <q-card-section class="row items-center">
        <q-select
          v-model="transferRequest"
          filled
          label-color="grey-9"
          :options="transferRequestOptions"
          label="พื้นที่รับผิดชอบ"
          class="input_filled full-width input_filled_custom"
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'กรุณาเลือกพื้นที่รับผิดชอบ',
          ]"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-none">
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ปิด"
            color="primary"
            class="q-btn-size bg-drak-blue full-width text-white"
            @click="closeDialogChangeServiceCancel()"
          />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ยืนยันปิดคำร้อง"
            color="primary"
            class="q-btn-size bg-secondary full-width text-white"
            @click="closeDialogChangeService()"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
