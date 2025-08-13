<script setup lang="ts">
// const status = computed(() =>
//   dataAlert.icon === "check" ? "สำเร็จ" : "ไม่สำเร็จ",
// );

const modalConfirm = useModalConfirmStore();
const { isModalAlertReload, dataAlert } = storeToRefs(modalConfirm);

function reload() {
  window.location.reload();
}
</script>

<template>
  <!-- <q-btn label="Alert" color="primary" @click="isModalAlertReload = true" /> -->
  <q-dialog v-model="isModalAlertReload" v-if="dataAlert">
    <q-card
      style="width: 500px; max-width: 96vw"
      class="bg-bg_field_gray q-py-sm"
    >
      <!-- <pre>
      {{ dataAlert }}
    </pre> -->

      <q-card-section class="row justify-center">
        <div class="col-12 justify-center text-center">
          <div class="icon">
            <q-avatar
              size="60px"
              font-size="40px"
              color="primary"
              text-color="white"
              icon="close"
            />
          </div>
          <div class="text-weight-600 text_alert color_primary q-my-md">
            <h4>
              {{ dataAlert.title ?? "Reload" }}
              <span v-if="dataAlert.showStatus === 'true'">"{{ status }}"</span>
            </h4>
          </div>
          <div class="detail_alert">
            <h5>
              {{ dataAlert.text ?? 'กดปุ่มด้านล่าง เพื่อ "รีโหลด" หน้านี้' }}
            </h5>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-md">
        <div class="col-12 text-center">
          <q-btn
            flat
            label="รับทราบ"
            color="primary"
            class="q-btn-size-small bg-drak-blue q-padding text-white"
            @click="reload"
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

.text_alert {
  font-size: 26px;
}

.detail_alert {
  font-size: 16px;
}
</style>

<route lang="yaml">
meta:
  layout: index
</route>
