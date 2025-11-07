<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="xs:w-[80%] xl:w-[60%] 2xl:w-[55%] !max-w-[80%]">
      <q-card-section>
        <div class="text-h6">{{ renderTitle() }}</div>
      </q-card-section>

      <q-card-section>
        <div class="w-full">
          <!-- Work Order Ref Type Selection -->
          <div class="mb-4">
            <div class="font-medium mb-2">สร้างใบสั่งงานหลักและใบสั่งงานย่อย</div>
            <div class="flex flex-row w-full">
              <div
                v-for="option in workOrderRefTypeOptions"
                :key="`work_order_ref_type_${option.value}`"
                @click="handleUpdateWorkOrderRefType"
                class="px-3 md:w-1/3 mb-3 md:mb-0"
              >
                <div class="rounded-[12px] p-3 border cursor-pointer w-full"
                     :class="workOrderRefType === option.value ? 'border-[#671FAB]' : 'border-[#E0E0E0]'">
                  <q-radio
                    :model-value="workOrderRefType"
                    :val="option.value"
                    @update:model-value="(val) => workOrderRefType = val"
                    :class="workOrderRefType === option.value ? 'text-[#65004A]' : 'text-black'"
                    :id="`work_order_ref_${option.value}`"
                  >
                    <label :for="`work_order_ref_${option.value}`">
                      <div>{{ option.label }}</div>
                      <div class="text-[12px] font-medium mt-1"
                           :class="workOrderRefType === option.value ? 'text-[#B36E9E]' : 'text-[#57595B]'"
                      >
                        {{ option.description }}
                      </div>
                    </label>

                  </q-radio>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Order Type Selection -->
          <div class="mb-4">
            <div class="font-medium mb-2">เลือกประเภทการสร้างใบงาน</div>
            <div class="flex flex-wrap">
              <div
                v-for="option in workOrderTypeOptions"
                :key="option.value"
                @click="handleUpdateData('workOrderType', option.value)"
                class="px-3 md:w-1/2 mb-3 md:mb-0"
              >
                <div class="rounded-[12px] p-3 w-full border cursor-pointer"
                     :class="data.workOrderType === option.value ? 'border-[#671FAB]' : 'border-gray-300'">
                  <q-radio
                    :model-value="data.workOrderType"
                    :val="option.value"
                    @update:model-value="(val) => handleUpdateData('workOrderType', val)"
                    :id="`work_order_type_${option.value}`"
                    :class="data.workOrderType === option.value ? 'text-[#65004A]' : 'text-black'"
                  >
                    <label :for="`work_order_type_${option.value}`">
                      {{ option.label }}
                    </label>
                    <div class="text-[12px] font-medium mt-1"
                         :class="data.workOrderType === option.value ? 'text-[#B36E9E]' : 'text-[#57595B]'"
                    >
                      {{ option.description }}
                    </div>
                  </q-radio>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Section -->
          <div v-if="['ref_service_req', 'ref_work_order'].includes(workOrderRefType)">
            <div class="my-2 text-sm font-medium">
              {{ workOrderRefType === 'ref_service_req' ? 'ค้นหาเลขที่ใบคำร้อง' : 'ค้นหาเลขที่ใบสั่งงาน' }}
            </div>
            <q-input
              v-model="search"
              :placeholder="workOrderRefType === 'ref_service_req' ? 'ค้นหาเลขที่ใบคำร้อง' : 'ค้นหาเลขที่ใบสั่งงาน'"
              outlined
              dense
            >
              <template #append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>

          <!-- Service Type Selection For Filter -->
          <div v-if="workOrderRefType !== 'not_reference'" class="my-3">
            <div class="text-[12px] font-medium text-[#57595B] mb-2">ประเภทงานบริการ</div>
            <service-type-selection v-model="data.serviceTypes as string[]"
                                    :options="requestCodeOptions"
            />
          </div>

          <div class="my-3 w-full" v-if="workOrderRefType === 'ref_service_req'">
            <service_request_ref_table :model-value="data.customerRequestNo"
                                       @update:serviceRef="handleServiceRequestRef"
                                       :search="search"
                                       :requestCodes="data.serviceTypes || []"
            />
          </div>

          <div class="my-3 w-full" v-if="workOrderRefType === 'ref_work_order'">
            <work_order_ref_table :model-value="data.workOrderParentId"
                                  @update:workOrderRef="handleWorkOrderRef"
                                  :search="search"
                                  :requestCodes="data.serviceTypes || []"
            />
          </div>

          <!-- Service Selection for not_reference -->
          <div v-if="workOrderRefType === 'not_reference'" class="my-3 w-full">
            <div class="mb-3">เลือกประเภทงานบริการ</div>
            <q-select
              v-model="data.serviceId"
              :options="flatServiceOptions"
              outlined
              dense
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="ประเภทงานบริการ"
              placeholder="เลือกประเภทงานบริการ"
            />
          </div>

          <!-- Organization Selection -->
          <div v-if="data.workOrderType === 'bulk'" class="mt-3">
            <div class="text-sm font-medium mb-2">เลือกหน่วยงาน</div>
            <!--            <InputGroupCheckbox :options="organizationTypeOptions"
                                            @update:data="(d: string[]) => handleUpdateData('selectedPeaOffices', d)"
                        />-->
            <TreeSelect :data="organizationTypeOptions"
                        v-model="data.selectedPeaOffices as string[]"
                        @update:modelValue="(d: string[]) => handleUpdateData('selectedPeaOffices', d)"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="justify-between">
        <q-btn
          class="text-white bg-[#D3BCC0] font-semibold flex-1 mr-2 !py-3"
          @click="handleClose"
        >
          ยกเลิก
        </q-btn>
        <q-btn
          class="bg-[#994C80] text-white font-semibold flex-1 ml-2 !py-3"
          @click="submit"
        >
          ยืนยัน
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import service_request_ref_table from "~/pages/work_order/create_or_update/service_request_ref_table.vue";
import Work_order_ref_table from "~/pages/work_order/create_or_update/work_order_ref_table.vue";
import {BulkWorkOrderCreateItem, Options, ServiceRequest, WorkOrderObj} from "~/api/types"
import {CreateBulkWorkOrder, DraftWorkOrder, getServiceTypeOptions, ServiceType} from "~/api/work_order_api";
import {getPeaOfficeOptions} from "~/api/pea_office";
import ServiceTypeSelection from "~/pages/work_order/create_or_update/ServiceTypeSelection.vue";

