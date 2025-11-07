import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useMasterDataStore = defineStore("masterData", () => {
  const nameTitles = ref([]);
  const legalForms = ref([]);
  const nationalities = ref([]);
  const maritalStatus = ref([]);
  const materialsList = ref([]);
  const genders = ref([]);
  const allPeaOffice = ref([]);
  const gisPeaOffice = ref({});
  const allIp = ref({});

  async function fetchLegalForm() {
    await checkLoad("legalForms", async () => {
      const { data } = await axios.get(`service_items/legal_form`);
      legalForms.value = data.datas;
    });
  }

  async function fetchNationality() {
    await checkLoad("nationalities", async () => {
      const { data } = await axios.get(`service_items/nationality`);
      nationalities.value = data.datas;
    });
  }

  async function fetchNameTitle() {
    await checkLoad("nameTitles", async () => {
      const { data } = await axios.get(`master/titles`);
      nameTitles.value = data.datas;
    });
  }

  async function fetchMaritalStatus() {
    await checkLoad("maritalStatus", async () => {
      const { data } = await axios.get(`master/marital`);
      maritalStatus.value = data.datas;
    });
  }

  async function fetchMaterialsList() {
    await checkLoad("materialsList", async () => {
      const { data } = await axios.get(`master/materials`);
      materialsList.value = data.datas;
    });
  }

  async function fetchGender() {
    await checkLoad("genders", async () => {
      const { data } = await axios.get(`master/gender`);
      genders.value = data.datas;
    });
  }

  async function getChannel(channel = 0) {
    try {
      const { data } = await axios.get(`master/channel/${channel}`);
      return data?.channel_name || '-';
    } catch {
      return '-';
    }
  }
  async function getStatusName(code = 'C') {
    try {
      const { data } = await axios.get(`master/status/${code}`);
      return data?.status_name || '-';
    } catch {
      return '-';
    }
  }

  async function fetchAllPeaOffice(tambonID = 0) {
    try {
      const id = tambonID || "null";
      const { data } = await axios.get(`master/allpeaoffice/${id}`);
      allPeaOffice.value = data.datas;
    } catch {
      allPeaOffice.value = [];
    }
  }

  function resetAllPeaOffice() {
    allPeaOffice.value = [];
  }

  async function fetchGisPeaOffice(lat = 0, long = 0) {
    // console.log(lat);
    // console.log(long);
    const { data } = await axios.get(`master/gis/${lat}/${long}`);
    gisPeaOffice.value = data.datas;
  }

  async function fetchAllIp() {
    const data = await axios.get(`master/ip`);
    allIp.value = data.data;
    // console.log('data.data: ', data.data);
    // console.log('allIp.value  ', allIp.value);
  }

  return {
    legalForms: computed(() => legalForms.value),
    nationalities: computed(() => nationalities.value),
    nameTitles: computed(() => nameTitles.value),
    maritalStatus: computed(() => maritalStatus.value),
    materialsList: computed(() => materialsList.value),
    genders: computed(() => genders.value),
    allPeaOffice: computed(() => allPeaOffice.value),
    gisPeaOffice: computed(() => gisPeaOffice.value),
    allIp: computed(() => allIp.value),

    fetchLegalForm,
    fetchNationality,
    fetchNameTitle,
    fetchMaritalStatus,
    fetchMaterialsList,
    fetchGender,
    fetchAllPeaOffice,
    fetchGisPeaOffice,
    resetAllPeaOffice,
    fetchAllIp,
    getChannel,
    getStatusName,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(
    acceptHMRUpdate(useMasterDataStore as any, import.meta.hot),
  );
