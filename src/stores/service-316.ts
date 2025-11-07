import { acceptHMRUpdate, defineStore } from 'pinia'
import axios from 'axios'

export interface FetchGetGeneratorAvailablesResponse {
  message: string
  data: Generator[]
}

export interface Generator {
  ref_generator_size_id: number
  ref_generator_size_desc: string
  generator_image_type_id: string
  available: number
  pea_offices: PeaOffice[]
}

export interface PeaOffice {
  pea_code: string
  pea_name: string
  available: number
  tel_number: string
  lat: number
  lon: number
  distance: number
}

export const useService316Store = defineStore('service_316', () => {
  const generatorAvailables = ref<Generator[]>([])

  async function fetchGetGeneratorAvailables(
    { latitude, longitude, rental_start_date, rental_end_date, ref_generator_size_id }:
    { latitude: number, longitude: number, rental_start_date: string, rental_end_date: string, ref_generator_size_id: number },
  ) {
    // 'https://ics-y3-dev.pea.co.th/api/external/getpeaoffice?latitude=18.059659&longitude=99.772671&rental_start_date=2025-10-01&rental_end_date=2025-10-10&ref_generator_size_id=1'
    try {
      const { data } = await axios.get<FetchGetGeneratorAvailablesResponse>(`external/getpeaoffice`, {
        // baseURL: 'http://localhost:3000/api/',
        params: {
          latitude,
          longitude,
          rental_start_date,
          rental_end_date,
          ref_generator_size_id,
        },
      })

      generatorAvailables.value = { ...data.data }

      return { data, status: true }
    }
    catch (e) {
      return { status: false }
    }
  }

  return {
    generatorAvailables,
    fetchGetGeneratorAvailables,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useRequestStore as any, import.meta.hot),
  )
}
