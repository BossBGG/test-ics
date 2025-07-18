<!-- src/pages/work_order/special-form/s301/list.vue -->
<template>
  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'ใบสั่งงาน', link: '/work_order' },
      { text: 'สร้างใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า' },
    ]"
  >
    <template #menu>
      <div class="header-actions">
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

    <!-- Customer Information with slot for additional components -->
    <CustomerInfo :data="customerData" @update:data="updateCustomerData">
      <!-- Additional components can be passed here -->
      <template #additional-content>
        <EquipmentInfo />
      </template>
    </CustomerInfo>

    <!-- Equipment Information -->
    <div class="next-step">
      <div class="">
        ผู้ปฏิบัติงาน
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <div class="action-buttons-grid">
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
import EquipmentInfo from "~/pages/work_order/special-form/s301/EquipmentInfo.vue";
import { ref, reactive } from "vue";

// Import CSS
import "@/styles/workorder.css";

// Reactive data
const currentStep = ref(0);

const steps = [
  { name: "ข้อมูลลูกค้า", icon: "/assets/images/doc.png" },
  { name: "ผู้ปฏิบัติงาน", icon: "/assets/images/user.png" },
  { name: "อุปกรณ์ปฏิบัติงาน", icon: "/assets/images/material.png" },
  { name: "ผลปฏิบัติงาน", icon: "/assets/images/write.png" },
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
});

const customerData = reactive({
  name: "",
  tel: "",
  address: "",
  latitude: "",
  longitude: "",
});

// Methods
const updateCurrentStep = (step: number) => {
  currentStep.value = step;
};

const updateCustomerData = (data: any) => {
  Object.assign(customerData, data);
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

