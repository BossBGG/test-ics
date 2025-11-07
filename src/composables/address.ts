export function autoAddressInformationForm() {
  const route = useRoute();

  const isRequestPage = hasSameWord(route.name, "request");
  const isSurveyPage = hasSameWord(route.name, "survey");

  async function autoForm(subdistrictId) {
    const surveyStore = useSurveyStore();
    const { survey, surveyForm, isDisabled } = storeToRefs(surveyStore);

    const addressStore = useAddressStore();
    const { provinces, addressInfoByDistrict } = storeToRefs(addressStore);

    const addressFormStore = useAddressFormStore();
    const { addressInformationForm, addressRequestForm } =
      storeToRefs(addressFormStore);

    await addressStore.getInfoByDistrict(subdistrictId);
    // console.log('newAddress: ', addressInfoByDistrict.value);

    const addressFields = {
      address_province_id: addressInfoByDistrict.value?.provinceId,
      address_city_id: addressInfoByDistrict.value?.cityId,
      address_district_id: addressInfoByDistrict.value?.districtId,
      address_post_code: addressInfoByDistrict.value?.postCode,
    };

    if (isRequestPage) {
      addressInformationForm.value = {
        ...addressInformationForm.value,
        ...addressFields,
      };
    }

    if (isSurveyPage) {
      surveyForm.value.same_requesting_address = false;
      addressRequestForm.value = {
        ...addressRequestForm.value,
        ...addressFields,
      };
    }
  }

  return { isRequestPage, isSurveyPage, autoForm };
}

export const masterOffice =
  'การไฟฟ้าส่วนภูมิภาค ถนนงามวงศ์วาน ลาดยาว จตุจักร กรุงเทพมหานคร 10900"';
