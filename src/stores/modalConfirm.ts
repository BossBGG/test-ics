import { acceptHMRUpdate, defineStore } from 'pinia'

export const useModalConfirmStore = defineStore('modalConfirm', () => {
  const isModalConfirm = ref(false)
  const isModalAlert = ref(false)
  const isModalAlertReload = ref(false)
  const dataAlert = ref({
    colorText: "",
    colorIcon: "",
    title: "",
    text: "",
    icon: "",
  });

  function open() {
    isModalConfirm.value = true
  }

  function close() {
    isModalConfirm.value = false
  }

  function conFirm() {
    isModalConfirm.value = false
  }

  function showAlart() {
    isModalAlert.value = true
  }

  function closeAlart() {
    isModalAlert.value = false
  }

  return {
    isModalConfirm,
    isModalAlert,
    isModalAlertReload,
    dataAlert,
    open,
    close,
    conFirm,
    showAlart,
    closeAlart,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useModalConfirmStore as any, import.meta.hot),
  )
}
