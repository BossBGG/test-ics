export function mapOptions(name, text) {
  const masterDataStore = useMasterDataStore();
  const { genders, nameTitles, nationalities } = storeToRefs(masterDataStore);

  const cleanText = (str) => str ? str.trim().toLowerCase() : '';

  let result = {};

  const cleanedText = cleanText(text);

  switch (name) {
    case "gender":
      result = genders.value.find(item => cleanText(item.gender_name) === cleanedText);
      // console.log('gender result: ', result);
      break;
    case "title":
      result = nameTitles.value.find(item => cleanText(item.title_name) === cleanedText);
      // console.log('title result: ', result);
      break;
    case "nationality":
      result = nationalities.value.find(item => cleanText(item.nameShort) === cleanedText);
      // console.log('nationality result: ', result);
      break;
    default:
      result = null;
  }

  return result;
};

export async function mapAddressIdCard(provinceName, ampurName, tambonName) {
  const requestStore = useRequestStore();
  const addressStore = useAddressStore();
  const addressFormStore = useAddressFormStore();
  const masterDataStore = useMasterDataStore();

  const { request } = storeToRefs(requestStore);
  const { provinces } = storeToRefs(addressStore);
  const { addressIdCardForm } = storeToRefs(addressFormStore);


  const searchProvince = new RegExp(
    provinceName,
    "i",
  );
  const province = provinces.value?.find((item) =>
    searchProvince.test(item.name),
  );

  const setAmpur = await addressStore.fetchDistrictsByProvinceId(
    province.id,
  );
  const searchAmpur = new RegExp(
    ampurName,
    "i",
  );
  const ampur = setAmpur.find((item) => searchAmpur.test(item.name));

  const setTumbol = await addressStore.fetchCodesByDistrictsId(ampur.id);
  const searchTumbol = new RegExp(
    tambonName,
    "i",
  );
  const tumbol = setTumbol.find((item) => searchTumbol.test(item.name));

  addressIdCardForm.value.address_province_id = province.id;
  addressIdCardForm.value.address_city_id = ampur.id;
  addressIdCardForm.value.address_district_id = tumbol.id;
  addressIdCardForm.value.address_post_code = tumbol.postcode;

  return true
}
