<script setup lang="ts">
const villageName = ref("");
const houseNumber = ref("");

const groupName = ref("");
const alleyNumber = ref("");
const alleywayName = ref("");
const roadNumber = ref("");

// const subdistrict = ref('')
// const subdistrictOptions = ['ตำบล/แขวง', 'ตำบล/แขวง', 'ตำบล/แขวง']

// const district = ref('')
// const districtOptions = ['อำเภอ/เขต', 'อำเภอ/เขต', 'อำเภอ/เขต']

// const province = ref('')
// const provinceOptions = ['จังหวัด', 'จังหวัด', 'จังหวัด']

// const zipCode = ref('')

const dataAddress = computed(() => ({
  province: "",
  district: "",
  subDistrict: "",
  postcode: "",
}));

const FormData = ref({
  houseNumber: "",
});

function setData() {
  FormData.value.houseNumber = houseNumber.value;
}
</script>

<template>
  <!-- {{ FormData }}
  {{ houseNumber }}
  <button @click="setData()">
    setData
  </button> -->
  <div class="col-12 col-md-6 q-pa-sm">
    <q-input
      v-model="villageName"
      filled
      label="ชื่อบ้าน / หมู่บ้าน"
      class="input_filled"
      type="text"
      maxlength="10"
    />
  </div>
  <div class="col-12 col-md-6 q-pa-sm">
    <q-input
      v-model="houseNumber"
      filled
      label="บ้านเลขที่"
      class="input_filled"
      type="text"
      maxlength="10"
      hide-bottom-space
      :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกบ้านเลขที่']"
      @keypress="allowOnlyNumbers"
    />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-input
      v-model="groupName"
      filled
      label="หมู่"
      maxlength="10"
      class="input_filled"
      type="text"
    />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-input
      v-model="alleyNumber"
      filled
      label="ซอย"
      maxlength="10"
      class="input_filled"
      type="text"
    />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-input
      v-model="alleywayName"
      filled
      label="ตรอก"
      maxlength="10"
      class="input_filled"
      type="text"
    />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-input
      v-model="roadNumber"
      filled
      maxlength="10"
      label="ถนน"
      class="input_filled"
      type="text"
    />
  </div>
  <AddressInput
    :data-address="dataAddress"
    address-class="q-pa-sm col-12 col-md-4"
    @update:data-address="dataAddress = $event"
  />

  <!-- <div class="col-12 col-md-3 q-pa-sm">
    <q-select v-model="province" filled  :options="provinceOptions" maxlength="10" label="จังหวัด"
      class="input_filled" hide-bottom-space :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกจังหวัด']" />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-select v-model="district" filled  :options="districtOptions" maxlength="10" label="อำเภอ/เขต"
      class="input_filled" hide-bottom-space
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกอำเภอ/เขต']" />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-select v-model="subdistrict" filled  :options="subdistrictOptions" label="ตำบล/แขวง" maxlength="10"
      class="input_filled" hide-bottom-space
      :rules="[(val) => (val !== null && val !== '') || 'กรุณาเลือกตำบล/แขวง']" />
  </div>
  <div class="col-12 col-md-3 q-pa-sm">
    <q-input v-model="zipCode" filled  label="รหัสไปรษณีย์" class="input_filled" maxlength="5" type="text"
      hide-bottom-space :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกรหัสไปรษณีย์']"
      @keypress="allowOnlyNumbers" />
  </div> -->
</template>

<style lang="scss" scoped>
@import "@style";
</style>
