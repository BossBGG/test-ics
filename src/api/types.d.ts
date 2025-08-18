export interface BaseApiResponse<T> {
  // status_code: number;
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error?: Array<string>;
}

export interface GroupMaterial {
  id: number;
  uuid: string;
  name: string;
  status: string;
  is_active: boolean;
  isActive: boolean;
  materialAndEquipment?: MaterialEquipment[];
}

export interface MaterialEquipment {
  id: number;
  code: string;
  uuid: string;
  name: string;
  quantity: number | string;
  unit: string;
  price?: number | string;
  status: string;
  is_active: boolean;
  is_update: boolean;
  is_edited: boolean;
}

export interface MaterialMaster {
  id: string;
  code: string;
  name: string;
  unit: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface addMaterialType {
  name: string;
  code: string;
  quantity: number;
  unit: string;
  isActive: boolean;
}

export interface updateMaterialType extends addMaterialType {
  id: number;
}

export interface SystemLogApiMeta {
  page: number;
  limit: number;
  previousPage: number | null;
  nextPage: number | null;
  totalCount: number;
  totalPages: number;
}
