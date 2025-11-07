<script setup lang="ts">
const showForbidden = ref(false);

const code = useQuery("code");
const service = useQuery("service");
const message = computed(() => {
  switch (code.value) {
    case "service":
      if (service.value) {
        return `ไม่พบบริการ ${service.value}`;
      }
      return "ไม่พบบริการที่ค้นหา";
    default:
      return "ไม่พบหมายเลขคำร้องนี้";
  }
});

onMounted(() => {
  showForbidden.value = true;
});

function closeForbidden() {
  showForbidden.value = false;
  window.location.href = peaUrl();
}
</script>

<template>
  <q-dialog v-model="showForbidden" persistent>
    <q-card style="width: 500px; max-width: 96vw" class="bg-bg_field_gray">
      <q-bar class="bg-primary q-py-md text-white">
        <h5>แจ้งเตือน</h5>
      </q-bar>
      <q-card-section
        class="text-noti text-center row justify-center items-center q-pb-md"
      >
        {{ message }}<br />
        กรุณากดปุ่มด้านล่างเพื่อไปที่หน้าหลัก
      </q-card-section>

      <q-card-actions align="center" class="q-px-xl q-pb-md q-pt-none">
        <div class="col-12 col-sm-6 q-pa-sm">
          <q-btn
            flat
            label="ปิด"
            color="primary"
            class="q-btn-size bg-drak-blue full-width text-white"
            @click="closeForbidden()"
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
.text-noti {
  font-size: 14px;
  line-height: 2rem;

  @media #{$screen-mds-min} {
    font-size: 16px;
  }
}
</style>
