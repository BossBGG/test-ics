export function getServiceTitle() {
  const serviceStore = useServiceStore();
  const { services } = storeToRefs(serviceStore);
  if (Array.isArray(services.value)) {
    const activeService = services.value.find(
      (service) => service.request_code === nowServiceCode(),
    );
    return activeService
      ? `${activeService.request_code} : ${activeService.name}`
      : "Service not found";
  } else {
    return "Services not available";
  }
}

export function getAllServices() {
  const serviceStore = useServiceStore();
  const { services } = storeToRefs(serviceStore);
  return services.value
}