interface WorkOrderCreateItem {
  serviceId: string
  workOrderType?: 'single' | 'bulk'
  customerRequestNo?: string
  workOrderParentId?: string
  workOrderParentNo?: string
  serviceTypes?: string[]
  selectedPeaOffices?: string[]
  requestCode?: string
}

interface Props {
  open: boolean,
  onClose: () => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const isOpen = ref(props.open)
const workOrderRefType = ref<'ref_service_req' | 'not_reference' | 'ref_work_order'>("not_reference")

const serviceTypeOptions = ref<Options[]>([])
const requestCodeOptions = ref<Options[]>([])
const organizationTypeOptions = ref<Options[]>([])
const search = ref('')
const workOrderStore = useWorkOrderStore()
const customerData = ref({})

const data = ref<WorkOrderCreateItem>({
  serviceId: '',
  workOrderType: 'single',
  selectedPeaOffices: []
})

const workOrderTypeOptions: Options[] = [
  {label: 'ใบสั่งงาน', value: 'single', description: 'สร้างใบสั่งงานแบบใบเดียว'},
  {label: 'ใบสั่งงานเป็นชุด', value: 'bulk', description: 'สร้างใบสั่งงานแบบหลายใบ'}
]

const workOrderRefTypeOptions: Options[] = [
  {label: 'สร้างใบงานใหม่', value: 'not_reference', description: 'ไม่อ้างอิงใบคำร้อง'},
  {label: 'สร้างใบสั่งงานอ้างอิงใบคำร้อง', value: 'ref_service_req', description: 'อ้างอิงใบคำร้อง'},
  {label: 'สร้างใบสั่งงานย่อย', value: 'ref_work_order', description: 'อ้างอิงใบสั่งงานหลัก'}
]

// Flatten options for q-select
const flatServiceOptions = computed(() => {
  const options: Options[] = []
  serviceTypeOptions.value.forEach(group => {
    if (group.subOptions) {
      group.subOptions.forEach(sub => {
        options.push({
          value: sub.value,
          label: `${sub.label}`,
          data: sub.data
        })
      })
    }
  })
  return options
})

watch(() => props.open, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})

