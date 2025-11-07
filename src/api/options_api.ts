import api, {ApiResponse} from './api'
import {BusinessTypeOption, EventObj, MainWorkCenter, OptionApi, WorkerOptionObj} from "~/api/types";

// ประเภทธุรกิจ
export const getBusinessTypes = async (keyword: string = ''): Promise<ApiResponse<BusinessTypeOption[]>> => {
  return await api.get('/v1/business-types', {
    params: { search: keyword }
  })
}

// ศูนย์งานหลัก
export const getMainWorkCenters = async (keyword: string = ''): Promise<ApiResponse<MainWorkCenter[]>> => {
  return api.get('/v1/main-work-centers', {
    params: { search: keyword }
  })
}

// ผู้ปฏิบัติงาน
export const getWorkerOptions = (search: string): Promise<ApiResponse<WorkerOptionObj[]>> => {
  return api.get(`/v1/users/workers`, {
    params: { search }
  })
}

// กิจกรรม
export const getActivityTypes = async (keyword: string = ''): Promise<ApiResponse<EventObj[]>> =>{
  return api.get('/v1/activity-types', {
    params: { search: keyword }
  })
}

// รายการอุปกรณ์ไฟฟ้า (ทั่วไป)
export const getEquipmentTypes = async (keyword: string = '') => {
  return await api.get('/v1/services/equipment-types', {
    params: { search: keyword }
  })
}

// ค้นหากลุ่มอุปกรณ์ (ชุดติดตั้ง)
export const getMaterialSets = async (keyword: string = '') => {
  return await api.get('/v1/material-sets', {
    params: { search: keyword }
  })
}

// ค้นหารหัสหรือชื่อวัสดุ
export const getMaterialMaster = async (keyword: string = '') => {
  return await api.get('/v1/material-master', {
    params: { search: keyword }
  })
}

// รายการอุปกรณ์ไฟฟ้า (ตามฟอร์ม)
export const getEquipmentTypesByForm = async (requestCode: string) => {
  return await api.get('/v1/services/equipment-types', {
    params: {
      slug: 'equipment_type',
      requestCode
    }
  })
}

// แรงดันไฟฟ้า (ตามฟอร์ม)
export const getTransformerVoltagesByForm = async (requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return await api.get('/v1/services/transformer-voltages', {
    params: {
      slug: 'transformer_voltage',
      requestCode
    }
  })
}

// ประเภทคำร้อง (ตามฟอร์ม)
export const getRequestTypesByForm = async (requestCode: string) => {
  return await api.get('/v1/services/request-types', {
    params: {
      slug: 'request_service',
      requestCode
    }
  })
}

// ประเภทการให้บริการ (ตามฟอร์ม)
export const getServiceTypesByForm = async (requestCode: string): Promise<ApiResponse<OptionApi[]>> => {
  return await api.get('/v1/services/service-types', {
    params: {
      slug: 'request_service_type',
      requestCode
    }
  })
}

// สำรวจความต้องการใบรับรองฯ (S329)
export const getRenewableSources = async (): Promise<ApiResponse<OptionApi[]>> => {
  return await api.get('/v1/services/renewable-sources', {
    params: {
      requestCode: 's329',
      slug: 'renewable_source'
    }
  })
}

// แหล่งที่มาของพลังงานหมุนเวียน (S329)
export const getRenewableTypes = async (): Promise<ApiResponse<OptionApi[]>> => {
  return await api.get('/v1/services/renewable-types', {
    params: {
      requestCode: 's329',
      slug: 'renewable_type'
    }
  })
}
