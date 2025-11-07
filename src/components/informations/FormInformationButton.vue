<script setup lang="ts">
const lorem = ref("loremloremlorem");
const loremnumber = ref("0123456789");
</script>

<template>
  <div class="row row-button q-pa-md justify-center">
    <div class="col-button q-mb-md q-px-sm text-center">
      <q-btn flat label="ย้อนกลับ"
        class="q-mx-auto bg-drak-blue width-270 width-xs-200 text-weight-600 q-padding font-size-normal text-white" />
    </div>
    <div class="col-button q-mb-md q-px-sm text-center">
      <q-btn flat label="ยกเลิกคำร้อง"
        class="font-size-normal bg-secondary width-270 width-xs-200 text-weight-600 q-padding text-white" />
    </div>
    <div class="col-button q-mb-md q-px-sm text-center">
      <q-btn v-if="contact === 'true'" flat label="บันทึกและค้นหาข้อมูล BP "
        class="q-mx-auto font-size-normal bg-primary width-270 width-xs-200 text-weight-600 q-padding text-white" />
      <q-btn v-else flat label="บันทึกและรอการติดต่อ"
        class="q-mx-auto font-size-normal bg-primary width-270 width-xs-200 text-weight-600 q-padding text-white" />
    </div>
    <div class="col-button q-mb-md q-px-sm text-center">
      <q-btn flat label="โอนคำร้อง"
        class="q-mx-auto bg-warning width-270 width-xs-200 text-weight-600 font-size-normal q-padding text-white" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
