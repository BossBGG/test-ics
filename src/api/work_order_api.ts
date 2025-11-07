import api, {ApiResponse} from "~/api/api";
import {createTableListApi} from "~/api/table_api";
import {
  GroupMaterial,
  WorkOrderObj,
  OptionApi
} from "~/api/types";

export interface ServiceType {
  serviceGroupsId: string;
  serviceGroupsName: string;
  services: SubServiceType[];
}

export interface SubServiceType {
  serviceId: string;
  servicesName: string;
  servicesRequestCode: string;
  servicesWorkOrderTemplateCode: string;
  requestCode: string;
}

const path = 'v1/work-orders'
export const getServiceTypeOptions = (): Promise<ApiResponse<{items: ServiceType[]}>> => {
  return api.get(`${path}/services`)
}

export const getServiceRequestRefList = createTableListApi(`v1/service-requests`, api)

export const getWorkOrderRefList = createTableListApi(path, api)

export const DraftWorkOrder = (data: any): Promise<ApiResponse<WorkOrderObj>> => {
  return api.post(`${path}/draft`, data)
}

export const CreateBulkWorkOrder = (data: any): Promise<ApiResponse<WorkOrderObj>> => {
  return api.post(`${path}/bulk`, data)
}

export const updateWorkOrder = (work_order_no: string, data: WorkOrderObj): Promise<ApiResponse<WorkOrderObj>> => {
  return api.put(`${path}/${work_order_no}`, data)
}

export const executeWorkOrder = (work_order_no: string, data: WorkOrderObj): Promise<ApiResponse<WorkOrderObj>> => {
  return api.post(`${path}/${work_order_no}/execution`, data)
}

export const getWorkOrderDetail = (id: string, isExecute:boolean): Promise<ApiResponse<WorkOrderObj>> => {
  if(isExecute) {
    return api.get(`${path}/${id}/execution`)
  }
  return api.get(`${path}/${id}`)
}

export const getMaterialGroupOptions = (search: string = ""): Promise<ApiResponse<GroupMaterial[]>> => {
  return api.get('v1/material-groups', {
    params: { search }
  })
}

export const getTransformerBrandOptions = (search: string = "", requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return api.get('v1/services/transformer-brands', {
    params: {
      search,
      requestCode,
      slug: 'transformer_brand',
    }
  })
}

export const getTransformerPhaseOptions = (search: string = "", requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return api.get('v1/services/transformer-phases', {
    params: {
      search,
      slug: 'transformer_phase',
      requestCode
    }
  })
}

export const getTransformerTypeOptions = (search: string = "", requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return api.get('v1/services/transformer-types', {
    params: {
      search,
      slug: 'transformer_type',
      requestCode
    }
  })
}

export const getTransformerSizeOptions = (search: string = "", requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return api.get('v1/services/transformer-sizes', {
    params: {
      search,
      slug: 'transformer_size',
      requestCode
    }
  })
}

export const getTransformerVoltageOptions = (search: string = "", requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return api.get('v1/services/transformer-voltages', {
    params: {
      search,
      slug: 'transformer_voltage',
      requestCode
    }
  })
}

export const getMeterEquipmentOptions = (search: string = "", requestCode: string = ""): Promise<ApiResponse<OptionApi[]>> => {
  return api.get(`/v1/services/meter-equipments`, {
    params: {
      search: search,
      requestCode
    }
  })
}

export const updateWorkOrderStatus = (id: string, status: string): Promise<ApiResponse> => {
  return api.put(`${path}/${id}/status`, {workOrderStatusCode: status})
}

export const uploadWorkOrderExecutionImage = (file: File): Promise<ApiResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post(`v1/minio/execution-images`, formData)
}

export const uploadWorkOrderExecutionAttachment = (file: File): Promise<ApiResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post(`v1/minio/execution-attachments`, formData)
}

export const WORK_ORDER_STATUS_MAP: Record<string, string> = {
  V: 'รอผลการสำรวจ',
  W: 'รอเปิดใบสั่งงาน',
  M: 'รอเริ่มปฏิบัติงาน',
  O: 'รอกำลังปฏิบัติงาน',
  K: 'รอจบงาน',
  B: 'รออนุมัติปิดงาน',
  J: 'ปิดงานไม่สำเร็จ',
  T: 'รอขึ้น SAP',
  X: 'ขึ้น SAP ไม่สมบูรณ์',
  Y: 'ขึ้น SAP สมบูรณ์',
  Z: 'ยกเลิกใบสั่งงาน',
  D: 'รับคำร้อง (ช่องทางออนไลน์)',
  C: 'รอสร้างคำร้อง',
  I: 'รอผลการสำรวจ',
  S: 'รอสร้างใบเสนอราคา',
  Q: 'รออนุมัติ',
  N: 'ไม่อนุมัติ',
  A: 'รอชำระเงิน',
  P: 'รอขึ้น SAP',
  F: 'ขึ้น SAP ไม่สมบูรณ์',
  E: 'ยกเลิก',
  R: 'ยกเลิก',
  U: 'ขึ้น SAP สมบูรณ์',
}
