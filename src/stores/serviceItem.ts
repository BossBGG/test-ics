import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export interface KWSize {
  id: string
  services_id: string
  sub_id: string
  item_name: string
  item_slug: string
  item_description: string
  option_title: string
  order: number
  is_active: boolean
  is_del: boolean
  is_other: boolean
  created_by: string
  created_date: string
  updated_by: string
  updated_date: string
}

export interface GeneratorSize {
  ref_generator_size_id: number
  ref_generator_size_kva: number
  ref_generator_size_image_type: number
  ref_generator_size_desc: string
}

export const useServiceItemStore = defineStore("serviceItem", () => {
  const requestStore = useRequestStore();
  const serviceStore = useServiceStore();
  const { nowRequestCode } = storeToRefs(requestStore);
  const { services } = storeToRefs(serviceStore);

  const nowService = ref("");

  const businessTypes = ref([]);
  const businessTypeFilters = ref([]);
  const mBusinessTypes = ref([]);
  const requestServices = ref([]);
  const requestServiceTypes = ref([]);
  const transformerBrands = ref([]);
  const transformerPhases = ref([]);
  const transformerPhasesLevel2 = ref([]);
  const transformerTypes = ref([]);
  const transformerSizes = ref([]);
  const transformerVoltages = ref([]);
  const equipments = ref([]);
  const equipmentTypes = ref([]);
  const requestTimes = ref([]);
  const wireForms = ref([]);
  const packageServices = ref([]);
  const packageRequests = ref([]);
  const renewableTypes = ref([]);
  const renewableSources = ref([]);
  const placeForms = ref([]);
  const packages = ref([]);
  const kwSizes = ref<KWSize[]>([]);
  const useMockUpApi = false;
  const solarType = ref([]);
  const solarBrandLevel2 = ref([]);
  const generators = ref<GeneratorSize[]>([]);

  async function fetchBusinessType() {
    await checkLoad("businessTypes", async () => {
      const { data } = await axios.get(`service_items/business_type`);
      businessTypes.value = data.datas;
    });
  }

  async function fetchBusinessTypeByType(type) {
    await checkLoad("businessTypeFilters", async () => {
      const { data } = await axios.get(
        `service_items/business_type?type=${type}`,
      );
      businessTypeFilters.value = data.datas;
    });
  }

  async function setBusinessTypeFilters(datas) {
    businessTypeFilters.value = datas;
  }

  async function fetchMBusinessType() {
    const { data } = await axios.get(
      `service_items/m_business_type${useMockUpApi ? "_mockup" : ""}`,
    );
    mBusinessTypes.value = data.datas;
  }

  async function fetchRequestService() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/request_service`,
    );
    requestServices.value = data.datas;
  }

  async function fetchRequestServiceType() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/request_service_type`,
    );
    requestServiceTypes.value = data.datas;
  }

  async function fetchTransformerBrand() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_brand`,
    );
    transformerBrands.value = data.datas;
  }

  async function fetchTransformerPhase() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_phase`,
    );
    transformerPhases.value = data.datas;
  }

  async function fetchTransformerPhaseLevel2(id) {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_type/${id}`,
    );
    transformerPhasesLevel2.value = data.datas;
    transformerTypes.value = data.datas;
    return data.datas;
  }

  async function fetchTransformerType() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_type`,
    );
    transformerTypes.value = data.datas;
  }

  async function fetchEquipment() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/equipment`,
    );
    equipments.value = data.datas;
  }

  async function fetchEquipmentType() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/equipment_type`,
    );
    equipmentTypes.value = data.datas;
  }

  async function fetchSolarType() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/solar_type`,
    );
    solarType.value = data.datas;
  }

  async function fetchSolarBrandLevel2(id) {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/brand_id/${id}`,
    );
    solarBrandLevel2.value = data.datas;
    return data.datas;
  }

  async function fetchRequestTime() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/request_time`,
    );
    requestTimes.value = data.datas;
  }

  async function fetchWireForm() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/wire_form`,
    );
    wireForms.value = data.datas;
  }

  async function fetchPackageService() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/package_service`,
    );
    packageServices.value = data.datas;
  }

  async function fetchPackageRequest() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/package_request`,
    );
    packageRequests.value = data.datas;
  }

  async function fetchRenewableType() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/renewable_type`,
    );
    renewableTypes.value = data.datas;
  }

  async function fetchRenewableSource() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/renewable_source`,
    );
    renewableSources.value = data.datas;
  }

  async function fetchPlaceForm() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/place_form`,
    );
    placeForms.value = data.datas;
  }

  async function fetchTransformerSize() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_size`,
    );
    transformerSizes.value = data.datas;
  }

  async function fetchTransformerVoltage() {
    const { data } = await axios.get(
      `service_items/${nowServiceID()}/transformer_voltage`,
    );
    transformerVoltages.value = data.datas;
  }

  async function fetchPackage() {
    const { data } = await axios.get(`service_items/${nowServiceID()}/package`);
    packages.value = data.datas;
  }

  async function fetchKwSize() {
    if (kwSizes.value.length > 0)
      return;
    const { data } = await axios.get(`service_items/${nowServiceID()}/kw_size`);
    kwSizes.value = data.datas;
  }

  async function fetchGeneratorSizes() {
    const { data } = await axios.get(`service_items/getgeneratorsize`, {
      // baseURL: "http://localhost:3000/api/",
    });
    generators.value = data;
  }

  return {
    businessTypes: computed(() => businessTypes.value),
    businessTypeFilters: computed(() => businessTypeFilters.value),
    mBusinessTypes: computed(() => mBusinessTypes.value),
    requestServices: computed(() => requestServices.value),
    requestServiceTypes: computed(() => requestServiceTypes.value),
    transformerBrands: computed(() => transformerBrands.value),
    transformerPhases: computed(() => transformerPhases.value),
    transformerPhasesLevel2: computed(() => transformerPhasesLevel2.value),
    transformerTypes: computed(() => transformerTypes.value),
    transformerSizes: computed(() => transformerSizes.value),
    transformerVoltages: computed(() => transformerVoltages.value),
    equipments: computed(() => equipments.value),
    equipmentTypes: computed(() => equipmentTypes.value),
    solarType: computed(() => solarType.value),
    solarBrandLevel2: computed(() => solarBrandLevel2.value),
    requestTimes: computed(() => requestTimes.value),
    wireForms: computed(() => wireForms.value),
    packageServices: computed(() => packageServices.value),
    packageRequests: computed(() => packageRequests.value),
    renewableTypes: computed(() => renewableTypes.value),
    renewableSources: computed(() => renewableSources.value),
    placeForms: computed(() => placeForms.value),
    packages: computed(() => packages.value),
    kwSizes: computed(() => kwSizes.value),
    nowService: computed(() => {
      if (!Array.isArray(services.value)) {
        console.error("services.value is not an array");
        return null;
      }

      const matchedService = services.value.find(
        (service) => service.request_code === nowRequestCode.value
      );

      return matchedService || null;
    }),
    generators: computed(() => generators.value),
    setBusinessTypeFilters,
    fetchBusinessType,
    fetchBusinessTypeByType,
    fetchMBusinessType,
    fetchRequestService,
    fetchRequestServiceType,
    fetchTransformerBrand,
    fetchTransformerPhase,
    fetchTransformerPhaseLevel2,
    fetchTransformerType,
    fetchTransformerSize,
    fetchTransformerVoltage,
    fetchEquipment,
    fetchEquipmentType,
    fetchRequestTime,
    fetchWireForm,
    fetchPackageService,
    fetchPackageRequest,
    fetchRenewableType,
    fetchRenewableSource,
    fetchPlaceForm,
    fetchPackage,
    fetchKwSize,
    fetchSolarType,
    fetchSolarBrandLevel2,
    fetchGeneratorSizes,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useServiceItemStore as any, import.meta.hot),
  );
}
