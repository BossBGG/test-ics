<script setup lang="ts">
const props = defineProps([
  "dataAddress",
  "enableHouseID",
  "disableAddressDetails",
  "disable",
  "readonly",
  "hideDropdownIcon",
]);

const addressModel = defineModel();
const loadingModel = defineModel("loading");

const addressStore = useAddressStore();
const { provinces } = storeToRefs(addressStore);

const districts = ref([]);
const subDistricts = ref([]);
const classInput = ref("");
const classInput2 = ref("");
const { isRequestPage } = autoAddressInformationForm();

// watch(props, () => {
//   setAddress.value = { ...addressModel.value };
// });

function loadStart() {
  loadingModel.value = true;
}
function loadStop() {
  loadingModel.value = false;
}

onMounted(async () => {
  loadStart();
  if (props.enableHouseID) {
    classInput.value = "col-12 col-md-6 q-pa-sm";
    classInput2.value = "col-12 col-md-4 q-pa-sm";
  } else {
    classInput.value = "col-12 col-md-6 q-pa-sm";
    classInput2.value = "col-12 col-md-3 q-pa-sm";
  }
  if (isRequestPage) await addressStore.fetchProvinces("pea");
  else await addressStore.fetchProvinces();

  if (addressModel.value.address_post_code) {
    await selectedProvince(addressModel.value.address_province_id);
    await selectedDistrict(addressModel.value.address_city_id);
    // subDistrict.value = addressModel.value.address_district_id;
    // await selectedLocal(addressModel.value.address_post_code);
  }

  loadStop();
});

async function selectedProvince(id) {
  // const hasData = districts.value.find(
  //   (item) => item.id === addressModel.value.address_city_id
  // );
  // if (hasData?.id)
  addressModel.value.address_city_id = null;
  addressModel.value.address_district_id = null;
  addressModel.value.address_post_code = null;

  districts.value = await addressStore.fetchDistrictsByProvinceId(id);
}

async function selectedDistrict(id) {
  // const hasData = subDistricts.value.find(
  //   (item) => item.id === addressModel.value.address_district_id
  // );
  // if (hasData?.id) addressModel.value.address_district_id = null;
  addressModel.value.address_district_id = null;
  subDistricts.value = await addressStore.fetchCodesByDistrictsId(id);
}

async function setProvince(id) {
  await selectedProvince(id);

  const selected = provinces.value.find((item) => item.id == id);
  addressModel.value.address_province = selected?.name ?? null;
}

async function setCity(id) {
  await selectedDistrict(id);
  console.log("load district success");

  const selected = districts.value.find((item) => item.id == id);
  addressModel.value.address_city = selected?.name ?? null;
}

async function setDistrict(id) {
  const selected = subDistricts.value.find((item) => item.id == id);
  console.log("selected: ", selected);

  addressModel.value.address_district =
    selected?.name ?? addressModel.value.address_district ?? null;
  if (!id) {
    addressModel.value.address_post_code = null;
  } else {
    addressModel.value.address_post_code =
      selected?.postcode ?? addressModel.value.address_post_code ?? null;
  }
}
watch(
  () => addressModel.value.address_province_id,
  async () => {
    const { address_province_id, address_city_id, address_district_id } =
      addressModel.value;
    console.log(
      "{ address_province_id, address_city_id, address_district_id } : ",
      { address_province_id, address_city_id, address_district_id }
    );

    loadStart();
    await setProvince(address_province_id);
    await setCity(address_city_id);
    await setDistrict(address_district_id);
    loadStop();
  }
);

watch(
  () => addressModel.value.address_city_id,
  async () => {
    const { address_province_id, address_city_id, address_district_id } =
      addressModel.value;
    console.log(
      "{ address_province_id, address_city_id, address_district_id } : ",
      { address_province_id, address_city_id, address_district_id }
    );

    loadStart();
    await setCity(address_city_id);
    await setDistrict(address_district_id);
    loadStop();
  }
);

watch(
  () => addressModel.value.address_district_id,
  async () => {
    const { address_province_id, address_city_id, address_district_id } =
      addressModel.value;
    console.log(
      "{ address_province_id, address_city_id, address_district_id } : ",
      { address_province_id, address_city_id, address_district_id }
    );

    loadStart();
    await setDistrict(address_district_id);
    loadStop();
  }
);
</script>

