<script setup lang="ts">
// const props = defineProps<{
//   isCancel: boolean;
// }>();

// const status = computed(() =>
//   dataAlert.icon === "check" ? "สำเร็จ" : "ไม่สำเร็จ",
// );

const modalConfirm = useModalConfirmStore();
const { isModalAlert, dataAlert } = storeToRefs(modalConfirm);

function closeAlert() {
  // console.log("ก่อนเข้า");

  // if (props.isCancel == true) {
  //   console.log("เข้า", props.isCancel == true);
  //   isModalAlert.value = false;
  //   location.reload();
  // }
  isModalAlert.value = false;
}
</script>

<template>
  <!-- {{ props.isCancel }} -->
  <!-- <q-btn label="Alert" color="primary" @click="isModalAlert = true" /> -->

  <q-dialog v-model="isModalAlert" v-if="dataAlert">
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
              :color="dataAlert.colorText ?? 'primary'"
              :text-color="dataAlert.colorIcon ?? 'white'"
              :icon="dataAlert.icon ?? 'check'"
            />
            <!-- <q-avatar
                size="60px" font-size="40px" color="red" text-color="white" icon="close"
              /> -->
          </div>
          <div class="text-weight-600 text_alert color_primary q-my-md">
            <h4>
              {{ dataAlert.title ?? "บันทึกข้อมูล" }}
              <span v-if="dataAlert.showStatus === 'true'">"{{ status }}"</span>
            </h4>
          </div>
          <!-- <div class="text_alert color_negative text-weight-600 q-my-md">
              <h4>
                Sorry
              </h4>
            </div> -->
          <div class="detail_alert" v-if="dataAlert?.text">
            <h5>{{ dataAlert.text }}</h5>
            <!-- <h5>บันทึกและค้นหาข้อมูล BP ไม่สำเร็จ</h5> -->
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-md">
        <div class="col-12 text-center">
          <q-btn
            flat
            color="primary"
            class="q-btn-size-small bg-drak-blue q-padding text-white"
            id="btn-close-alert"
            @click="closeAlert()"
            >ปิด</q-btn
          >
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