onMounted(async () => {
  await Promise.all([
    fetchServiceTypeOptions(),
    fetchPeaOfficeOptions()
  ]).then(([resService, resPeaOffice]) => {

  })
})

const fetchServiceTypeOptions = async () => {
  let options: Options[] = []
  let req_code_options: Options[] = []
  const res = await getServiceTypeOptions()
  if (res.status === 200 && res.data?.data?.items) {
    const data = res.data?.data?.items || []
    data.map((item: ServiceType) => {
      const subOptions = item.services?.map((sub) => ({
        value: sub.serviceId,
        label: `${sub.servicesRequestCode} ${sub.servicesName}`,
        data: sub
      }))

      let sub_reqcode_options = item.services?.map((sub) => {
        return {
          value: sub.servicesRequestCode,
          label: `${sub.servicesRequestCode} ${sub.servicesName}`,
          data: sub
        }
      })

      options.push({
        value: item.serviceGroupsId,
        label: item.serviceGroupsName,
        subOptions
      })

      req_code_options.push({
        value: item.serviceGroupsId,
        label: item.serviceGroupsName,
        subOptions: sub_reqcode_options
      })
    })
  }

  serviceTypeOptions.value = options
  requestCodeOptions.value = req_code_options
  console.log('serviceTypeOptions.>>>> ', serviceTypeOptions.value)
}

const fetchPeaOfficeOptions = async () => {
  let options: Options[] = []
  const res = await getPeaOfficeOptions()
  if (res.status === 200 && res.data.data) {
    let org_data = res.data.data.data || [];
    org_data.map((item) => {
      let sub_options = item.children?.map((sub) => {
        let childrens: Options[] = []
        sub.children?.map((sub) => {
          childrens.push({
            value: sub.office,
            label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
            data: sub,
          })
        })

        return {
          value: sub.id,
          label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
          data: sub,
          subOptions: childrens
        }
      })

      let option: Options = {
        value: item.id,
        label: item.name,
        subOptions: sub_options
      }

      options.push(option)
    })
  }

  organizationTypeOptions.value = options
}

const renderTitle = () => {
  switch (workOrderRefType.value) {
    case 'ref_service_req':
      return 'สร้างใบสั่งงาน อ้างอิงใบคำร้อง'
    case 'ref_work_order':
      return 'สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก'
    default:
      return 'สร้างใบสั่งงานใหม่'
  }
}

const handleUpdateData = (key: keyof WorkOrderCreateItem, value: any) => {
  data.value = {...data.value, [key]: value}
}

const handleServiceRequestRef = (d: ServiceRequest) => {
  data.value = {
    ...data.value,
    serviceId: d.serviceId,
    customerRequestNo: d.customerRequestNo,
    requestCode: d.requestCode.toLowerCase()
  }
  setCustomerData(d)
}

const handleWorkOrderRef = (d: ServiceRequest) => {
  data.value = {
    ...data.value,
    serviceId: d.serviceId,
    workOrderParentId: d.id,
    workOrderParentNo: d.workOrderNo,
    requestCode: d.requestCode.toLowerCase()
  }

  setCustomerData(d)
}

const setCustomerData = (d: ServiceRequest) => {
  customerData.value = {
    customerAddress: d.customerAddress || "",
    customerBp: d.customerBp || "",
    customerCa: d.customerCa || "",
    customerLatitude: d.customerLatitude || "",
    customerLongitude: d.customerLongitude || "",
    customerMobileNo: d.customerMobileNo || "",
    customerName: d.customerName || ""
  }
}

const handleUpdateWorkOrderRefType = (val: any) => {
  workOrderRefType.value = val
  data.value = {
    serviceId: '',
    workOrderType: 'single',
    selectedPeaOffices: []
  }
  customerData.value = {}
}

const getBulkType = () => {
  const types = {
    ref_service_req: "reference_request",
    not_reference: "no_reference",
    ref_work_order: "reference_parent",
  }
  return types[workOrderRefType.value]
}

