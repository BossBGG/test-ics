import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useUserDataStore = defineStore("userData", () => {
  const userProfile = ref({});
  const y3 = ref(false);
  const selectedPeaOffice = ref("");
  const peaOffices = ref([]);
  const showSettingModal = ref(false);
  const selectedPeaCode = ref("");
  const accessToken = ref("")

  function setUserProfile(
    profile,
    canAccess = false,
    _selectedPeaOffice,
    _peaOffices,
    _SelectedPeaCode,
  ) {
    userProfile.value = profile;
    y3.value = canAccess || false;
    selectedPeaOffice.value = _selectedPeaOffice || profile?.pea_office;
    peaOffices.value = _peaOffices || [];
    selectedPeaCode.value = _SelectedPeaCode ?? profile?.pea_code ?? "";
  }

  function setToken(token: string) {
    accessToken.value = token;
  }

  async function changePeaOffice(office) {
    try {
      const data = await axios.put(`users/change-peaoffice`, {
        username: userProfile.value?.username,
        pea_office: office,
      });
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }

  return {
    userProfile: computed(() => userProfile.value),
    y3: computed(() => y3.value),
    selectedPeaOffice: computed(() => selectedPeaOffice.value),
    peaOffices: computed(() => peaOffices.value),
    accessToken: computed(() => accessToken.value),
    setUserProfile,
    setToken,
    changePeaOffice,
    showSettingModal,
    // TODO: rechecked compute is valid
    selectedPeaCode: computed(() => selectedPeaCode.value),
  };
});
