import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export interface ReqeustS316Picture{
  id: string
  is_del: boolean
  picture_url: string
  request_id: string
  seq: number
  create_by: string
  create_date: string
  update_by: string | null
  update_date: string | null
}

export interface RequestS316KWReservation {
  id: string
  request_id: string
  ref_generator_size_id: number
  reservation_date: string
  pea_name: string
  pea_code: string
  distance: number
  tel_number: string | null
  lat: number | null
  lon: number | null
  order?: number
  is_del?: boolean
}

export const useRequestStore = defineStore("request", () => {
  // const requests = ref({});
  const request = ref({});
  const accessPage = ref({});
  const contact_logs = ref([]);
  const activeServiceName = ref("");
  const showCancelRequestModal = ref(false);
  const showTransferRequestModal = ref(false);
  const requestTransformerForm = ref([]);
  const validateRequestForm = ref();
  const validateStatusCustomerForm = ref();
  const validateApplicationForm = ref();
  const validateTimeStatusForm = ref();
  const validateTimeStatusFormText = ref(false);
  const validateCancelForm = ref();
  const propsDateOG = ref();
  const validateInModalCancel = ref();
  const setRequestCode = ref("");
  const nowRequestCode = ref("");
  const isNewCitySameOffice = ref(false);
  const isSurvey = ref(false);
  const transferRequest = ref("");
  const serviceData = ref({});

  const nowServiceID = computed(() => request.value.requests.id);

  const requestCancelForm = ref({
    remark: "",
  });

  const requestForm = ref({
    service_code: "",
    first_name: "",
    last_name: "",
    mobile_no: "",
    email: "",
    address: "",
    address_province: "",
    address_city: "",
    address_district: "",
    address_post_code: "",
    channel: 0,
    pea_office: "",
    latitude: null,
    longitude: null,
  });

  const requestServiceForm = ref({
    ca_no: null,
    equipment_type: null,
    qty: null,
    files: null,
    morning_flag: false,
    afternoon_flag: false,
    detail: null,
    request_service: null,
    request_service_type: null,
    transformer_size: null,
    equipment_type_id: null,
    rental_startdate: null,
    rental_enddate: null,
    days: null,
    kw_size: null,
    business_type_id: null,
    equipment_id: null,
    amps_size: null,
    size_install: null,
    request_time: null,
    equipment_no: null,
    place_form: null,
    wire_form: null,
    qty_ev: null,
    package_service: null,
    package_request: null,
    renewable_type: null,
    renewable_source: [],
    renewable_source_other: {},
    year: null,
    transformer_serial: null,
    transformer_qty: null,
    transformer_voltage: null,
    solar_type: null,
    brand_id: null,
    customer_type: null,
    government_objective: "",
    document_file: null,
    requests_serviceS316_kw_size: [],
    requests_serviceS316_picture: [] as ReqeustS316Picture[],
    start_time: "",
    end_time: "",
    rental_starttime_endtime: null,
    kw_size_reservation: [] as RequestS316KWReservation[],
    kw_size_reservation_add_new: [] as RequestS316KWReservation[],
  });

  async function fetchGetRequestsByUID(uid, getData = false) {
    try {
      const { data } = await axios.get(`requests/${uid}`, {
        // baseURL: "http://localhost:3000/api/",
      })
      if (getData) {
        return data.datas;
      }

      request.value = data.datas;
      activeServiceName.value = data.datas.service_code;

      const apiRequests = request.value.requests;
      const contactLogs = request.value.contact_Logs;
      // console.log("contactLogs: ", contactLogs);

      if (apiRequests?.status == "R" || apiRequests?.status == "E") {
        const { data: steps } = await axios.get(`requests/${uid}/checkStep`);
        if (steps?.result) {
          accessPage.value = steps;
        }
      }

      requestForm.value.service_code = data.datas.service_code;
      setRequestCode.value = data.datas.service_code;
      isSurvey.value = data.datas.is_survey;
      requestForm.value.status = apiRequests.status;

      requestForm.value.first_name = apiRequests.first_name;
      requestForm.value.last_name = apiRequests.last_name;
      requestForm.value.mobile_no = apiRequests.mobile_no;
      requestForm.value.email = apiRequests.email;
      requestForm.value.address = apiRequests.address;
      requestForm.value.address_province = apiRequests.address_province;
      requestForm.value.address_city = apiRequests.address_city;
      requestForm.value.address_district = apiRequests.address_district;
      requestForm.value.address_post_code = apiRequests.address_post_code;
      requestForm.value.channel = apiRequests.channel;
      requestForm.value.pea_office = apiRequests.pea_office;
      requestForm.value.latitude = apiRequests.latitude;
      requestForm.value.longitude = apiRequests.longitude;

      const addressFormStore = useAddressFormStore();
      const { addressInformationForm } = storeToRefs(addressFormStore);
      addressInformationForm.value.address_province_id
        = apiRequests.address_province;
      addressInformationForm.value.address_city_id = apiRequests.address_city;
      addressInformationForm.value.address_district_id
        = apiRequests.address_district;
      addressInformationForm.value.address_post_code
        = apiRequests.address_post_code;

      requestTransformerForm.value = data.datas?.transformers;

      for (let i = 301; i <= 399; i++) {
        const propertyName = `requests_serviceS${i}`;
        if (propertyName in request.value)
          copyFields(request.value[propertyName], requestServiceForm.value);
      }

      if (request.value?.requests_serviceS316_kw_size) {
        requestServiceForm.value.requests_serviceS316_kw_size = [...request.value?.requests_serviceS316_kw_size]
      }

      if (request.value?.requests_serviceS316_picture) {
        requestServiceForm.value.requests_serviceS316_picture = [...request.value?.requests_serviceS316_picture]
      }

      if (request.value?.kw_size_reservation) {
        requestServiceForm.value.kw_size_reservation = [...request.value?.kw_size_reservation]
      }
    } catch (error) {
      return { status: false };
    }
  }

  function copyFields(source, destination) {
    for (const key in source) {
      if (key in destination)
        destination[key] = source[key];
    }
  }

  async function updateOrCreateRequestByUID(uid = false, requestData) {
    Object.keys(requestData).forEach((key) => {
      if (requestData[key] === "") {
        requestData[key] = null;
      }
    });

    // const fieldsToCheck = ["qty", "transformer_size", "kw_size", "amps_size"];

    // fieldsToCheck.forEach(field => {
    //   if (requestData[field] === "") {
    //     requestData[field] = null;
    //   }
    // });

    try {
      if (uid) {
        const { data } = await axios.patch(`/requests/${uid}`, requestData);
        await fetchGetRequestsByUID(uid);
        return { data, status: true };
      } else {
        const { data } = await axios.post(`/requests`, requestData);
        await fetchGetRequestsByUID(data?.request_id);
        return { data, status: true };
      }
    } catch (error) {
      return { data: {}, status: false };
    }
  }

  async function transferRequestByUID(uid = false, formData) {
    try {
      const { data } = await axios.post(`/requests/transfer/${uid}`, formData);
      await fetchGetRequestsByUID(uid);
      return { data, status: true };
    } catch (error) {
      return { status: false };
    }
  }

  async function deleteRequest(deleteData) {
    return deleteRequestByUID(nowServiceID.value, deleteData);
  }

  async function deleteRequestByUID(uid, deleteData) {
    try {
      const { data } = await axios.delete(`/requests/${uid}`, {
        data: deleteData,
      });
      await fetchGetRequestsByUID(uid);
      return { data, status: true };
    }
    catch (error) {
      return { status: false };
    }
  }

  function setServiceData(data) {
    serviceData.value = data;
    isSurvey.value = !!data?.is_survey;
  }

  async function updateS316KWReservation(uid: string, reservationData: RequestS316KWReservation[]) {
    try {
      const { data } = await axios.patch(`/requests/kw_reservation/${uid}`, { data: reservationData });    
      return { data, status: true };
    } catch (error) {
      return { status: false };
    }
  }

  return {
    propsDateOG,
    validateRequestForm,
    validateStatusCustomerForm,
    validateApplicationForm,
    validateTimeStatusForm,
    validateTimeStatusFormText,
    validateCancelForm,
    request: computed(() => request.value),
    requests: computed(() => request.value.requests),
    contact_logs: computed(() => request.value.contact_Logs),
    nowRequestCode: computed(() => setRequestCode.value),
    serviceData: computed(() => serviceData.value),
    accessPage: computed(() => accessPage.value),
    isNewCitySameOffice,
    isSurvey,
    setRequestCode,
    requestForm,
    requestCancelForm,
    transferRequest,
    requestServiceForm,
    requestTransformerForm,
    activeServiceName,
    showCancelRequestModal,
    showTransferRequestModal,
    fetchGetRequestsByUID,
    updateOrCreateRequestByUID,
    transferRequestByUID,
    deleteRequestByUID,
    deleteRequest,
    setServiceData,
    updateS316KWReservation
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRequestStore as any, import.meta.hot),
  );
}
