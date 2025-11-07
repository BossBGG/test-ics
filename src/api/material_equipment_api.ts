import {createTableListApi, TableListApi} from "~/api/table_api";
import {addMaterialType, updateMaterialType, GroupMaterial, MaterialEquipment, MaterialMaster} from "~/api/types";
import api, {ApiResponse} from "~/api/api";
import { Search } from "lucide-vue-next";

const path = `/v1/material-equipment`
export const getMaterialEquipmentApi: TableListApi<MaterialEquipment[]> = createTableListApi(path, api)

export const getMaterialEquipmentById = (uuid: string): Promise<ApiResponse<MaterialEquipment>> => {
  return api.get(`${path}/${uuid}/details`)
}

export const getGroupMaterialEquipmentById = (uuid: string): Promise<ApiResponse<GroupMaterial>> => {
  return api.get(`${path}/${uuid}`)
}

export const getMaterialMaster = (search: string = ''): Promise<ApiResponse<MaterialMaster[]>> => {
  return api.get(`/v1/material-master`, {
    params: { search }
  })
}

export const createGroupMaterialEquipment = (data: {
  name: string,
  isActive: boolean,
  materialAndEquipment: addMaterialType[]
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


export const getMaterialSets = (
  search: string = "",
  office?: string 
): Promise<ApiResponse<{
  items: {
    uuid: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string | null;
    deletedBy: string | null;
    materialAndEquipment: MaterialEquipment[];
  }[];
}>> => {
  const cleanSearch = (search || "").trim();

  let queryString = `search=${encodeURIComponent(cleanSearch)}`;

  if (office) {
    queryString += `&office=${encodeURIComponent(office)}`;
  }

  const fullUrl = `/v1/material-sets?${queryString}`;

  return api.get(fullUrl);
};

export const getMaterialMasterSets = (search: string = ""): Promise<ApiResponse<{
  id: number;
  code: string;
  name: string;
  unit: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  availableStock: number;
}[]>> => {
  return api.get(`/v1/material-master?search=${search}`);
};