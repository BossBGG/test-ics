import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useBusinessPartnerStore = defineStore("businessPartner", () => {
  const businessPartners = ref([]);
  const businessPartner = ref({});
  const businessPartnerDetail = ref({});
  const contractAccount = ref({});
  const validateBpForm1 = ref();
  const validateBpForm2 = ref();
  const isDisabled = ref(true);

  const businessPartnerForm = ref({
    bp_no: null,
    cid: null,
    ca_no: null,
    legal_type: 1,
    passport_no: null,
    title: null,
    title_text: null,
    first_name: null,
    last_name: null,
    birth_date: null,
    death_date: null,
    gender: null,
    marital_status: null,
    nationality: "",
    tax_id: null,
    juristic_name: null,
    pea_office: null,
    mobile_no: null,
    email: null,
    tel_no: null,
    fax_no: null,
    business_type_code: "TSIC",
    business_type_sector: null,
    business_type_description: null,
    legal_form: 1,
    legal_form_description: null,
    customer_request_no: null,
    status: false,
    branch_code: "", // Ensure it starts as an empty string
  });

  const businessPartnerQuotationForm = ref({
    title: null,
    title_text: null,
    first_name: null,
    last_name: null,
    juristic_name: null,
    status: false,
  });

  async function getBusinessPartnerByRequestNo(requestNo) {
    try {
      const { data } = await axios.get(
        `business_partners/by_request_no/${requestNo}`,
      );
      return data.datas?.business_partner;
    } catch (error) {
      return {};
    }
  }

  async function updateOrCreateBusinessPartner() {
    try {
      if (businessPartner?.value?.id) {
        const { data } = await axios.patch(
          `business_partners/${businessPartner.value.id}`,
          businessPartnerForm.value,
        );
        return { data, status: true };
      } else {
        const { data } = await axios.post(
          `business_partners`,
          businessPartnerForm.value,
        );
        return { data, status: true };
      }
    } catch (error) {
      console.error("Error updating BusinessPartner:", error);
      return { status: false };
    }
  }

  async function updateNameBusinessPartner() {
    try {
      const { data } = await axios.put(
        `business_partners/update_name/${businessPartner.value.id}`,
        businessPartnerQuotationForm.value,
      );
      return { data, status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async function fetchBusinessPartnerDetailByBpNo(bp_no, ca_no = "", pea_code) {
    try {
      const { data } = await axios.get(
        `business_partners/detail/${bp_no}?caNo=${ca_no}&peaCode=${pea_code}`,
      );

      businessPartnerDetail.value = data.data;
      await setBpFormByBpDetail(true);
      await setAddressFromByBpDetail();

      return { data };
    } catch (e) {
    }
  }

  async function fetchBusinessPartnersByRequestID(requestNo) {
    try {
      const { data } = await axios.get(
        `business_partners/by_request_no/${requestNo}`,
      );
      businessPartner.value = data.datas?.business_partner;
      contractAccount.value = data.datas?.contract_account;
      return { data };
    } catch (e) {
    }
  }

  async function searchDbd() {
    try {
      const { data } = await axios.get(
        `business_partners/search-dbd/${businessPartnerForm.value.cid}`,
      );

      if (data.data) {
        const requestStore = useRequestStore();
        const addressStore = useAddressStore();
        const addressFormStore = useAddressFormStore();
        const masterDataStore = useMasterDataStore();

        const { request } = storeToRefs(requestStore);
        const { provinces } = storeToRefs(addressStore);
        const { addressIdCardForm } = storeToRefs(addressFormStore);
        const { legalForms } = storeToRefs(masterDataStore);

        // console.log(data?.data);

        const searchProvince = new RegExp(
          data.data.AddressInformations[0].Province,
          "i",
        );
        const province = provinces.value?.find((item) =>
          searchProvince.test(item.name),
        );

        const setAmpur = await addressStore.fetchDistrictsByProvinceId(
          province.id,
        );
        const searchAmpur = new RegExp(
          data.data.AddressInformations[0].Ampur,
          "i",
        );
        const ampur = setAmpur.find((item) => searchAmpur.test(item.name));

        const setTumbol = await addressStore.fetchCodesByDistrictsId(ampur.id);
        const searchTumbol = new RegExp(
          data.data.AddressInformations[0].Tumbol,
          "i",
        );
        const tumbol = setTumbol.find((item) => searchTumbol.test(item.name));

        //----------------- Top Info ---------------------------------------------------------------------------

        businessPartnerForm.value.juristic_name =
          data.data.JuristicName_TH ?? "";
        businessPartnerForm.value.tax_id = "";
        businessPartnerForm.value.branch_code = "";
        businessPartnerForm.value.business_type_code = "TSIC";
        businessPartnerForm.value.legal_form = 1;
        businessPartnerForm.value.business_type_sector = "";

        //----------------- Address Main -----------------------------------------------------------------------

        addressIdCardForm.value.address_room_no =
          data.data.AddressInformations[0].RoomNo ?? "";
        addressIdCardForm.value.address_floor =
          data.data.AddressInformations[0].Floor ?? "";
        addressIdCardForm.value.address_moo =
          data.data.AddressInformations[0].Moo ?? "";

        addressIdCardForm.value.address_street =
          data.data.AddressInformations[0].Road ?? "";

        addressIdCardForm.value.address_alley =
          data.data.AddressInformations[0].Soi ?? "";

        addressIdCardForm.value.address_house_name =
          data.data.AddressInformations[0].AddressName ?? "";

        addressIdCardForm.value.address_house_no =
          data.data.AddressInformations[0].AddressNo ?? "";

        addressIdCardForm.value.address_province_id = province.id;
        addressIdCardForm.value.address_city_id = ampur.id;
        addressIdCardForm.value.address_district_id = tumbol.id;
        addressIdCardForm.value.address_post_code = tumbol.postcode;

        //----------------- User Contact Info ------------------------------------------------------------------

        businessPartnerForm.value.tel_no =
          request.value?.requests?.tel_no ?? "";
        businessPartnerForm.value.mobile_no =
          request.value?.requests?.mobile_no ?? "";
        businessPartnerForm.value.email = request.value?.requests?.email ?? "";

        // const phoneNew = data.data.AddressInformations[0].Phone?.replace(
        //   /[\s-]/g,
        //   "",
        // );

        // if (phoneNew?.length == 9) {
        //   businessPartnerForm.value.tel_no =
        //     phoneNew ?? request.value?.requests?.tel_no;
        // } else {
        //   businessPartnerForm.value.mobile_no =
        //     phoneNew ?? request.value?.requests?.mobile_no;
        // }

        // businessPartnerForm.value.email =
        //   data.data.AddressInformations[0].Email ??
        //   request.value?.requests?.email;

        //------------------------------------------------------------------------------------------------------
        return data;
      }

      return data;
    } catch (e) {
    }
  }
  async function readIdCard(ip) {
    try {
      const { data } = await axios.post(`business_partners/read-idcard`, {
        ip,
      });
      return { data, status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async function copyFields(source) {
    if (source) {
      businessPartnerForm.value = await { ...businessPartnerForm.value, ...source }
      // businessPartnerForm.value.business_type_code = source.business_type_code;
      // for (const key in source) {
      //   if (Object.prototype.hasOwnProperty.call(source, key)) {
      //     businessPartnerForm.value[key] = await source[key];
      //   }
      // }
    }
  }

  function setBpFormByBpDetail(isInit = false) {
    if (businessPartnerDetail.value.identityNo) {
      switch (businessPartnerDetail.value.customerType) {
        case "thai":
          if (isInit) {
            if (businessPartnerDetail.value.nationality == "TH") {
              businessPartnerForm.value.legal_type = 1;
            } else {
              businessPartnerForm.value.legal_type = 2;
            }
          }
          businessPartnerForm.value.cid =
            businessPartnerDetail.value.identityNo;
          break;
        case "juristic":
          if (isInit) {
            if (businessPartnerDetail.value.business_partner_type == 4) {
              businessPartnerForm.value.legal_type = 4;
            } else {
              businessPartnerForm.value.legal_type = 3;
            }
          }
          businessPartnerForm.value.cid =
            businessPartnerDetail.value.identityNo;
          break;
      }
      businessPartnerForm.value.bp_no = businessPartnerDetail.value.bpNo;
      businessPartnerForm.value.ca_no = businessPartnerDetail.value.caNo;
      businessPartnerForm.value.title_text = businessPartnerDetail.value.title;
      businessPartnerForm.value.first_name =
        businessPartnerDetail.value.firstName;
      businessPartnerForm.value.last_name =
        businessPartnerDetail.value.lastName;
      businessPartnerForm.value.birth_date =
        businessPartnerDetail.value.birthDate;
      businessPartnerForm.value.gender = businessPartnerDetail.value.sex;
      businessPartnerForm.value.marital_status =
        businessPartnerDetail.value.martialStatus;
      businessPartnerForm.value.nationality =
        businessPartnerDetail.value.nationality;
      businessPartnerForm.value.tax_id = businessPartnerDetail.value.taxNo;
      businessPartnerForm.value.juristic_name =
        businessPartnerDetail.value.corporateName;
      businessPartnerForm.value.branch_code =
        businessPartnerDetail.value.branch;
      businessPartnerForm.value.mobile_no = businessPartnerDetail.value.mobile;
      businessPartnerForm.value.email = businessPartnerDetail.value.email;
      businessPartnerForm.value.tel_no = businessPartnerDetail.value.telephone;
      businessPartnerForm.value.fax_no = businessPartnerDetail.value.fax;
      businessPartnerForm.value.business_type_id = null;
      businessPartnerForm.value.business_type_code =
        businessPartnerDetail.value.businessType ?? "TSIC";
      businessPartnerForm.value.business_type_sector =
        businessPartnerDetail.value.businessTypeCode;
      businessPartnerForm.value.business_type_description =
        businessPartnerDetail.value.businessTypeText;
      businessPartnerForm.value.legal_form =
        businessPartnerDetail.value.legalForm || 1;
    }
  }

  function setAddressFromByBpDetail() {
    const addressFormStore = useAddressFormStore();
    const { addressIdCardForm, addressRequestForm } =
      storeToRefs(addressFormStore);

    if (businessPartnerDetail.value?.bpAddress?.postCode) {
      addressIdCardForm.value.address_room_no =
        businessPartnerDetail.value.bpAddress.roomNo;
      addressIdCardForm.value.address_floor =
        businessPartnerDetail.value.bpAddress.floor;
      addressIdCardForm.value.address_house_name =
        businessPartnerDetail.value.bpAddress.houseName;
      addressIdCardForm.value.address_house_no =
        businessPartnerDetail.value.bpAddress.houseNo;
      addressIdCardForm.value.address_house_id =
        businessPartnerDetail.value.bpAddress.houseId;
      addressIdCardForm.value.address_moo =
        businessPartnerDetail.value.bpAddress.villageNo;
      addressIdCardForm.value.address_lane =
        businessPartnerDetail.value.bpAddress.lane;
      addressIdCardForm.value.address_alley =
        businessPartnerDetail.value.bpAddress.alley;
      addressIdCardForm.value.address_district_id =
        businessPartnerDetail.value.bpAddress.subDistrictId;
      addressIdCardForm.value.address_district =
        businessPartnerDetail.value.bpAddress.subDistrict;
      addressIdCardForm.value.address_city_id =
        businessPartnerDetail.value.bpAddress.districtId;
      addressIdCardForm.value.address_city =
        businessPartnerDetail.value.bpAddress.district;
      addressIdCardForm.value.address_province_id =
        businessPartnerDetail.value.bpAddress.provinceId;
      addressIdCardForm.value.address_province =
        businessPartnerDetail.value.bpAddress.province;
      addressIdCardForm.value.address_post_code =
        businessPartnerDetail.value.bpAddress.postCode;
    }

    if (businessPartnerDetail.value.address?.postCode) {
      addressRequestForm.value.address_room_no =
        businessPartnerDetail.value.address.roomNo;
      addressRequestForm.value.address_floor =
        businessPartnerDetail.value.address.floor;
      addressRequestForm.value.address_house_name =
        businessPartnerDetail.value.address.houseName;
      addressRequestForm.value.address_house_no =
        businessPartnerDetail.value.address.houseNo;
      addressRequestForm.value.address_house_id =
        businessPartnerDetail.value.address.houseId;
      addressRequestForm.value.address_moo =
        businessPartnerDetail.value.address.villageNo;
      addressRequestForm.value.address_lane =
        businessPartnerDetail.value.address.lane;
      addressRequestForm.value.address_alley =
        businessPartnerDetail.value.address.alley;
      addressRequestForm.value.address_district_id =
        businessPartnerDetail.value.address.subDistrictId;
      addressRequestForm.value.address_district =
        businessPartnerDetail.value.address.subDistrict;
      addressRequestForm.value.address_city_id =
        businessPartnerDetail.value.address.districtId;
      addressRequestForm.value.address_city =
        businessPartnerDetail.value.address.district;
      addressRequestForm.value.address_province_id =
        businessPartnerDetail.value.address.provinceId;
      addressRequestForm.value.address_province =
        businessPartnerDetail.value.address.province;
      addressRequestForm.value.address_post_code =
        businessPartnerDetail.value.address.postCode;
    }
  }

  function clearBpFormInformation() {
    businessPartnerForm.value.cid = null;
    businessPartnerForm.value.passport_no = null;
    // businessPartnerForm.value.title = null;
    businessPartnerForm.value.title_text = null;
    businessPartnerForm.value.first_name = null;
    businessPartnerForm.value.last_name = null;
    businessPartnerForm.value.birth_date = null;
    businessPartnerForm.value.gender = null;
    businessPartnerForm.value.marital_status = null;
    businessPartnerForm.value.nationality = "";
    businessPartnerForm.value.tax_id = null;
    businessPartnerForm.value.juristic_name = null;
    businessPartnerForm.value.branch_code = null;
    businessPartnerForm.value.business_type_code = "TSIC";
    businessPartnerForm.value.business_type_sector = null;
    businessPartnerForm.value.business_type_description = null;
    businessPartnerForm.value.legal_form = 1;
  }

  const isInitiallySet = ref(false);  // ✅ Track if backend prefilled value
  const isInitialAlpha = ref(false);  // ✅ Track if the initial value contains letters
  const hasCheckedInitialValue = ref(false); // ✅ Prevent re-checking

    // ✅ Function to check the initial value once
    const checkInitialValue = () => {
      if (hasCheckedInitialValue.value) return; // ✅ Skip if already checked
  
      const initialCode = businessPartnerForm.value.branch_code;
  
      if (initialCode && [4, 5].includes(initialCode.length)) {
        isInitiallySet.value = true; // ✅ Lock input if prefilled
        isInitialAlpha.value = true;
      }
      
      hasCheckedInitialValue.value = true; // ✅ Prevent future re-checks
    };
  
    // ✅ Computed property to lock input only if prefilled
    const shouldDisableInput = computed(() => {
      return isInitiallySet.value;
    });
  

  // ✅ Best Approach: Computed Property for `branch_code`
  const branchCode = computed({
    get: () => businessPartnerForm.value.branch_code ?? null, // Returns `null` if `branch_code` is undefined
    set: (val) => {
      businessPartnerForm.value.branch_code = val; // Updates `branch_code` dynamically
    }
  });


  return {
    businessPartners: computed(() => businessPartners.value),
    businessPartner: computed(() => businessPartner.value),
    businessPartnerDetail: computed(() => businessPartnerDetail.value),
    contractAccount: computed(() => contractAccount.value),
    
    businessPartnerQuotationForm,
    businessPartnerForm,
    validateBpForm1,
    validateBpForm2,
    isDisabled,
  

    shouldDisableInput, // ✅ Expose computed disable condition
    branchCode,
    isInitialAlpha,
    checkInitialValue,

    getBusinessPartnerByRequestNo,
    fetchBusinessPartnersByRequestID,
    fetchBusinessPartnerDetailByBpNo,
    searchDbd,
    readIdCard,
    updateOrCreateBusinessPartner,
    updateNameBusinessPartner,
    copyFields,
    setBpFormByBpDetail,
    clearBpFormInformation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useBusinessPartnerStore as any, import.meta.hot),
  );
}
