import {createTableListApi, TableListApi} from "~/api/table_api";
import {addMaterialType, updateMaterialType, GroupMaterial, MaterialEquipment, MaterialMaster} from "~/api/types";
import api, {ApiResponse} from "~/api/api";

const path = `/v1/material-equipment`
export const getMaterialEquipmentApi: TableListApi<MaterialEquipment[]> = createTableListApi(path, api)

export const getMaterialEquipmentById = (uuid: string): Promise<ApiResponse<MaterialEquipment>> => {
  return api.get(`${path}/${uuid}/details`)
}

export const getGroupMaterialEquipmentById = (uuid: string): Promise<ApiResponse<GroupMaterial>> => {
  return api.get(`${path}/${uuid}`)
}

export const getMaterialMaster = (): Promise<ApiResponse<MaterialMaster[]>> => {
  return api.get(`/v1/material-master`)
}

export const createGroupMaterialEquipment = (data: {
  name: string,
  isActive: boolean,
  materialAndEquipment: addMaterialType
}): Promise<ApiResponse> => {
  return api.post(`${path}`, data)
}

export const updateGroupMaterialEquipment = (uuid: string, data: {
  name: string,
  isActive: boolean,
  addMaterials: addMaterialType[],
  updateMaterials: updateMaterialType[],
  removeMaterialIds: number[]
}): Promise<ApiResponse> => {
  return api.patch(`${path}/${uuid}`, data)
}

export const deleteGroupMaterialEquipment = (uuid: string): Promise<ApiResponse> => {
  return api.delete(`${path}/${uuid}`)
}

export const updateGroupMaterialEquipmentStatus = (uuid: string, isActive: boolean): Promise<ApiResponse> => {
  return api.patch(`${path}/${uuid}`, {isActive})
}
