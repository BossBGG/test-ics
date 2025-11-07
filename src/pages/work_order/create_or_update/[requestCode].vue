<template>
  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'สร้าง', link: '/work_order' },
      { text: breadcrumbTitle },
    ]"
  >

    <div class="header-actions">
      <button
        v-if="currentStep === 3"
        class="flex items-center justify-center gap-2 bg-[#3F51B5] text-white border-none px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 min-w-[44px] h-[44px] hover:-translate-y-0.5"
        title="ดาวน์โหลดรายงาน"
      >
        <img
          src="/assets/images/print.png"
          alt=""
          class="header-action-icon"
        />
        ดาวน์โหลด
      </button>

      <button class="header-action-btn" @click="showRelationship">
        <img
          src="/assets/images/link.png"
          alt=""
          class="header-action-link-icon"
        />
        แสดงความสัมพันธ์ใบสั่งงาน
      </button>

      <button
        class="header-action-btn icon-only"
        @click="showHistory"
        title="History"
      >
        <img
          src="/assets/images/history.png"
          alt=""
          class="header-action-icon"
        />
      </button>
    </div>

    <!-- Work Order Info -->
    <WorkOrderInfo :data="workOrderData"/>

    <!-- Work Order Steps -->
    <WorkOrderStep
      :steps="steps"
      :current-step="currentStep"
      @update:step="updateCurrentStep"
    />

    <!-- Work Order Relationships Sidebar -->
    <WorkOrderRelationShips
      v-model="showRelationshipsPanel"
    />

    <!-- Step Content -->
    <div v-if="currentStep === 0">
      <CardCollapse title="ข้อมูลลูกค้าและข้อมูลคำร้อง" icon="/assets/images/user.png">
        <CustomerInfo :data="workOrderData"/>

        <!-- Service-specific components -->
        <RequestCodeSpecificInfo :request-code="requestCode"
                                 :data="workOrderData"
                                 @update:data="updateWorkOrderData"
        />
      </CardCollapse>

      <template v-if="['s302', 's303', 's304', 's306', 's307'].includes(requestCode)">
        <SurveyData
          :model-value="workOrderData.surveyImages"
          :survey-data="workOrderData.surveyData"
          @images-change="handleSurveyImagesUpdate"
        />
      </template>

      <template v-if="requestCode === 's316'">
        <SurveyData
          :model-value="workOrderData.surveyImages"
          :survey-data="workOrderData.surveyData"
          @images-change="handleSurveyImagesUpdate"
        />
      </template>

      <template v-if="requestCode === 's332_Solar_Air_Conditioner'">
        <CardCollapse title="ข้อมูลการสำรวจ" icon="/assets/images/map-icon.png">
          <SurveyDataSolarAirConditioner
            :model-value="workOrderData.surveyImages"
            :survey-data="workOrderData.surveyData"
            @images-change="handleSurveyImagesUpdate"
          />
        </CardCollapse>
        <AdditionalDataSolarAirConditioner :data="workOrderData"
                                           @update:data="updateWorkOrderData"
        />
      </template>

      <template v-if="requestCode === 's332_Solar_Battery'">
        <CardCollapse title="ข้อมูลการสำรวจ" icon="/assets/images/map-icon.png">
          <SurveyDataSolarBattery
            :model-value="workOrderData.surveyImages"
            :survey-data="workOrderData.surveyData"
            @images-change="handleSurveyImagesUpdate"
          />
        </CardCollapse>
        <AdditionalDataSolarBattery :data="workOrderData"
                                    @update:data="updateWorkOrderData"/>
      </template>
    </div>

    <div v-else-if="currentStep === 1">
      <InvolvedPersonsList
        :workerListOptions="workerListOptions"
        :data="workOrderData"
        @update:data="updateWorkOrderData"
      />

      <AddWorker :data="workOrderData"
                 :worker-list-options="workerListOptions"
                 @update:data="updateWorkOrderData"
      />

      <DateAppointment
        :data="workOrderData"
        @update:data="updateWorkOrderData"
      />
    </div>

    <div v-else-if="currentStep === 2">
      <ResponsiblePersonComponent
        :data="workOrderData"
        :workerListOptions="workerListOptions"
        :options="{
          isReadOnly: false,
          showAddButton: true,
          showDeleteAllButton: true,
          showActionColumn: true,
        }"
        @update:data="updateWorkOrderData"
      />

      <AddMaterial :data="workOrderData" @update:data="updateWorkOrderData"/>
    </div>

    <div v-else-if="currentStep === 3">
      <!-- Work Results -->
      <WorkExecution
        :data="workOrderData"
        @update:data="updateWorkOrderData"
      />

      <div class="my-8">
        <RequestCodeSpecificInfo :request-code="requestCode"
                                 :data="workOrderData"
                                 @update:data="updateWorkOrderData"
                                 :show-collapse="true"
        />
      </div>

      <AddImages :data="workOrderData"
                 @update:data="updateWorkOrderData"
      />

      <AddFile :data="workOrderData"
               @update:data="updateWorkOrderData"
      />

      <Comment
        v-model="workOrderData.executionDetail"
        :max-length="250"
      />

      <SatisfactionAssessment
        :data="workOrderData"
        @update:data="updateWorkOrderData"
      />

      <RecordKeeper
        :data="workOrderData"
        @update:data="updateWorkOrderData"
      />
    </div>

    <!-- Step Navigation -->
    <div class="step-navigation">
      <button
        v-if="currentStep > 0"
        @click="goToPreviousStep"
        class="nav-button prev-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="nav-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        <span>{{ getPreviousStepName() }}</span>
      </button>

      <div class="nav-spacer"></div>

      <button
        v-if="currentStep < steps.length - 1"
        @click="goToNextStep"
        class="nav-button prev-button"
      >
        <span>{{ getNextStepName() }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="nav-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <div v-if="currentStep === 3" class="flex flex-wrap">
        <button class="action-button end-step-edit-btn flex-1" @click="editWorkOrder">
          <q-icon name="edit" class="action-icon"/>
          แก้ไขใบงาน
        </button>

        <div class="px-2 flex-1">
          <button class="action-button save-success-btn w-full" @click="saveWorkOrder">
            <q-icon name="save" class="action-icon"/>
            บันทึกร่าง
          </button>
        </div>

        <div class="px-2 flex-1">
          <button class="action-button complete-btn w-full" @click="completeWorkOrder">
            จบงาน
          </button>
        </div>

        <button class="action-button complete-btn flex-1" @click="completeWorkOrderInIcs">
          สิ้นสุดการกระบวนการบน ICS ดำเนินการต่อบน SAP
        </button>
      </div>

      <div v-else class="flex flex-wrap">
        <button class="action-button cancel-btn flex-1" @click="cancelWorkOrder">
          ยกเลิกใบสั่งงาน
        </button>

        <div class="px-3 flex-1">
          <button class="action-button save-success-btn w-full" @click="saveWorkOrder">
            <q-icon name="save" class="action-icon"/>
            บันทึกร่าง
          </button>
        </div>

        <button class="action-button save-success-btn flex-1"
                v-if="workOrderData.workOrderStatusCode === 'W' && currentStep === 2"
                @click="confirmCreateWorkOrder">
          <q-icon name="save" class="action-icon"/>
          สร้างใบงาน
        </button>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import {ref, reactive, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import ContentContainer from '~/layouts/ContentContainer.vue'
import WorkOrderInfo from '~/components/work_order/WorkOrderInfo.vue'
import WorkOrderStep from '~/components/work_order/WorkOrderStep.vue'
import CustomerInfo from '~/components/work_order/CustomerInfo.vue'
import AddWorker from '~/components/worker/AddWorker.vue'
import DateAppointment from '~/components/worker/DateAppointment.vue'
import AddMaterial from '~/components/material_equipment_list/AddMaterial.vue'
/*import WorkExecution from '~/components/work_execution/WorkExecution.vue'
import AddImages from '~/components/work_execution/AddImages.vue'
import AddFile from '~/components/work_execution/AddFile.vue'
import Comment from '~/components/work_execution/Comment.vue'
import SatisfactionAssessment from '~/components/work_execution/SatisfactionAssessment.vue'
import RecordKeeper from '~/components/work_execution/RecordKeeper.vue'*/
import SurveyData from '~/components/work_order/SurveyData.vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import '@/styles/workorder.css'
import SurveyDataSolarAirConditioner from '../special-form/s332_Solar_Air_Conditioner/SurveyDataSolarAirConditioner.vue'
import AdditionalDataSolarAirConditioner from '../special-form/s332_Solar_Air_Conditioner/AdditionalData.vue'
import SurveyDataSolarBattery from '../special-form/s332_Solar_Battery/SurveyDataSolarBattery.vue'
import AdditionalDataSolarBattery from '../special-form/s332_Solar_Battery/AdditionalData.vue'
import WorkOrderRelationShips from "~/components/work_order/WorkOrderRelationShips.vue";
import {
  MaterialEquipmentObj,
  Options,
  WorkOrderObj
} from "~/api/types";
import {executeWorkOrder, getWorkOrderDetail, updateWorkOrder, updateWorkOrderStatus} from "~/api/work_order_api";
import {fetchWorkerListOptions} from "~/composables/worker_options";
import WorkExecution from "~/components/work_execution/WorkExecution.vue";
import RequestCodeSpecificInfo from "~/pages/work_order/create_or_update/RequestCodeSpecificInfo.vue";
import {
  formatIsoToDisplay, toTimestamp
} from "~/composables/datetime.js";

const route = useRoute();
const router = useRouter();
const requestCode = computed(() => route.params?.requestCode as string);
const workOrderData = ref<WorkOrderObj>({} as WorkOrderObj)
const showRelationshipsPanel = ref(false)
const currentStep = ref(0);
const workOrderStore = useWorkOrderStore();
const id = computed(() => route.query.id as string || "")
const isEdit = computed(() => {
  if (route.query.isEdit && route.query.isEdit === "true") {
    return true
  }
  return false
})
const isExecute = computed(() => {
  if (route.query.isExecute && route.query.isExecute === "true") {
    return true
  }
  return false
})
const workerListOptions = ref<Options[]>([])

onMounted(async () => {
  workerListOptions.value = await fetchWorkerListOptions()
  if (isEdit.value || isExecute.value) {
    try {
      await fetchWorkOrderDetail(id.value)
    } catch (e) {
      showError('ดึงข้อมูลใบสั่งงานไม่สำเร็จ')
    }
  } else {
    if (workOrderStore.workOrderRequest?.workOrderParentId) {
      //สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก
      await fetchWorkOrderDetail(workOrderStore.workOrderRequest?.workOrderParentId)
    } else {
      workOrderData.value = {
        ...workOrderData.value,
        workOrderStatusCode: 'W',
        workOrderNo: workOrderStore.workOrderRequest?.workOrderNo || "",
        peaOffice: workOrderStore.workOrderRequest?.peaOffice || "",
        officePlant: workOrderStore.workOrderRequest?.officePlant || "",
        costCenter: workOrderStore.workOrderRequest?.costCenter || "",
        peaNameFull: workOrderStore.workOrderRequest?.peaNameFull || workOrderStore.workOrderRequest?.peaOffice || "",
        priority: 2,

        //สร้างใบสั่งงาน อ้างอิงใบคำร้อง ต้องมีข้อมูล customer
        customerName: workOrderStore.workOrderRequest?.customerName || "",
        customerMobileNo: workOrderStore.workOrderRequest?.customerMobileNo || "",
        customerAddress: workOrderStore.workOrderRequest?.customerAddress || "",
      };
    }
  }

  if (!isEdit.value && !isExecute.value) {
    await saveWorkOrder("")
  }
})

const fetchWorkOrderDetail = async (workOrder: string) => {
  showProgress()
  await getWorkOrderDetail(workOrder, isExecute.value).then((res) => {
    if (res.status === 200 && res.data.data) {
      let startDate: Date | string | undefined | null = ""
      let endDate: Date | string | undefined | null = ""
      if (isExecute.value) {
        let execution = res.data.data.execution
        startDate = execution.startDateTime ? formatIsoToDisplay(execution.startDateTime) : null
        endDate = execution.endDateTime ? formatIsoToDisplay(execution.endDateTime) : null
      } else if (isEdit.value) {
        startDate = res.data.data.startWorkDate ? formatIsoToDisplay(res.data.data.startWorkDate) : null
        endDate = res.data.data.endWorkDate ? formatIsoToDisplay(res.data.data.endWorkDate) : null
      }

      let serviceSpecData = res.data.data.serviceSpecificationData || res.data.data.serviceSpecificData
      workOrderData.value = {
        ...res.data.data,
        id: id.value,
        workOrderNo: workOrderStore.workOrderRequest?.workOrderNo || res.data.data.workOrderNo || "",
        serviceSpecificData: {
          ...serviceSpecData
        },
        appointmentDate: res.data.data.appointmentDate ? formatIsoToDisplay(res.data.data.appointmentDate) : null,
        startWorkDate: startDate,
        endWorkDate: endDate,
        latitude: res.data.data.latitude || res.data.data.execution?.latitude || null,
        longitude: res.data.data.longitude || res.data.data.execution?.longitude || null,
        executionDetail: res.data.data?.execution?.executionDetail || "",
        serviceSatisfaction: res.data.data?.execution?.serviceSatisfaction || "",
        satisfactionComment: res.data.data?.execution?.satisfactionComment || "",
        recorderName: res.data.data?.execution?.recorderName || "",
        recorderPosition: res.data.data?.execution?.recorderPosition || "",
        recorderPhoneNumber: res.data.data?.execution?.recorderPhoneNumber || "",
      }

      if (workOrderStore.workOrderRequest?.workOrderParentNo) {
        //สร้างใบสั่งงาน อ้างอิงใบสั่งงานหลัก
        workOrderData.value.workOrderStatusCode = "W"
      }

      if (workOrderData.value.workOrderStatusCode !== "W") {
        steps.value.push({name: "ผลปฏิบัติงาน", icon: "/assets/images/pen.png"});
      }
    }
  }).finally(() => {
    dismissPopup()
  })
}

const steps = ref([
  {name: "ข้อมูลลูกค้า", icon: "/assets/images/doc.png"},
  {name: "ผู้ปฏิบัติงาน", icon: "/assets/images/user.png"},
  {name: "อุปกรณ์ที่ติดตั้ง", icon: "/assets/images/material.png"},
]);

// Breadcrumb title based on request code
const breadcrumbTitle = computed(() => {
  const titles: { [key: string]: string } = {
    s301: "สร้างใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    s302: "สร้างใบสั่งงาน ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์",
    s303: "สร้างใบสั่งงาน ขอตรวจสอบและบำรุงรักษาเคเบิล",
    s304: "สร้างใบสั่งงาน ขอตรวจสอบและบำรุงรักษารีเลย์",
    s305: "สร้างใบสั่งงาน ขอบำรุงรักษาหม้อแปลงไฟฟ้า",
    s306: "สร้างใบสั่งงาน ขอแก้ไขและบำรุงรักษาระบบจำหน่าย",
    s307: "สร้างใบสั่งงาน ขอแก้ไข/บำรุงรักษาระบบจำหน่ายโดย Hotline",
    s308: "สร้างใบสั่งงาน ขอตรวจสอบระบบไฟฟ้าพร้อมออกใบรับรอง",
    s309: "สร้างใบสั่งงาน ขอตรวจหาจุดร้อน/จุดสัมผัสทางไฟฟ้า",
    s310: "สร้างใบสั่งงาน ขอปรึกษาด้านวิศวกรรมไฟฟ้า/ตรวจรับรองระบบ",
    s311: "สร้างใบสั่งงาน ขอปรึกษาด้านวิศวกรรมและก่อสร้าง",
    s312: "สร้างใบสั่งงาน ขอทดสอบอุปกรณ์ไฟฟ้า",
    s314: "สร้างใบสั่งงาน ขอเช่าฉนวนครอบสายไฟฟ้า",
    s315: "สร้างใบสั่งงาน ขอเช่าหม้อแปลง",
    s316: "สร้างใบสั่งงาน สร้างใบสั่งงาน ขอเช่าเครื่องกำเนิดไฟฟ้า",
    s317: "สร้างใบสั่งงาน ขอติดตั้งมิเตอร์เปรียบเทียบ TOU",
    S318: "สร้างใบสั่งงาน ขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า",
    s319: "สร้างใบสั่งงาน ขอซื้อข้อมูล Load Profile",
    s320: "สร้างใบสั่งงาน ขอติดตั้งมิเตอร์เปรียบเทียบ กรณีผิดปกติ",
    s322: "สร้างใบสั่งงาน ขอตรวจสอบและบำรุงรักษาระบบไฟฟ้า แบบครบวงจร (Package)",
    s323: "สร้างใบสั่งงาน ขอทดสอบผลิตภัณฑ์คอนกรีต",
    s329: "สร้างใบสั่งงาน ขอซื้อขายใบรับรองการผลิตพลังงานหมุนเวียน",
    s399: "สร้างใบสั่งงาน ขอบริการอื่นๆ",
    s332_Solar_Air_Conditioner: "สร้างใบสั่งงาน Solar Air Conditioner",
    s332_Solar_Battery: "สร้างใบสั่งงาน Solar Battery",
  };
  return titles[requestCode.value] || "สร้างใบสั่งงาน";
});

// Methods
const updateCurrentStep = (step: number) => {
  currentStep.value = step;
};

const goToNextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
};

const goToPreviousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const getPreviousStepName = () => {
  if (currentStep.value > 0) {
    return steps.value[currentStep.value - 1].name;
  }
  return "";
};

const getNextStepName = () => {
  if (currentStep.value < steps.value.length - 1) {
    return steps.value[currentStep.value + 1].name;
  }
  return "";
};

const updateWorkOrderData = (data: WorkOrderObj) => {
  workOrderData.value = data
  console.log('workOrderData.value >>>> ', workOrderData.value)
};

watch(() => workOrderData.value, (newVal) => {
  console.log('newVal >>> ', newVal)
}, {deep: true})

/*const updateWorkExecutionData = (data: any) => {
  Object.assign(workExecutionData, data);
};*/

const handleSurveyImagesUpdate = (images: any) => {
  workOrderData.value.surveyImages = images;
};

const showRelationship = () => {
  showRelationshipsPanel.value = true
  console.log('Opening relationships panel')
}

const showHistory = () => {
  console.log("แสดง History");
};

const cancelWorkOrder = () => {
  showConfirm('ยืนยันยกเลิกใบสั่งงาน', 'คุณต้องการยกเลิกใบสั่งงานใช่หรือไม่?').then(async (isConfirm: boolean) => {
    if (isConfirm) {
      try {
        const res = await updateWorkOrderStatus(id.value, 'Z')
        if (res.status === 200) {
          showSuccess('ยกเลิกใบสั่งงานสำเร็จ').then(() => {
            window.location.href = `/work_order/list`
          })
        }
      } catch (e) {
        showError('ยกเลิกใบสั่งงานไม่สำเร็จ')
      }
    }
  })
};

const confirmCreateWorkOrder = () => {
  showConfirm('ยืนยันสร้างใบสั่งงาน', 'ท่านต้องการยืนยันการสร้างใบสั่งงานนี้หรือไม่?').then((isConfirm: boolean) => {
    if (isConfirm) {
      saveWorkOrder('M')
    }
  })
}

const saveWorkOrder = async (status: string) => {
  showProgress()
  let equipments = workOrderData.value?.equipments?.map((eq, index) => {
    delete eq.isUpdate
    delete eq.availableStock
    return eq
  }) as MaterialEquipmentObj[]

  let items: WorkOrderObj = {
    ...workOrderData.value,
    equipments: equipments,
    customerLatitude: workOrderData.value.customerLatitude ? parseFloat(workOrderData.value.customerLatitude as string) : 0,
    customerLongitude: workOrderData.value.customerLongitude ? parseFloat(workOrderData.value.customerLongitude as string) : 0,
    appointmentDate: workOrderData.value.appointmentDate ? dateFormatBy(toTimestamp(workOrderData.value.appointmentDate as string), 'YYYY-MM-DDTHH:mm:ss') : null,
    startWorkDate: workOrderData.value.startWorkDate ? dateFormatBy(toTimestamp(workOrderData.value.startWorkDate as string), 'YYYY-MM-DDTHH:mm:ss') : null,
    endWorkDate: workOrderData.value.endWorkDate ? dateFormatBy(toTimestamp(workOrderData.value.endWorkDate as string), 'YYYY-MM-DDTHH:mm:ss') : null
  }

  try {
    let res = null
    if (workOrderData.value.workOrderStatusCode === "M") {
      await updateWorkOrderStatus(id.value, "O");
    }

    if (["M", "O"].includes(workOrderData.value.workOrderStatusCode)) {
      res = await executeWorkOrder(id.value, items);
    } else {
      res = await updateWorkOrder(workOrderData.value.workOrderNo, items);
    }
    if (res.status === 200) {
      if (status && status === "M") {
        await updateWorkOrderStatus(id.value, status);
      }

      const param = new URLSearchParams({
        id: id.value,
        isEdit: res.data?.data?.workOrderStatusCode === "W" ? 'true' : 'true',
        isExecute: !["W", "M"].includes(res.data?.data?.workOrderStatusCode) ? 'true' : 'false'
      })

      console.log('isEdit.value >>>> ', isEdit.value)
      console.log('isExecute.value >>>> ', isExecute.value)
      if (isEdit.value || isExecute.value) {
        showSuccess('บันทึกใบสั่งงานสำเร็จ').then(() => {
          window.location.href = `/work_order/create_or_update/${requestCode.value}?${param.toString()}`
        })
      } else {
        router.push(`/work_order/create_or_update/${requestCode.value}?id=${id.value}&isEdit=true`)
        dismissPopup()
      }
    } else {
      showError('บันทึกใบสั่งงานไม่สำเร็จ')
    }
  } catch (e) {
    showError('บันทึกใบสั่งงานไม่สำเร็จ')
  }
};

const editWorkOrder = () => {
  console.log("แก้ไขใบงาน");
};

const completeWorkOrder = () => {
  console.log("จบงาน");
};

const completeWorkOrderInIcs = () => {
  console.log("สิ้นสุดการกระบวนการ");
};
</script>
