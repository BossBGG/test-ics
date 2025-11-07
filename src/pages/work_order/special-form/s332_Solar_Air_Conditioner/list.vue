<!-- src/pages/work_order/special-form/s301/list.vue -->
<template>
  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'สร้าง', link: '/work_order' },
      { text: 'สร้างใบสั่งงาน Solar Air Conditioner' },
    ]"
  >
    <template #menu>
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
    </template>

    <!-- Work Order Info -->
    <WorkOrderInfo :data="workOrderData" />

    <!-- Work Order Steps -->
    <WorkOrderStep
      :steps="steps"
      :current-step="currentStep"
      @update:step="updateCurrentStep"
    />

    <!-- Step Content -->
    <div v-if="currentStep === 0">
      <!-- Customer Information with slot for additional components -->
      <CustomerInfo :data="customerData" @update:data="updateCustomerData">
      </CustomerInfo>

      <CardCollapse title="ข้อมูลการสำรวจ" icon="/assets/images/map-icon.png">
        <SurveyDataSolarAirConditioner
          v-model="surveyImages"
          :survey-data="surveyData"
          @images-change="handleImagesChange"
        />
      </CardCollapse>

      <AdditionalData
        v-model="workOrderData.additionalData"
        @data-change="handleAdditionalDataUpdate"
      />
    </div>

    <div v-else-if="currentStep === 1">
      <!-- Worker Information -->
      <AddWorker />
      <DateAppointment
        :data="appointmentData"
        @update:data="updateAppointmentData"
      />
    </div>

    <div v-else-if="currentStep === 2">
      <!-- Equipment Management -->
       <ResponsiblePersonComponent
        v-model="responsiblePersons"
        :options="{
          isReadOnly: false,
          showAddButton: true,
          showDeleteAllButton: true,
          showActionColumn: true,
        }"
        @data-change="handleDataChange"
      />
      <AddMaterial />
    </div>

    <div v-else-if="currentStep === 3">
      <!-- Work Results -->
      <WorkExecution
        :data="workExecutionData"
        @update:data="updateWorkExecutionData"
      />

      <CardCollapse title="รูปแนบเพิ่มเติม" icon="/assets/images/doc.png">
        <SurveyDataSolarAirConditioner
          v-model="surveyImages"
          :show-survey-table="false"
          @images-change="handleImagesChange"
        />
      </CardCollapse>

      <Video 
      v-model="videoData"
      @videos-change="handleVideosChange"
      />

      <Comment
        v-model="commentText"
        :max-length="250"
        @comment-change="handleCommentChange"
      />

      <SatisfactionAssessment
        v-model="workOrderData.satisfaction"
        @data-change="handleSatisfactionUpdate"
      />

      <RecordKeeper
        v-model="workOrderData.recordKeeper"
        @data-change="handleRecordKeeperUpdate"
      />
    </div>

    <!-- Step Navigation -->
    <div class="step-navigation">
      <!-- Previous Step Button -->
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

      <!-- Spacer -->
      <div class="nav-spacer"></div>

      <!-- Next Step Button -->
      <button
        v-if="currentStep < steps.length - 1"
        @click="goToNextStep"
        class="nav-button next-button"
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
      <div v-if="currentStep === 3" class="action-buttons-grid">
        <!-- ปุ่มแก้ไขใบงาน (step 3) -->
        <button class="action-button end-step-edit-btn" @click="editWorkOrder">
          <q-icon name="edit" class="action-icon" />
          แก้ไขใบงาน
        </button>

        <!-- ปุ่มสิ้นสุดการกระบวนการ (step 3) -->
        <button class="action-button complete-btn" @click="completeWorkOrder">
          สิ้นสุดการกระบวนการบน ICS ดำเนินการต่อบน SAP
        </button>
      </div>

      <!-- ปุ่มเดิมสำหรับ step อื่นๆ -->
      <div v-else class="action-buttons-grid">
        <button class="action-button cancel-btn" @click="cancelWorkOrder">
          ยกเลิกใบสั่งงาน
        </button>

        <button class="action-button save-success-btn" @click="saveWorkOrder">
          <img src="/assets/images/save-btn.png" alt="" class="save-icon-btn" />
          บันทึก
        </button>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import ContentContainer from "~/layouts/ContentContainer.vue";
