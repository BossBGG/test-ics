import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const load = ref(false)

  function start() {
    load.value = true
  }

  function stop() {
    load.value = false
  }

  return {
    load,
    start,
    stop,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore as any, import.meta.hot))
