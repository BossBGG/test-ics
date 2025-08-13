import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useAddressFormStore = defineStore("addressForm", () => {
  const addressInformationForm = ref({
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
  });
  const addressIdCardForm = ref({
    bp_no: null,
    cid: null,
    address_room_no: null,
    address_floor: null,
    address_house_name: null,
    address_house_no: null,
    address_house_id: null,
    address_moo: null,
    address_street: null,
    address_lane: null,
    address_alley: null,
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
    address_service_type: 1,
    request_id: null,
    status: false,
  });
  const addressRequestForm = ref({
    bp_no: null,
    cid: null,
    address_room_no: null,
    address_floor: null,
    address_house_name: null,
    address_house_no: null,
    address_house_id: null,
    address_moo: null,
    address_street: null,
    address_lane: null,
    address_alley: null,
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
    address_service_type: 2,
    request_id: null,
    status: false,
    same_address: false,
  });
  const addressSendDocumentForm = ref({
    bp_no: null,
    cid: null,
    address_room_no: null,
    address_floor: null,
    address_house_name: null,
    address_house_no: null,
    address_house_id: null,
    address_moo: null,
    address_street: null,
    address_lane: null,
    address_alley: null,
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
    address_service_type: 3,
    request_id: null,
    status: false,
    same_address: false,
  });
  const addressBillingForm = ref({
    bp_no: null,
    cid: null,
    address_room_no: null,
    address_floor: null,
    address_house_name: null,
    address_house_no: null,
    address_house_id: null,
    address_moo: null,
    address_street: null,
    address_lane: null,
    address_alley: null,
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
    address_service_type: 4,
    request_id: null,
    status: false,
    same_address: false,
  });
  const addressSurveyForm = ref({
    bp_no: null,
    cid: null,
    address_room_no: null,
    address_floor: null,
    address_house_name: null,
    address_house_no: null,
    address_house_id: null,
    address_moo: null,
    address_street: null,
    address_lane: null,
    address_alley: null,
    address_district_id: null,
    address_district: null,
    address_city_id: null,
    address_city: null,
    address_province_id: null,
    address_province: null,
    address_post_code: null,
    address_service_type: 5,
    request_id: null,
    status: false,
    same_address: false,
  });

  async function fetchAddressByIdCardNumber() {
    // const { data } = await axios.get(`xxx`)
    // articles.value = data

    //-----------------------------------------

    addressIdCardForm.value.address_room_no = "411/52";
    addressIdCardForm.value.address_floor = "23";
    addressIdCardForm.value.address_district_id = "13301";
    addressIdCardForm.value.address_district = "ช้างเผือก";
    addressIdCardForm.value.address_city_id = "5501";
    addressIdCardForm.value.address_city = "เมืองเชียงใหม่";
    addressIdCardForm.value.address_province_id = "55";
    addressIdCardForm.value.address_province = "เชียงใหม่";
    addressIdCardForm.value.address_post_code = "50300";
  }

  async function createAddress(form) {
    try {
      const { data } = await axios.post(`/addresses/insert`, form);
      return { data, status: true };
    } catch (error) {
      console.error("Error Create Address:", error);
      return { status: false };
    }
  }

  async function updateAddress(id, form) {
    try {
      const { data } = await axios.patch(`/addresses/update/${id}`, form);
      return { data, status: true };
    } catch (error) {
      console.error("Error Create Address:", error);
      return { status: false };
    }
  }

  async function updateOrCreateAddress(id = null, form) {
    try {
      if (id) {
        const { data } = await axios.patch(`/addresses/update/${id}`, form);
        return { data, status: true };
      } else {
        const { data } = await axios.post(`/addresses/insert`, form);
        return { data, status: true };
      }
    } catch (error) {
      console.error("Error Create Address:", error);
      return { status: false };
    }
  }

  async function updateOrCreateManyAddress(form) {
    try {
      const hasId = form.find((item) => item.id);
      if (hasId?.id) {
        const { data } = await axios.post(`/addresses/update_list`, form);
        return { data, status: true };
      } else {
        const { data } = await axios.post(`/addresses/insert_list`, form);
        return { data, status: true };
      }
    } catch (error) {
      console.error("Error Create Address:", error);
      return { status: false };
    }
  }


  return {
    addressInformationForm,
    addressIdCardForm,
    addressRequestForm,
    addressSendDocumentForm,
    addressBillingForm,
    addressSurveyForm,

    fetchAddressByIdCardNumber,
    createAddress,
    updateAddress,
    updateOrCreateAddress,
    updateOrCreateManyAddress,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAddressFormStore as any, import.meta.hot),
  );
}
