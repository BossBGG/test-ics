<script setup lang="ts">
const props = defineProps(["addressClass"]);
const model = defineModel();

const addressStore = useAddressStore();

// const province = ref('')
// const district = ref('')
// const subDistrict = ref('')
// const postcode = ref('')

async function setAddress() {
  if (model.value.address_province_id) {
    await addressStore.fetchDistrictsByProvinceId(
      model.value.address_province_id
    );
    // await addressStore.fetchCodesByDistrictsId(model.value.address_district)
  }
}
onMounted(async () => {
  await setAddress();
  // await addressStore.fetchProvinces()
});

watchEffect(async () => {
  await setAddress();
});

async function selectedProvince(val) {
  if (val?.name) {
    model.value.address_province_id = val.id;
    model.value.address_province = val.name;
  }

  await addressStore.fetchDistrictsByProvinceId(val.id);
}

async function selectedDistrict(val) {
  if (val?.name) {
    model.value.address_district_id = val.id;
    model.value.address_district = val.name;
  }
  await addressStore.fetchCodesByDistrictsId(val.id);
}

async function selectedLocal(val) {
  if (val?.name) {
    model.value.address_city_id = val.id;
    model.value.address_city = val.name;
    model.value.address_post_code = val.postcode;
  }
}
</script>

<template>
  <div :class="props.addressClass">
    <ProvinceInput
      v-model="model.address_province_id"
      @selected="selectedProvince"
    />
  </div>
  <div :class="props.addressClass">
    <DistrictInput
      v-model="model.address_district_id"
      @selected="selectedDistrict"
    />
  </div>
  <div :class="props.addressClass">
    <SubdistrictInput
      v-model="model.address_city_id"
      @selected="selectedLocal"
    />
  </div>
  <div :class="props.addressClass">
    <PostcodeInput v-model="model.address_post_code" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
