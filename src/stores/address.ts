import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useAddressStore = defineStore("address", () => {
  // const requests = ref({});
  const provinces = ref([]);
  const peaProvinces = ref([]);
  const districts = ref([]);
  const codes = ref([]);
  const addressesByRequestId = ref([]);
  const addressIdCard = ref({});
  const addressRequest = ref({});
  const addressSendDocument = ref({});
  const addressBilling = ref({});
  const addressSurvey = ref({});
  const addressInfoByDistrict = ref({});

  async function fetchProvinces(group = "") {
    try {
      const requestStore = useRequestStore();
      const { nowRequestCode } = storeToRefs(requestStore);
      if (!group || nowRequestCode.value === "S332") {
        await checkLoad("provinces", async () => {
          const { data } = await axios.get(`addresses/provinces`);
          provinces.value = data.datas;
        });
      } else {
        await checkLoad("peaProvinces", async () => {
          const { data } = await axios.get(
            `addresses/provinces?group=${group}`,
          );
          peaProvinces.value = data.datas;
        });
      }
    } catch {
      return;
    }
  }

  async function fetchDistrictsByProvinceId(provinceId) {
    const { data } = await axios.get(
      `addresses/districts_by_province/${provinceId}`,
    );
    return data.datas;
  }

  async function fetchCodesByDistrictsId(districtId) {
    const { data } = await axios.get(
      `addresses/postcodes_by_district/${districtId}`,
    );
    return data.datas;
  }

  async function getAddressByRequest(request_id, type = null) {
    try {
      if (type) {
        const { data } = await axios.get(
          `addresses/request/${request_id}/${type}`,
        );
        addressesByRequestId.value = data.datas?.addresses ?? [];
        setAddressByType(request_id);
        return data;
      } else {
        const { data } = await axios.get(`addresses/request/${request_id}`);
        addressesByRequestId.value = data.datas?.addresses ?? [];
        setAddressByType(request_id);
        return data;
      }
    } catch {
      return;
    }
  }

  function setAddressByType(requestId) {
    addressIdCard.value =
      addressesByRequestId.value?.find(
        (item) => item?.address_service_type == 1,
      ) ?? {};
    addressRequest.value =
      addressesByRequestId.value?.find(
        (item) => item?.address_service_type == 2,
      ) ?? {};
    addressSendDocument.value =
      addressesByRequestId.value?.find(
        (item) => item?.address_service_type == 3,
      ) ?? {};
    addressBilling.value =
      addressesByRequestId.value?.find(
        (item) => item?.address_service_type == 4,
      ) ?? {};
    addressSurvey.value =
      addressesByRequestId.value?.find(
        (item) => item?.address_service_type == 5,
      ) ?? {};

    const addressFormStore = useAddressFormStore();
    const {
      addressIdCardForm,
      addressRequestForm,
      addressSendDocumentForm,
      addressBillingForm,
      addressSurveyForm,
    } = storeToRefs(addressFormStore);

    addressIdCardForm.value.request_id = requestId;
    addressRequestForm.value.request_id = requestId;
    addressSendDocumentForm.value.request_id = requestId;
    addressBillingForm.value.request_id = requestId;
    addressSurveyForm.value.request_id = requestId;

    if (addressIdCard.value?.id) {
      for (const key in addressIdCard.value) {
        if (Object.prototype.hasOwnProperty.call(addressIdCard.value, key)) {
          addressIdCardForm.value[key] = addressIdCard.value[key];
        }
      }
    }
    if (addressRequest.value?.id) {
      for (const key in addressRequest.value) {
        if (Object.prototype.hasOwnProperty.call(addressRequest.value, key)) {
          addressRequestForm.value[key] = addressRequest.value[key];
        }
      }
    }
    if (addressSendDocument.value?.id) {
      for (const key in addressSendDocument.value) {
        if (
          Object.prototype.hasOwnProperty.call(addressSendDocument.value, key)
        ) {
          addressSendDocumentForm.value[key] = addressSendDocument.value[key];
        }
      }
    }
    if (addressBilling.value?.id) {
      for (const key in addressBilling.value) {
        if (Object.prototype.hasOwnProperty.call(addressBilling.value, key)) {
          addressBillingForm.value[key] = addressBilling.value[key];
        }
      }
    }
    if (addressSurvey.value?.id) {
      for (const key in addressSurvey.value) {
        if (Object.prototype.hasOwnProperty.call(addressSurvey.value, key)) {
          addressSurveyForm.value[key] = addressSurvey.value[key];
        }
      }
    }
  }

  async function getInfoByDistrict(districtId) {
    const { data } = await axios.get(
      `addresses/info_by_district/${districtId}`,
    );
    addressInfoByDistrict.value = data.data;
    return data;
  }

  return {
    provinces: computed(() => provinces.value),
    peaProvinces: computed(() => peaProvinces.value),
    districts: computed(() => districts.value),
    codes: computed(() => codes.value),
    addressesByRequestId: computed(() => addressesByRequestId.value),
    addressIdCard: computed(() => addressIdCard.value),
    addressRequest: computed(() => addressRequest.value),
    addressSendDocument: computed(() => addressSendDocument.value),
    addressBilling: computed(() => addressBilling.value),
    addressSurvey: computed(() => addressSurvey.value),
    addressInfoByDistrict: computed(() => addressInfoByDistrict.value),
    fetchProvinces,
    fetchDistrictsByProvinceId,
    fetchCodesByDistrictsId,
    getAddressByRequest,
    getInfoByDistrict,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useAddressStore as any, import.meta.hot),
  );
}