<template>
  <pre>
  {{ addressModel }}
  </pre>
  <div :class="classInput" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_room_no"
      label-color="grey-14"
      bg-color="white"
      filled
      label="เลขที่ห้อง"
      class="input_filled input_filled_custom"
      maxlength="10"
      type="text"
      @keypress="allowOnlyNumbers"
      @paste="copyOnlyNumber"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div :class="classInput" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_floor"
      label-color="grey-14"
      bg-color="white"
      filled
      label="ชั้น"
      class="input_filled input_filled_custom"
      maxlength="10"
      type="text"
      @keypress="allowOnlyNumbers"
      @paste="copyOnlyNumber"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div :class="classInput" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_house_name"
      label-color="grey-14"
      bg-color="white"
      filled
      label="ชื่อบ้าน / หมู่บ้าน"
      class="input_filled input_filled_custom"
      type="text"
      maxlength="50"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div :class="classInput" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_house_no"
      label-color="grey-14"
      bg-color="white"
      filled
      label="บ้านเลขที่"
      class="input_filled input_filled_custom"
      type="text"
      maxlength="30"
      hide-bottom-space
      :rules="[(val) => (val && val.length > 0) || 'กรุณากรอกบ้านเลขที่']"
      @keypress="allowOnlyNumbers"
      @paste="copyOnlyNumber"
      :disable="props.disable"
      :readonly="props.readonly"
    >
      <template #label>
        บ้านเลขที่<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>

  <div :class="classInput" v-if="props.enableHouseID && !disableAddressDetails">
    <q-input
      v-model="addressModel.address_house_id"
      label-color="grey-14"
      bg-color="white"
      filled
      label="รหัสประจำบ้าน"
      maxlength="11"
      class="input_filled input_filled_custom"
      type="text"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div
    :class="props.enableHouseID ? classInput : classInput2"
    v-if="!disableAddressDetails"
  >
    <q-input
      v-model="addressModel.address_moo"
      label-color="grey-14"
      bg-color="white"
      filled
      label="หมู่"
      maxlength="10"
      class="input_filled input_filled_custom"
      type="text"
      :disable="props.disable"
      :readonly="props.readonly"
      @keypress="quantityNumbers"
      @paste="copyOnlyNumber"
    />
  </div>

  <div :class="classInput2" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_street"
      label-color="grey-14"
      bg-color="white"
      filled
      maxlength="60"
      label="ถนน"
      class="input_filled input_filled_custom"
      type="text"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div :class="classInput2" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_lane"
      label-color="grey-14"
      bg-color="white"
      filled
      label="ตรอก"
      maxlength="40"
      class="input_filled input_filled_custom"
      type="text"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>

  <div :class="classInput2" v-if="!disableAddressDetails">
    <q-input
      v-model="addressModel.address_alley"
      label-color="grey-14"
      bg-color="white"
      filled
      label="ซอย"
      maxlength="40"
      class="input_filled input_filled_custom"
      type="text"
      :disable="props.disable"
      :readonly="props.readonly"
    />
  </div>
  <div :class="classInput2">
    <ProvinceInput
      v-model="addressModel.address_province_id"
      :disable="props.disable"
      :readonly="props.readonly"
      :hide-dropdown-icon="props.hideDropdownIcon"
      @@update:modelValue="setProvince(addressModel.address_province_id)"
    />
  </div>
  <div :class="classInput2">
    <DistrictInput
      v-model="addressModel.address_city_id"
      :data-options="districts"
      :disable="props.disable"
      :readonly="props.readonly"
      :hide-dropdown-icon="props.hideDropdownIcon"
      @update:modelValue="setCity(addressModel.address_city_id)"
    />
  </div>
  <div :class="classInput2">
    <SubdistrictInput
      v-model="addressModel.address_district_id"
      :data-options="subDistricts"
      :disable="props.disable"
      :readonly="props.readonly"
      :hide-dropdown-icon="props.hideDropdownIcon"
      @update:modelValue="setDistrict(addressModel.address_district_id)"
    />
  </div>
  <div :class="classInput2">
    <PostcodeInput
      v-model="addressModel.address_post_code"
      :disable="props.disable"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