import WorkOrderInfo from "~/components/work_order/WorkOrderInfo.vue";
import WorkOrderStep from "~/components/work_order/WorkOrderStep.vue";
import CustomerInfo from "~/components/work_order/CustomerInfo.vue";
import AddWorker from "~/components/worker/AddWorker.vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import DateAppointment from "~/components/worker/DateAppointment.vue";
import AddMaterial from "~/components/material_equipment_list/AddMaterial.vue";
import WorkExecution from "~/components/work_execution/WorkExecution.vue";
import AddImages from "~/components/work_execution/AddImages.vue";
import AddFile from "~/components/work_execution/AddFile.vue";
import Comment from "~/components/work_execution/Comment.vue";
import SatisfactionAssessment from "~/components/work_execution/SatisfactionAssessment.vue";
import RecordKeeper from "~/components/work_execution/RecordKeeper.vue";
import SurveyDataSolarAirConditioner from "~/pages/work_order/special-form/s332_Solar_Air_Conditioner/SurveyDataSolarAirConditioner.vue";
import AdditionalData from "~/pages/work_order/special-form/s332_Solar_Air_Conditioner/AdditionalData.vue";
import Video from '~/pages/work_order/special-form/s332_Solar_Air_Conditioner/Video.vue'

import { ref, reactive } from "vue";

// Import CSS
import "@/styles/workorder.css";

// Reactive data
const currentStep = ref(0);

const steps = [
  { name: "ข้อมูลลูกค้า", icon: "/assets/images/doc.png" },
  { name: "ผู้ปฏิบัติงาน", icon: "/assets/images/user.png" },
  { name: "อุปกรณ์ที่ติดตั้ง", icon: "/assets/images/material.png" },
  
];

const workOrderData = reactive({
  order_no: "250412001465",
  request_no: "250412000002",
  request_sap_no: "130005697552",
  request_type: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
  request_status: "รอเปิดใบสั่งงาน/เบิกจ่ายพัสด",
  job_priority: "สำคัญมาก (24 ชม.)",
  payment_received_date: "14 ธันวาคม 2566",
  work_description: "BPPMMS01",
  division: "การไฟฟ้าอ้อมน้อย",
  plant_code: "I010  กฟอ.นครชัยศรี",
  operation_center: "BPPMMS01",
  cost_center: "A307101070",
  satisfaction: {
    rating: 0,
    comment: "",
    signature: "",
  },
  recordKeeper: {
    employeeId: "356579 - นาย มงคล ธรรมปัญโน",
    position: "คช 8",
    phoneNumber: "098 - 84950689",
    signature: "",
  },
  businessType: "",
  surveyImages: [],
  surveyData: [],
});

const customerData = reactive({
  name: "",
  tel: "",
  address: "",
  latitude: "",
  longitude: "",
});

const appointmentData = reactive({
  appointmentDate: "",
  appointmentTime: "",
});

const workExecutionData = reactive({
  startDateTime: "",
  endDateTime: "",
  images: [],
});

const handleSurveyImagesUpdate = (images) => {
  workOrderData.surveyImages = images;
};

const files = ref([]);

// Methods
const updateCurrentStep = (step: number) => {
  currentStep.value = step;
};

const goToNextStep = () => {
  if (currentStep.value < steps.length - 1) {
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
    return steps[currentStep.value - 1].name;
  }
  return "";
};

const getNextStepName = () => {
  if (currentStep.value < steps.length - 1) {
    return steps[currentStep.value + 1].name;
  }
  return "";
};

const handleBusinessTypeUpdate = (value) => {
  workOrderData.businessType = value;
  // บันทึกข้อมูลหรือส่งไป API
};

const updateCustomerData = (data: any) => {
  Object.assign(customerData, data);
};

const updateAppointmentData = (data: any) => {
  Object.assign(appointmentData, data);
};

const updateWorkExecutionData = (data: any) => {
  Object.assign(workExecutionData, data);
};

const showRelationship = () => {
  console.log("แสดงความสัมพันธ์ใบสั่งงาน");
};

const showHistory = () => {
  console.log("แสดง History");
};

const openGoogleMap = () => {
  console.log("เปิด Google Map");
};

const cancelWorkOrder = () => {
  console.log("ยกเลิกใบสั่งงาน");
};

const saveWorkOrder = () => {
  console.log("บันทึกใบสั่งงาน");
};
</script>
