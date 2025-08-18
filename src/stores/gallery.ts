import { acceptHMRUpdate, defineStore } from 'pinia'
import axios from 'axios'

export const useGalleryStore = defineStore('gallery', () => {
  const gallerys = ref({})
  const gallery = ref({})

  async function fetchGallerys() {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos`,
    )
    gallerys.value = data
  }

  async function fetchGallerysByID(id) {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${id}`,
    )
    gallery.value = data
  }

  return {
    gallerys: computed(() => gallerys.value),
    gallery: computed(() => gallery.value),

    fetchGallerys,
    fetchGallerysByID,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useGalleryStore as any, import.meta.hot),
  )
}
