import { acceptHMRUpdate, defineStore } from "pinia";
import axios from "axios";

export interface ServiceRate {
  operator_rates: {
    operator_rates: {
      mas_service_operator_rate_size: { 
        price: number, 
        operator_size: { 
          size_min_kva: number;
          size_max_kva: number; 
        } 
      }[];
    }[]
    operator_sizes: {
      is_operate_by_pea?: boolean
      is_operate_by_rental?: boolean
      size_min_kva?: number
      size_max_kva?: number
    }[]
    operator_teams?: {
      number_of_egen?: number
      team_sizes?: {
        number_of_operator?: number
        operator_sizes: { 
          size_min_kva: number;
          size_max_kva: number;
        };
      }[];
    }[]
    remark: string
  }
  rental_rates: {
    mas_service_rental_sizes: { 
      ref_rental_type: {
        ref_rental_type_desc: string
        ref_rental_type_id: number
      }
      rental_rates: {
        day_number: number
        price: number
      }[]
      size_min_kva: number;
      size_max_kva: number; 
    }[];
    remark: string
  }
  shipping_rates: {
    mas_service_shipping_distance: {
      distance_min_km: number
      distance_max_km: number
    }[]
    mas_service_shipping_self: {
      distance_max_km: null | number
      distance_min_km: null | number
      shipping_descr: string
    }[]
    mas_service_shipping_size: {
      shipping_rates: {
        prince: number
        shipping_distance: {
          distance_min_km: number
          distance_max_km: number
        }
      }[]
      size_min_kva?: number
      size_max_kva?: number
    }[]
    remark: string
  }
}

export interface ServiceRateResponse {
  message?: string;
  data?: ServiceRate;
}

export const useServiceRateStore = defineStore("serviceRate", () => {
  const serviceRates = ref<ServiceRate[]>([]);
  const currentServiceRate = ref<ServiceRate | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchServiceRate(ref_rental_type_id: number | string) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data } = await axios.get<ServiceRateResponse>(
        `/external/get-service-rate`,
        {
          params: {
            ref_rental_type_id,
          },
        }
      );

      const responseData = data.data
      
      if (Array.isArray(responseData)) {
        serviceRates.value = responseData;
        currentServiceRate.value = responseData[0] || null;
      } else if (responseData) {
        currentServiceRate.value = responseData;
        serviceRates.value = [responseData];
      } else {
        currentServiceRate.value = null;
        serviceRates.value = [];
      }

      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch service rate";
      console.error("Error fetching service rate:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearServiceRate() {
    currentServiceRate.value = null;
    serviceRates.value = [];
    error.value = null;
  }

  return {
    // State
    serviceRates: computed(() => serviceRates.value),
    currentServiceRate: computed(() => currentServiceRate.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Actions
    fetchServiceRate,
    clearServiceRate,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useServiceRateStore, import.meta.hot));
}
