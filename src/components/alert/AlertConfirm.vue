<script setup lang="ts">
const props = defineProps<{
  title: string;
  text: string;
}>();
const emit = defineEmits(["confirmClick"]);
const modalConfirm = useModalConfirmStore();
const { isModalConfirm } = storeToRefs(modalConfirm);

function conFirm() {
  isModalConfirm.value = false;
  emit("confirmClick", true);
}
function close() {
  isModalConfirm.value = false;
  emit("confirmClick", false);
}
</script>

<template>
  <!-- <q-btn label="Alert" color="primary" @click="isModalConfirm = true" /> -->

  <q-dialog v-model="isModalConfirm" persistent>
    <q-card style="width: 500px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>
          {{ props.title ?? "กรุณายืนยัน" }}
        </h5>
      </q-bar>

      <q-card-section>
        {{ props.text }}
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-md btn-modal-alert-cancel">
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn flat label="ปิด" color="primary" class="q-btn-size bg-drak-blue full-width text-white"
            @click="close()" />
        </div>
        <div class="col-12 col-sm-6 q-pa-sm btn-modal-alert-confirm">
          <q-btn flat label="ยืนยัน" color="primary"
            class="q-btn-size bg-secondary full-width text-white request-submit app-confirm-save-btn"
            @click="conFirm()" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
