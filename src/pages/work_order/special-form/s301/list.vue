<!-- src/pages/work_order/special-form/s301/list.vue -->
<template>
  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'ใบสั่งงาน', link: '/work_order' },
      { text: 'สร้างใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า' }
    ]"
  >
    <template #menu>
      <div class="header-actions">
        <button class="header-action-btn" @click="showRelationship">
          <img src="/assets/images/link.png" alt="" class="header-action-link-icon">
          แสดงความสัมพันธ์ใบสั่งงาน
        </button>

        <button class="header-action-btn icon-only" @click="showHistory" title="History">
          <img src="/assets/images/history.png" alt="" class="header-action-icon">
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
    <CustomerInfo 
      :data="customerData"
      @update:data="updateCustomerData"
    >
      <!-- Additional components can be passed here -->
      <template #additional-content>
        <EquipmentInfo />
      </template>
    </CustomerInfo>

    <!-- Equipment Information -->
    

    

    <!-- Action Buttons -->
    <div class="action-section">
      <div class="action-buttons-grid">
        <button class="action-button cancel-btn" @click="cancelWorkOrder">
          ยกเลิกใบสั่งงาน
        </button>

        <button class="action-button save-success-btn" @click="saveWorkOrder">
          บันทึก
        </button>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import ContentContainer from "~/layouts/ContentContainer.vue"
import WorkOrderInfo from "~/components/work_order/WorkOrderInfo.vue"
import WorkOrderStep from "~/components/work_order/WorkOrderStep.vue"
import CustomerInfo from "~/components/work_order/CustomerInfo.vue"
import EquipmentInfo from "~/components/work_order/EquipmentInfo.vue"
import { ref, reactive } from 'vue'

// Import CSS
import '@/styles/workorder.css'

// Reactive data
const currentStep = ref(0)

const steps = [
  { name: "ข้อมูลลูกค้า", icon: "/assets/images/doc.png" },
  { name: "ผู้ปฏิบัติงาน", icon: "/assets/images/user.png" },
  { name: "อุปกรณ์ปฏิบัติงาน", icon: "/assets/images/material.png" },
  { name: "ผลปฏิบัติงาน", icon: "/assets/images/write.png" }
]

const workOrderData = reactive({
  order_no: "250412001465",
  request_no: "250412000002",
  request_sap_no: "130005697552",
  request_type: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า (2...)",
  request_status: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า/กิจกรรม",
  job_priority: "1",
  payment_received_date: "14 ธ.ค. 2566",
  work_description: "การซ่อมแซม",
  division: "กฟน.อยุธยา",
  plant_code: "BPTV904503",
  operation_center: "1035 อยุธยาเหนือ",
  cost_center: "430116979"
})

const customerData = reactive({
  name: "",
  tel: "",
  address: "",
  latitude: "",
  longitude: ""
})

// Methods
const updateCurrentStep = (step: number) => {
  currentStep.value = step
}

const updateCustomerData = (data: any) => {
  Object.assign(customerData, data)
}

const showRelationship = () => {
  console.log("แสดงความสัมพันธ์ใบสั่งงาน")
}

const showHistory = () => {
  console.log("แสดง History")
}

const openGoogleMap = () => {
  console.log("เปิด Google Map")
}

const cancelWorkOrder = () => {
  console.log("ยกเลิกใบสั่งงาน")
}

const saveWorkOrder = () => {
  console.log("บันทึกใบสั่งงาน")
}
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #69306D;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 44px;
  height: 44px;
}

.header-action-btn:hover {
  background: #5a285d;
  transform: translateY(-2px);
}

.header-action-btn.icon-only {
  padding: 12px;
  min-width: 44px;
}

.header-action-icon {
  width: 20px;
  height: 20px;
}

.header-action-link-icon {
  width: 20px;
  height: 10px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-action-btn {
    font-size: 12px;
    padding: 8px 12px;
  }
  
  .header-action-btn.icon-only {
    padding: 8px;
    min-width: 36px;
    height: 36px;
  }
  
  .header-action-icon {
    width: 16px;
    height: 16px;
  }
}
</style>