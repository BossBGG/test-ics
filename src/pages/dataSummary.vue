<script setup lang="ts">
// const { t } = useI18n();
// const requestStore = useRequestStore()
// const { request } = storeToRefs(requestStore)

// const id = useParams('uid')
// const serviceID = 'S305'

// onMounted(async () => {
//   loading.start()
//   await requestStore.fetchGetRequestsByUID(id, serviceID)
//   loading.stop()
// })

// const forms = ref([{ name1: '', name2: '', name3: '', name4: '', name5: '', name6: '' }])

// function addForm() {
//   forms.value.push({ name1: '', name2: '', name3: '', name4: '', name5: '', name6: '' })
// }

// function removeForm(index) {
//   forms.value.splice(index, 1)
// }

// const transformer_serial = ref('')
// const transformer_size = ref('')
// const transformer_voltage = ref('')
</script>

<template>
  <div>
    <FormDetailsRequest />
    <StatusBar class="q-mt-lg" custom-class="active4" />
    <FormCreateQuote class="q-mt-lg" />
    <FormTableSummary class="q-mt-xl" />

    <!-- <div>
      <h2>Form Cloning</h2>
      <div v-for="(form, index) in forms" :key="index">
        <span v-if="index > 0">หม้อแปลงที่ {{ index + 1 }}</span>

        <div class="row">
          <q-input v-model="form.name1" placeholder="Enter Name" />
          <q-input v-model="form.name2" placeholder="Enter Name" />
          <q-input v-model="form.name3" placeholder="Enter Name" />

          <div class="q-pa-sm col-12 col-md-6">
            <q-input
              v-model="transformer_serial" bg-color="white" color="primary"
              label-color="grey-14" filled  label="Serial" class="input_filled input_filled_custom"
              hide-bottom-space  :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกชื่อ']"
            >
              <template #label>
                Serial <span class="color_negative">*</span>
              </template>
</q-input>
</div>
<div class="q-pa-sm col-12 col-md-6">
  <q-input v-model="transformer_size" bg-color="white" color="primary" label-color="grey-14" filled
    label="ขนาด" class="input_filled input_filled_custom" hide-bottom-space
    :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกขนาด']">
    <template #label>
                ขนาด <span class="color_negative">*</span>
              </template>
  </q-input>
</div>
<div class="q-pa-sm col-12 col-md-6">
  <q-input v-model="transformer_voltage" bg-color="white" color="primary" label-color="grey-14" filled
    label="แรงดัน" class="input_filled input_filled_custom" hide-bottom-space
    :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกขนาด']">
    <template #label>
                แรงดัน <span class="color_negative">*</span>
              </template>
  </q-input>
</div>
</div>

<div class="q-pa-sm col-12 col-md-6">
  <q-btn v-if="index > 0" flat icon="add" label="removeForm" class="q-btn-size-small bg-secondary text-white"
    @click="removeForm(index)" />
</div>
</div>
<div class="q-pa-sm col-12 col-md-6">
  <q-btn flat icon="add" label="เพิ่มหม้อแปลง" class="q-btn-size-small bg-secondary text-white" @click="addForm" />
</div>
</div> -->

    <div v-if="1" class="q-mt-xl box_btn_center">
      <q-btn
        flat
        label="ย้อนกลับ"
        class="q-btn-size bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="ยกเลิกคำร้อง"
        class="q-btn-size bg-secondary width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="บันทึกคำร้องและใบเสนอราคา"
        class="q-btn-size bg-primary width-270 width-xs-200 text-weight-600 text-white"
      />
    </div>
    <div v-if="1" class="box_btn_center q-mt-xl">
      <q-btn
        flat
        label="ย้อนกลับ"
        class="q-btn-size width-270 width-xs-200 text-weight-600 btn_gray text-white"
      />
      <q-btn
        flat
        label="แก้ไขใบเสนอราคา"
        class="q-btn-size bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="ไม่อนุมัติ"
        class="q-btn-size bg-drak-blue width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="อนุมัติ"
        class="q-btn-size bg-secondary width-270 width-xs-200 text-weight-600 text-white"
      />
    </div>
    <div v-if="1" class="box_btn_center q-mt-xl">
      <q-btn
        flat
        label="ย้อนกลับ"
        class="q-btn-size btn_gray width-270 width-xs-200 text-weight-600 text-white"
      />

      <q-btn
        flat
        label="ยกเลิกคำร้อง"
        class="q-btn-size bg-secondary width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="พิมพ์ใบเสนอราคา"
        class="q-btn-size bg-primary width-270 width-xs-200 text-weight-600 text-white"
      />
      <q-btn
        flat
        label="พิมพ์ใบเสร็จ"
        class="q-btn-size bg-primary width-270 width-xs-200 text-weight-600 text-white"
      />
    </div>
    <!-- <FormDataSummary class="q-mt-xl" /> -->
  </div>
</template>

<route lang="yaml">
meta:
  layout: createbp
</route>
