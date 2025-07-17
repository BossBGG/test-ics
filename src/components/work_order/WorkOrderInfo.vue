<!-- src/components/work_order/WorkOrderInfo.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'

interface WorkOrderData {
  order_no: string
  request_no: string
  request_sap_no: string
  request_type: string
  request_status: string
  job_priority: string
  payment_received_date: string
  work_description: string
  division: string
  plant_code: string
  operation_center: string
  cost_center: string
}

interface Props {
  data: WorkOrderData
}

const props = defineProps<Props>()

const jobPriorityOptions = [
  { value: '1', label: 'สำคัญมาก (24 ชม.)' }
]

const isDesktop = computed(() => {
  return true
})
</script>

<template>
  <CardCollapse 
    title="รายละเอียดคำร้อง" 
    
  >
    <div class="work-order-form">
      <!-- Row 1: เลขที่ใบสั่งงาน, เลขที่คำร้อง, เลขที่คำร้อง (SAP), ประเภทคำร้อง, สถานะคำร้อง -->
      <div class="form-row-1">
        <div class="form-group">
          <label class="form-label">เลขที่ใบสั่งงาน</label>
          <q-input
            :model-value="data.order_no"
            outlined
            placeholder="เลขที่ใบสั่งงาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">เลขที่คำร้อง</label>
          <q-input
            :model-value="data.request_no"
            outlined
            placeholder="เลขที่คำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">เลขที่คำร้อง (SAP)</label>
          <q-input
            :model-value="data.request_sap_no"
            outlined
            placeholder="เลขที่คำร้อง (SAP)"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ประเภทคำร้อง</label>
          <q-input
            :model-value="data.request_type"
            outlined
            placeholder="ประเภทคำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">สถานะใบร้อง</label>
          <q-input
            :model-value="data.request_status"
            outlined
            placeholder="สถานะคำร้อง"
            class="form-input"
            readonly
          />
        </div>
      </div>

      <!-- Row 2: ลำดับความสำคัญของงาน, วันที่รับชำระเงิน, คำอธิบายการทำงาน -->
      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">ลำดับความสำคัญของงาน</label>
          <q-select
            :model-value="data.job_priority"
            :options="jobPriorityOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="ลำดับความสำคัญของงาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">วันที่ชำระเงิน</label>
          <q-input
            :model-value="data.payment_received_date"
            outlined
            placeholder="วันที่รับชำระเงิน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">คำอธิบายการทำงาน</label>
          <q-input
            :model-value="data.work_description"
            outlined
            placeholder="คำอธิบายการทำงาน"
            class="form-input"
            readonly
          />
        </div>
      </div>

      <!-- Row 3: กอง/กฟฟ., รหัสโรงงาน, ศูนย์งาน, ศูนย์ต้นทุน -->
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">กอง/กฟฟ.</label>
          <q-input
            :model-value="data.division"
            outlined
            placeholder="กอง/กฟฟ."
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">รหัสโรงงาน</label>
          <q-input
            :model-value="data.plant_code"
            outlined
            placeholder="รหัสโรงงาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ศูนย์งาน</label>
          <q-input
            :model-value="data.operation_center"
            outlined
            placeholder="ศูนย์งาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ศูนย์ต้นทุน</label>
          <q-input
            :model-value="data.cost_center"
            outlined
            placeholder="ศูนย์ต้นทุน"
            class="form-input"
            readonly
          />
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.work-order-form {
  padding: 8px 0;
}

.form-row-1,
.form-row-2,
.form-row-3 {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row-1 {
  grid-template-columns: repeat(5, 1fr);
}

.form-row-2 {
  grid-template-columns: repeat(3, 1fr);
}

.form-row-3 {
  grid-template-columns: repeat(4, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .form-row-1 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .form-row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-row-1,
  .form-row-2,
  .form-row-3 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>