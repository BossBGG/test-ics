import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useSurveyStore = defineStore("survey", () => {
  const request_id = ref("");
  const isDisabled = ref(true);
  const surveyResult = ref({});
  const survey = ref({});
  const survey_logs = ref([]);
  const survey_men = ref([]);
  const surveyForm = ref({
    tel_no: null,
    fax_no: null,
    mobile_no: null,
    email: null,
    latitude: null,
    longitude: null,
    same_requesting_address: true,
    status: false,
    is_attend_survey: null
  });
  const surveyLogForm = ref({
    complete: true,
    detail: null,
    survey_by: null,
    appointment_datetime: null,
    log_status: false,
  });
  const validateSurveyForm = ref();

  function setRequestID(uid) {
    request_id.value = uid;
  }

  async function getSurvey() {
    try {
      const { data } = await axios.get(`surveys/${request_id.value}`);
      return data.survey;
    } catch (e) {
    }

    return false;
  }

  async function getSurveyLog() {
    try {
      const { data } = await axios.get(`surveys/${request_id.value}/log`);
      return data.result;
    } catch (e) {
    }

    return false;
  }
  async function fetchSurvey() {
    try {
      const { data } = await axios.get(`surveys/${request_id.value}`);
      survey.value = data.survey;
      surveyResult.value = data;

      return { data };
    } catch (e) {
    }

    return false;
  }

  async function fetchSurveyLog() {
    try {
      const { data } = await axios.get(`surveys/${request_id.value}/log`);
      survey_logs.value = data.result;
      return { data };
    } catch (e) {
    }

    return false;
  }

  async function fetchSurveyMen() {
    try {
      const { data } = await axios.get(`master/users`);
      survey_men.value = data.data;
      return { data };
    } catch (e) {
    }

    return false;
  }

  async function updateOrCreateSurvey() {
    try {
      surveyForm.value = await { ...surveyForm.value, ...surveyLogForm.value }
      // const twoDigit = (digit) => (digit > 9 ? digit : "0" + digit);
      // const [month, day, year] = new Date(surveyForm.value.appointment_datetime)
      //   .toLocaleDateString()
      //   .split("/")
      //   .map((e) => twoDigit(e));
      // surveyForm.value.appointment_datetime = `${year}-${month}-${day}T00:00:00`;

      if (survey?.value?.id) {
        const { data } = await axios.patch(
          `surveys/${request_id.value}`,
          surveyForm.value,
        );
        return { data };
      } else {
        const { data } = await axios.post(
          `surveys/${request_id.value}`,
          surveyForm.value,
        );
        return { data };
      }
    } catch (e) {
    }
  }
  async function updateSurveyLog() {
    try {
      // const twoDigit = (digit) => (digit > 9 ? digit : "0" + digit);
      // const [month, day, year] = new Date(
      //   surveyLogForm.value.appointment_datetime,
      // )
      //   .toLocaleDateString()
      //   .split("/")
      //   .map((e) => twoDigit(e));
      // surveyLogForm.value.appointment_datetime = `${year}-${month}-${day}T00:00:00`;

      const { data } = await axios.patch(
        `surveys/${request_id.value}/log`,
        surveyLogForm.value,
      );

      return { data };
    } catch (e) {
    }
  }

  async function setSurveyForm() {
    if (surveyResult.value.survey?.id) {
      surveyForm.value.tel_no = surveyResult.value.survey?.tel_no;
      surveyForm.value.fax_no = surveyResult.value.survey?.fax_no;
      surveyForm.value.mobile_no = surveyResult.value.survey?.mobile_no;
      surveyForm.value.email = surveyResult.value.survey?.email;
      surveyLogForm.value.survey_by = surveyResult.value.survey?.survey_by;
      surveyLogForm.value.appointment_datetime =
        surveyResult.value.survey?.appointment_datetime;
      surveyForm.value.latitude = surveyResult.value.survey?.latitude;
      surveyForm.value.longitude = surveyResult.value.survey?.longitude;
      surveyForm.value.same_requesting_address =
        surveyResult.value.same_requesting_address;
      surveyForm.value.is_attend_survey = surveyResult.value.survey?.is_attend_survey;
    } else {
      const businnessStore = useBusinessPartnerStore();
      const { businessPartner } = storeToRefs(businnessStore);
      surveyForm.value.tel_no = businessPartner.value?.tel_no;
      surveyForm.value.fax_no = businessPartner.value?.fax_no;
      surveyForm.value.mobile_no = businessPartner.value?.mobile_no;
      surveyForm.value.email = businessPartner.value?.email;
    }

    // const addressStore = useAddressStore();
    // const { addressRequest, addressSurvey } = storeToRefs(addressStore);
    // const addressFormStore = useAddressFormStore();
    // const { addressSurveyForm } = storeToRefs(addressFormStore);

    // const _addressRequest = await addressStore.getAddressByRequest(
    //   request_id.value,
    //   2,
    // );
    // const _addressSurvey = await addressStore.getAddressByRequest(
    //   request_id.value,
    //   5,
    // );
    // addressRequest.value = _addressRequest.datas?.addresses?.length
    //   ? _addressRequest.datas?.addresses[0]
    //   : {};
    // addressSurvey.value = _addressSurvey.datas?.addresses?.length
    //   ? _addressSurvey.datas?.addresses[0]
    //   : {};

    // if (surveyResult.value.address?.id) {
    //   addressSurveyForm.value.address_room_no =
    //     surveyResult.value.address.address_room_no;
    //   addressSurveyForm.value.address_floor =
    //     surveyResult.value.address.address_floor;
    //   addressSurveyForm.value.address_house_name =
    //     surveyResult.value.address.address_house_name;
    //   addressSurveyForm.value.address_house_no =
    //     surveyResult.value.address.address_house_no;
    //   addressSurveyForm.value.address_house_id =
    //     surveyResult.value.address.address_house_id;
    //   addressSurveyForm.value.address_moo =
    //     surveyResult.value.address.address_moo;
    //   addressSurveyForm.value.address_street =
    //     surveyResult.value.address.address_street;
    //   addressSurveyForm.value.address_lane =
    //     surveyResult.value.address.address_lane;
    //   addressSurveyForm.value.address_alley =
    //     surveyResult.value.address.address_alley;
    //   addressSurveyForm.value.address_district_id =
    //     surveyResult.value.address.address_district_id;
    //   addressSurveyForm.value.address_district =
    //     surveyResult.value.address.address_district;
    //   addressSurveyForm.value.address_city_id =
    //     surveyResult.value.address.address_city_id;
    //   addressSurveyForm.value.address_city =
    //     surveyResult.value.address.address_city;
    //   addressSurveyForm.value.address_province_id =
    //     surveyResult.value.address.address_province_id;
    //   addressSurveyForm.value.address_province =
    //     surveyResult.value.address.address_province;
    //   addressSurveyForm.value.address_post_code =
    //     surveyResult.value.address.address_post_code;
    //   addressSurveyForm.value.address_service_type =
    //     surveyResult.value.address.address_service_type;
    // }
  }

  return {
    // | ------------------------------
    // | REF
    // | ------------------------------
    request_id: computed(() => request_id.value),
    survey: computed(() => survey.value),
    survey_logs: computed(() => survey_logs.value),
    survey_men: computed(() => survey_men.value),
    surveyForm,
    surveyLogForm,
    validateSurveyForm,
    isDisabled,

    // | ------------------------------
    // | FUNCTION
    // | ------------------------------
    getSurvey,
    getSurveyLog,
    fetchSurvey,
    fetchSurveyLog,
    fetchSurveyMen,
    updateOrCreateSurvey,
    updateSurveyLog,
    setRequestID,
    setSurveyForm,
  };
});
