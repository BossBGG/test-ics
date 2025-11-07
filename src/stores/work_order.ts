import {defineStore} from "pinia";
import {WorkOrderRequest} from "~/api/types";

export const useWorkOrderStore = defineStore("work_order", () => {
  const workOrderRequest = ref<WorkOrderRequest>({} as WorkOrderRequest)

  function setWorkOrderRequest(data: WorkOrderRequest) {
    workOrderRequest.value = data
  }

  return {
    workOrderRequest,
    setWorkOrderRequest
  }
})
