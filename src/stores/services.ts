import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export const useServiceStore = defineStore("service", () => {
  const services = ref([]);
  const showChangeServiceModal = ref(false);

  async function fetchGetServiceList() {
    const { data } = await axios.get(`services/lists`);
    services.value = data.datas;
  }

  return {
    services: computed(() => services.value),
    showChangeServiceModal,
    fetchGetServiceList,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(
    acceptHMRUpdate(useServiceStore as any, import.meta.hot),
  );