const submit = async () => {
  if (!data.value.serviceId && workOrderRefType.value === 'not_reference') {
    showError('กรุณาเลือกประเภทงานบริการ')
    return
  }

  showProgress()
  let res = null
  let service = data.value.requestCode || null
  if (data.value.workOrderType === "single") {
    let item: WorkOrderCreateItem = {
      serviceId: data.value.serviceId
    }

    if (workOrderRefType.value === "ref_service_req") {
      item = {...item, customerRequestNo: data.value.customerRequestNo}
    } else if (workOrderRefType.value === "ref_work_order") {
      item = {...item, workOrderParentId: data.value.workOrderParentId}
    }

    try {
      res = await DraftWorkOrder(item)
    } catch (e: any) {
      showError(e.response?.data?.msg || "ไม่สามารถสร้างใบสั่งงานได้")
    }
  } else {
    //สร้างใบสั่งงานเป็นชุด
    let bulkType = getBulkType()
    let bulkItem: BulkWorkOrderCreateItem = {
      bulkType: bulkType,
      selectedPeaOffices: data.value.selectedPeaOffices || [],
      mainWorkOrder: {
        serviceId: data.value.serviceId,
      }
    }

    if (workOrderRefType.value === "ref_service_req") {
      bulkItem = {...bulkItem, customerRequestNo: data.value.customerRequestNo as string}
    } else if (workOrderRefType.value === "ref_work_order") {
      bulkItem = {...bulkItem, existingParentWorkOrderId: data.value.workOrderParentId as string}
    }

    res = await CreateBulkWorkOrder(bulkItem)
  }

  if (!service) {
    serviceTypeOptions.value.map((ser) => {
      if (ser.subOptions) {
        const subService = ser.subOptions.find((sub) => sub.data.serviceId === data.value.serviceId)
        console.log('subService >>>>', subService)
        if (subService && subService.data && subService.data.servicesRequestCode) {
          service = subService.data.servicesRequestCode.toLowerCase()
        }
      }
    })
  }

  if (!service) {
    showError("ไม่พบประเภทงานบริการ")
    return
  }

  if (res?.status === 200) {
    let serviceData = res?.data?.data || {} as WorkOrderObj
    workOrderStore.setWorkOrderRequest({
      workOrderNo: serviceData?.workOrderNo || serviceData?.mainWorkOrder?.workOrderNo || "",
      peaOffice: serviceData?.peaOffice || serviceData?.mainWorkOrder?.peaOffice || "",
      customerRequestNo: serviceData?.customerRequestNo || "",
      officePlant: serviceData?.officePlant as string || serviceData?.mainWorkOrder?.officePlant || "",
      costCenter: serviceData?.costCenter as string || serviceData?.mainWorkOrder?.costCenter || "",
      peaNameFull: serviceData?.peaNameFull as string || serviceData?.mainWorkOrder?.peaNameFull || "",
      workOrderParentNo: data.value.workOrderParentNo || undefined,
      workOrderParentId: data.value.workOrderParentId || undefined,
      ...customerData.value
    })

    let id = serviceData?.id || ""
    // let workOrderNo = serviceData?.workOrderNo || ""

    if (serviceData?.mainWorkOrder?.id) {
      id = serviceData.mainWorkOrder.id
      // workOrderNo = serviceData?.mainWorkOrder?.workOrderNo ?? ""
    } else if (serviceData?.results && serviceData.results.length > 0) {
      id = serviceData.results[0].id || ""
      // workOrderNo = serviceData.results[0].workOrderNo ?? ""
    }

    const params = new URLSearchParams({
      id,
      // workOrderNo
    })

    if (service) {
      router.push(`/work_order/create_or_update/${service}?${params.toString()}`)
      handleClose()
    } else {
      showError("สร้างใบสั่งงานไม่สำเร็จ")
    }
  }
}

const handleClose = () => {
  isOpen.value = false
  props.onClose()
  dismissPopup()
}

watch(() => isOpen.value, () => {
  data.value = {
    serviceId: '',
    workOrderType: 'single',
    customerRequestNo: '',
    serviceTypes: []
  }
  workOrderRefType.value = "not_reference"
})
</script>
