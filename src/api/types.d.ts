export interface BaseApiResponse<T> {
  // status_code: number;
  success: boolean;
  statusCode: number;
  message: string;
  msg: string;
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
  stock: string;
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

export type ServiceRequest = {
  id: string;
  workOrderNo: string;
  requestNo: string;
  serviceId: string;
  requestCode: string;
  serviceType: string;
  createdDate: string;
  createdAt: string;
  customerName: string;
  customerBp: string;
  customerCa: string;
  customerLatitude: string | number;
  customerLongitude: string | number;
  statusCode: string;
  customerRequestNo: string;
  customerAddress: string;
  customerMobileNo: string;
  serviceGroupName: string;
  serviceName: string;
  status: string;
  statusDescription: string;
  workOrderParentId: string;
  costCenter: string;
  peaOffice: string;
  officePlant: string;
  peaNameFull: string;
}

export interface Options {
  value: string | number
  label: string
  description?: string
  data?: any
  subOptions?: Options[]
}

export interface PeaOrganize {
  id: string;
  level: string;
  name: string;
  regiongroup: string;
  children: SubPeaOrganize[];
}

export interface SubPeaOrganize {
  id: string;
  level: string;
  name: string;
  office: string;
  regiongroup: string;
  children?: SubPeaOrganize[];
}

export type WorkOrderObj = {
  id: string
  workOrderNo: string
  customerRequestNo: string
  customerName: string,
  customerLatitude: string | number
  customerLongitude: string | number
  customerMobileNo: string
  customerAddress: string
  businessType: number
  peaOffice: string
  workOrderStatusCode: string
  assignees: WorkOrderAssignee[],
  equipments: MaterialEquipmentObj[]
  serviceSpecificData: ServiceSpecificData
  serviceSpecificationData: ServiceSpecificData
  participants: WorkOrderParticipant[]
  costCenter: string;
  officePlant: string;
  appointmentDate: Date | string | undefined |null;
  mainWorkOrder: MainWorkOrder
  results: {
    id: string;
    workOrderNo: string
  }[],
  startWorkDate: Date | string | undefined |null
  endWorkDate: Date | string | undefined |null
  execution: Execution,
  latitude: number,
  longitude: number
  images: number[]
  attachments: number[]
  executionDetail: string
  serviceSatisfaction: number
  satisfactionComment: string
  customerSignatureBase64: string
  recorderName: string
  recorderPosition: string
  recorderPhoneNumber: string
  recorderSignatureBase64: string

  mainWorkCenterId: string;
  peaNameFull: string;
  priority: number
  status: string
  workDescription: string
  payment_received_date: string
  requestSapNo: string
  requestType: string
  surveyImages: any
  surveyData: any
}

export interface Execution {
  id: string;
  workOrderId: string;
  startDateTime: string | Date | undefined;
  endDateTime: string | Date | undefined;
  note: string;
  username: string;
  userType: string;
  executionDetail: string;
  createdAt: string;
  serviceSpecificData: ServiceSpecificData;
  images: UploaddedImage[];
  attachments: UploadedFile[];
  startWorkDate?: string;
  endWorkDate?: string;
  latitude?: number;
  longitude?: number;
  executionNote?: string;
  serviceSatisfaction?: number;
  satisfactionComment?: string;
  recorderName?: string;
  recorderPosition?: string;
  recorderPhoneNumber?: string
  recorderSignature?: {
    url: string
  },
  customerSignature?: {
    url: string
  }
}

interface UploaddedImage {
  id: number;
  name: string;
  fileName: string;
  size: number;
  fileSize: number;
  url: string;
  file: File;
  uploadDate?: Date;
  isUploading?: boolean;
}

interface UploadedFile {
  id: number;
  name: string;
  fileName?: string;
  size: number;
  fileSize?: number;
  url: string;
  file: File;
  uploadDate?: Date;
  isUploading?: boolean;
}

export interface MainWorkOrder {
  id: string;
  peaOffice: string;
  workOrderNo: string;
  officePlant: string;
  costCenter: string;
  peaNameFull: string;
}

export type ServiceSpecificData =
  BusinessTypeData
  | S301ServiceData
  | S307ServiceData
  | S305ServiceData
  | RentalServiceData
  | S315ServiceData
  | S318ServiceData
  | S332SolarAirData
  | S322ServiceData

// สำหรับ S302, S303, S304, S306, S309, S310, S311, S317, S319, S320, S323, S399
export interface BusinessTypeData {
  businessTypeId: string;
}

export interface S301ServiceData {
  equipments: Array<S301EquipmentServiceData>;
}

export interface S301EquipmentServiceData {
  equipmentTypeId: string;
  equipmentName?: string;
  amount: number;
  isUpdate?: boolean;
}

export interface S305ServiceData {
  requestServiceTypeId: string;
  requestServiceId: string;
  transformers: Array<S305TransformerServiceData>;
}

export interface S305TransformerServiceData {
  transformerBrandId: string;
  brand: string;
  transformerPhaseId: string;
  phase: string;
  transformerTypeId: string;
  type: string;
  transformerSerial: string;
  transformerSize: string;
  size: string;
  transformerVoltage: string;
  voltage: string;
  isUpdate: boolean;
  isEdited: boolean;
}

export interface S307ServiceData {
  businessTypeId: number
  voltageId: string;
}

export interface S308ServiceData {
  businessTypeId: string;
  transformerCapacityKw: number;
  transformers: Array<{
    transformerBrandId: string;
    transformerPhaseId: string;
    transformerTypeId: string;
    transformerSerial: string;
    transformerSize: string;
    transformerVoltage: string;
  }>;
}

export interface S314ServiceData {
  rentalStartDate: string | Date | undefined;
  rentalEndDate: string | Date | undefined;
  rentalDays: number;
  cableInsulators: Array<S314CableServiceData>;
}

export interface S314CableServiceData {
  cableInsulator: string;
  amount: number;
  isUpdate: boolean;
  isEdited: boolean;
}

// S315: ขอเช่าหม้อแปลง
export interface S315ServiceData {
  businessTypeId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;
  transformers: Array<S315TransformerServiceData>;
}

export interface S315TransformerServiceData {
  transformerCapacity: string;
  amount: number;
  isUpdate: boolean;
}

export interface S322ServiceData {
  businessTypeId: string;
  packageId: string;
}

export interface RentalServiceData {
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDays: number;
  items: Array<RentalItemServiceData>;
}

export interface RentalItemServiceData {
  itemTitle: string;
  quantity: number;
  isUpdate: boolean;
}

export interface S318ServiceData {
  equipments: Array<S318EquipmentServiceData>;
}

export interface S318EquipmentServiceData {
  equipment: string;
  equipmentId: string;
  capacity: string;
  amount: number;
  isUpdate: boolean;
  price: string | number;
}

export interface S329ServiceData {
  renewableType: string;
  renewableSource: string;
  year: number | null;
  qty: number;
}

// S332 Solar Air
export interface S332SolarAirData {
  pipeLengthRefrigerantM?: number;
  cableLengthDcM?: number;
  cableLengthAcM?: number;
  houseFacingDirection?: string | Options;
}

// S332 Solar Battery
export interface S332SolarBatteryData {
  networkConnectionTypeId?: string;
  distancePanelToInverterM?: number;
  distanceInverterToDistributionM?: number;
  networkConnectionTypeOther?: string;
}

export type WorkOrderAssignee = {
  username: string
  name: string
  userType: string
  groupId: string
  workCenterId: string
  workCenter: string
  workActivityTypeId: string
  activityName: string
  startDateTime: Date | undefined
  workHours: number
  unit: string
  workUnit: string
  isEquipmentResponsible: boolean
  isUpdate: boolean
}

export interface WorkOrderParticipant {
  name: string,
  username: string,
  isUpdate: boolean
}

export interface ResponsiblePersonObj {
  id?: number | string;
  username: string;
  isUpdate: boolean;
  isEdited: boolean;
}

type OptionApi = {
  id: string;
  option_title: string;
  optionTitle: string;
};

type BusinessTypeOption = {
  id: string;
  name: string;
};

interface Worker {
  id: number
  group: string
  groupId: string
  worker: string
  workerId: string
  workCenter: string
  workCenterId: string
  activity: string
  activityId: string
  hours: number
  unit: string
  startDateTime: string
  isUpdate: boolean
}

export type EventObj = {
  id: number;
  ktext: string;
  lstar: string;
};

export type MainWorkCenter = {
  id: number;
  name: string;
  code: string;
};

export interface WorkerOptionObj {
  username: string;
  firstName: string;
  lastName: string;
}

export interface MeterEquipmentService {
  id: string;
  services_id: string;
  item_slug: string;
  item_name: string;
  item_description: string | null;
  option_title: string;
  sub_id: string | null;
  order: number;
  is_other: boolean;
  is_active: boolean;
  is_del: boolean;
  created_date: string;
  created_by: string;
  updated_date: string | null;
  updated_by: string | null;
}

export interface WorkOrderRequest {
  workOrderNo: string
  peaOffice: string
  customerRequestNo: string
  officePlant: string
  peaNameFull?: string
  costCenter: string
  customerName?: string
  customerMobileNo?: string
  customerAddress?: string
  workOrderParentNo?: string
}

export interface MaterialEquipmentObj {
  id: number
  code: string
  name: string
  quantity: number
  availableStock?: number
  unit: string
  isUpdate?: boolean
  price?: number | string
}

export interface BulkWorkOrderCreateItem {
  bulkType: string;
  customerRequestNo?: string;
  existingParentWorkOrderId?: string;
  mainWorkOrder?: {
    serviceId: string;
  };
  selectedPeaOffices: string[]
}
