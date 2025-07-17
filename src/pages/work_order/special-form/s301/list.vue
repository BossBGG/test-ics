<!-- src/pages/work_order/special-form/s301/list.vue -->
<template>
  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'ใบสั่งงาน', link: '/work_order' },
      { text: 'สร้างใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า' }
    ]"
  >
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">สร้างใบสั่งงาน</h1>
        <h2 class="page-subtitle">ขอซ่อมแซมอุปกรณ์ไฟฟ้า</h2>
      </div>
      
      <div class="header-actions">
        <button class="header-action-btn" @click="showRelationship">
          <svg class="header-action-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          แสดงความสัมพันธ์ใบสั่งงาน
        </button>

        <button class="header-action-btn icon-only" @click="showHistory" title="History">
          <svg class="header-action-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Work Order Info -->
    <WorkOrderInfo :data="workOrderData" />

    <!-- Work Order Steps -->
    <WorkOrderStep 
      :steps="steps" 
      :current-step="currentStep"
      @update:step="updateCurrentStep"
    />

    <!-- Customer Information -->
    <CustomerInfo 
      :data="customerData"
      @update:data="updateCustomerData"
    />

    <!-- Customer Address Section -->
    <div class="customer-section">
      <h3 class="section-title">
        <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        ข้อมูลลูกค้าและวิสดุอุปกรณ์
      </h3>

      <!-- Address Section -->
      <div class="address-section">
        <div class="address-grid">
          <div class="address-item">
            <span class="address-label">ชื่องาน:</span>
            <span class="address-value">กิจกรรมใหม่</span>
          </div>

          <div class="address-item">
            <span class="address-label">โครงการงาน:</span>
            <span class="address-value">โครงการใหม่</span>
          </div>

          <div class="address-item">
            <span class="address-label">ที่อยู่งาน:</span>
            <span class="address-value"></span>
          </div>

          <div class="address-item">
            <span class="address-label">รหัสลูกค้า:</span>
            <span class="address-value"></span>
          </div>

          <div class="address-item">
            <span class="address-label">Latitude:</span>
            <span class="address-value"></span>
          </div>

          <div class="address-item">
            <span class="address-label">Longitude:</span>
            <span class="address-value"></span>
          </div>
        </div>

        <!-- Google Map Button -->
        <div class="map-section">
          <button class="map-button" @click="openGoogleMap">
            <svg class="map-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            ไป Google map
          </button>
        </div>
      </div>

      <!-- Equipment List -->
      <div class="equipment-section">
        <h4 class="equipment-title">รายการอุปกรณ์ใหม่</h4>
        
        <div class="equipment-table">
          <div class="table-header">
            <div class="table-cell">ลำดับ</div>
            <div class="table-cell">ประเภทอุปกรณ์ใหม่</div>
            <div class="table-cell">จำนวน</div>
            <div class="table-cell">การจัดการ</div>
          </div>

          <div class="table-row">
            <div class="table-cell">1.</div>
            <div class="table-cell">ประเภทอุปกรณ์ใหม่</div>
            <div class="table-cell">
              <input type="number" value="1" class="quantity-input" />
            </div>
            <div class="table-cell">
              <div class="action-buttons">
                <button class="action-btn edit-btn" @click="editEquipment(0)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="m18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="action-btn delete-btn" @click="deleteEquipment(0)">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Equipment Button -->
        <button class="add-equipment-btn" @click="addEquipment">
          <svg class="add-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          เพิ่มอุปกรณ์
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <div class="action-buttons-grid">
        <button class="action-button cancel-btn" @click="cancelWorkOrder">
          ยกเลิกใบสั่งงาน
        </button>

        <button class="action-button save-btn" @click="saveWorkOrder">
          บันทึก
        </button>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import ContentContainer from "@/layouts/ContentContainer.vue"
import WorkOrderInfo from "@/components/work_order/WorkOrderInfo.vue"
import WorkOrderStep from "@/components/work_order/WorkOrderStep.vue"
import CustomerInfo from "@/components/work_order/CustomerInfo.vue"
import { ref, reactive } from 'vue'

// Import CSS
import '@/styles/workorder.css'

// Reactive data
const currentStep = ref(0)

const steps = [
  { name: "ข้อมูลลูกค้า", icon: "pen" },
  { name: "ผู้ปฏิบัติงาน", icon: "user" },
  { name: "อุปกรณ์ปฏิบัติงาน", icon: "screwdriver" },
  { name: "ผลปฏิบัติงาน", icon: "file" }
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
  email: "",
  bp: "",
  ca: "",
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

const editEquipment = (index: number) => {
  console.log("แก้ไขอุปกรณ์:", index)
}

const deleteEquipment = (index: number) => {
  console.log("ลบอุปกรณ์:", index)
}

const addEquipment = () => {
  console.log("เพิ่มอุปกรณ์")
}

const cancelWorkOrder = () => {
  console.log("ยกเลิกใบสั่งงาน")
}

const saveWorkOrder = () => {
  console.log("บันทึกใบสั่งงาน")
}
</script> 