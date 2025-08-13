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

function closeConfirm() {
  confirm.value = false;
}

function closeConfirmCancel() {
  confirm.value = false;
}

function showConfirm() {
  confirm.value = true;
  showUserName.value = true;
}

function closeConfirmTransferRequest() {
  confirmTransferRequest.value = false;
}

function closeConfirmTransferRequestCancel() {
  confirmTransferRequest.value = false;
}

function showConfirmTransferRequest() {
  confirmTransferRequest.value = true;
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <div v-if="showUserName">Tanut S.</div>

    <!-- <q-btn label="Alert" color="primary" @click="alert = true" /> -->
    <!-- <q-btn label="ต้องการยกเลิกคำร้องหรือไม่?" color="primary" @click="showConfirm()" /> -->
    <!-- <q-btn label="Prompt" color="primary" @click="prompt = true" /> -->

    <q-btn label="Alert" color="primary" @click="alert = true" />

    <q-btn
      label="โอนคำร้อง"
      color="primary"
      @click="showConfirmTransferRequest()"
    />
    <q-btn
      label="ต้องการยกเลิกคำร้องหรือไม่?"
      color="primary"
      @click="showConfirm()"
    />

    <q-dialog v-model="alert">
      <q-card style="width: 460px; max-width: 96vw">
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            label="ปิด"
            color="primary"
            @click="closeConfirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="address"
            dense
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn v-close-popup flat label="Cancel" />
          <q-btn v-close-popup flat label="Add address" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirm" persistent>
      <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
        <q-bar class="bg-primary q-py-md text-white">
          <h5>ต้องการยกเลิกคำร้องหรือไม่?</h5>
        </q-bar>
        <q-card-section class="row items-center">
          <q-input
            v-model="text"
            class="full-width"
            label-color="grey-14"
            label="หมายเหตุ*"
            stack-label
            :dense="dense"
            filled
            type="textarea"
            bg-color="white"
            color="grey-14"
          />
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none q-px-xl q-pb-md">
          <div class="col-12 q-pa-sm col-sm-6">
            <q-btn
              flat
              label="ปิด"
              color="primary"
              class="q-btn-size bg-drak-blue full-width text-white"
              @click="closeConfirmCancel()"
            />
          </div>
          <div class="col-12 col-sm-6 q-pa-sm">
            <q-btn
              flat
              label="ยืนยันปิดคำร้อง"
              color="primary"
              class="q-btn-size bg-primary full-width text-white"
              @click="closeConfirm()"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmTransferRequest" persistent>
      <q-card style="width: 700px; max-width: 96vw" class="bg-bg_field_gray">
        <q-bar class="bg-primary q-py-md text-white">
          <h5>โอนคำร้อง</h5>
        </q-bar>
        <q-card-section class="row items-center">
          <q-select
            v-model="transferRequest"
            filled
            label-color="grey-9"
            :options="transferRequestOptions"
            label="พื้นที่รับผิดชอบ"
            class="full-width input_filled input_filled_custom"
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
              @click="closeConfirmTransferRequestCancel()"
            />
          </div>
          <div class="col-12 col-sm-6 q-pa-sm">
            <q-btn
              flat
              label="ยืนยันปิดคำร้อง"
              color="primary"
              class="q-btn-size bg-secondary full-width text-white"
              @click="closeConfirmTransferRequest()"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.q-bar--standard {
  height: 46px;
}
</style>

<route lang="yaml">
meta:
  layout: index
</route>
