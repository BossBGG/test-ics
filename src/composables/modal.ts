// ##########----- Start EditService -----##########
export function openEditServiceModal() {
  const serviceStore = useServiceStore();
  const { showChangeServiceModal } = storeToRefs(serviceStore);

  showChangeServiceModal.value = true;
}

export function closeEditServiceModal() {
  const serviceStore = useServiceStore();
  const { showChangeServiceModal } = storeToRefs(serviceStore);

  showChangeServiceModal.value = false;
}
// ##########----- End EditService -----##########

// ##########----- Start CancelRequest -----##########
export function openCancelRequestModal() {
  const requestStore = useRequestStore();
  const { showCancelRequestModal } = storeToRefs(requestStore);

  showCancelRequestModal.value = true;
}

export function closeCancelRequestModal() {
  const requestStore = useRequestStore();
  const { showCancelRequestModal } = storeToRefs(requestStore);

  showCancelRequestModal.value = false;
}
// ##########----- End CancelRequest -----##########

// ##########----- Start RequestModal -----##########
export function openTransferRequestModal() {
  const requestStore = useRequestStore();
  const { showTransferRequestModal } = storeToRefs(requestStore);

  showTransferRequestModal.value = true;
}

export function closeTransferRequestModal() {
  const requestStore = useRequestStore();
  const { showTransferRequestModal } = storeToRefs(requestStore);

  showTransferRequestModal.value = false;
  // ##########----- End RequestModal -----##########
}

// ##########----- Start RequestModal -----##########
export function openSettingModal() {
  const userStore = useUserDataStore();
  const { showSettingModal } = storeToRefs(userStore);

  showSettingModal.value = true;
}

export function closeSettingModal() {
  const userStore = useUserDataStore();
  const { showSettingModal } = storeToRefs(userStore);

  showSettingModal.value = false;
  // ##########----- End RequestModal -----##########
}
