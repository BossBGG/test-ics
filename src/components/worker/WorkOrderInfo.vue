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
  // You can implement screen size detection here
  return true
})
</script>

<template>
  <CardCollapse 
    title="รายละเอียดคำร้อง" 
    :is-show-header="!isDesktop"
  >
    <div class="work-order-form">
      <div class="form-grid">
        <!-- เลขที่ใบสั่งงาน -->
        <div class="form-group form-group-1">
          <label class="form-label">เลขที่ใบสั่งงาน</label>
          <q-input
            :model-value="data.order_no"
            outlined
            placeholder="เลขที่ใบสั่งงาน"
            class="form-input"
            readonly
          />
        </div>

        <!-- เลขที่คำร้อง -->
        <div class="form-group form-group-1">
          <label class="form-label">เลขที่คำร้อง</label>
          <q-input
            :model-value="data.request_no"
            outlined
            placeholder="เลขที่คำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <!-- เลขที่คำร้อง (SAP) -->
        <div class="form-group form-group-1">
          <label class="form-label">เลขที่คำร้อง (SAP)</label>
          <q-input
            :model-value="data.request_sap_no"
            outlined
            placeholder="เลขที่คำร้อง (SAP)"
            class="form-input"
            readonly
          />
        </div>

        <!-- ประเภทคำร้อง -->
        <div class="form-group form-group-1">
          <label class="form-label">ประเภทคำร้อง</label>
          <q-input
            :model-value="data.request_type"
            outlined
            placeholder="ประเภทคำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <!-- สถานะคำร้อง -->
        <div class="form-group form-group-1">
          <label class="form-label">สถานะคำร้อง</label>
          <q-input
            :model-value="data.request_status"
            outlined
            placeholder="สถานะคำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <!-- ลำดับความสำคัญของงาน -->
        <div class="form-group form-group-2">
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

        <!-- วันที่รับชำระเงิน -->
        <div class="form-group form-group-2">
          <label class="form-label">วันที่รับชำระเงิน</label>
          <q-input
            :model-value="data.payment_received_date"
            outlined
            placeholder="วันที่รับชำระเงิน"
            class="form-input"
            readonly
          />
        </div>

        <!-- คำอธิบายการทำงาน -->
        <div class="form-group form-group-2">
          <label class="form-label">คำอธิบายการทำงาน</label>
          <q-input
            :model-value="data.work_description"
            outlined
            placeholder="คำอธิบายการทำงาน"
            class="form-input"
            readonly
          />
        </div>

        <!-- กอง/กฟฟ. -->
        <div class="form-group form-group-3">
          <label class="form-label">กอง/กฟฟ.</label>
          <q-input
            :model-value="data.division"
            outlined
            placeholder="กอง/กฟฟ."
            class="form-input"
            readonly
          />
        </div>

        <!-- รหัสโรงงาน -->
        <div class="form-group form-group-3">
          <label class="form-label">รหัสโรงงาน</label>
          <q-input
            :model-value="data.plant_code"
            outlined
            placeholder="รหัสโรงงาน"
            class="form-input"
            readonly
          />
        </div>

        <!-- ศูนย์งาน -->
        <div class="form-group form-group-3">
          <label class="form-label">ศูนย์งาน</label>
          <q-input
            :model-value="data.operation_center"
            outlined
            placeholder="ศูนย์งาน"
            class="form-input"
            readonly
          />
        </div>

        <!-- ศูนย์ต้นทุน -->
        <div class="form-group form-group-3">
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group-1 {
  grid-column: span 1;
}

.form-group-2 {
  grid-column: span 2;
}

.form-group-3 {
  grid-column: span 1;
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
  background-color: #f9fafb;
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
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .form-group-1,
  .form-group-2,
  .form-group-3 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .form-group-1,
  .form-group-2,
  .form-group-3 {
    grid-column: span 1;
  }
}
</style>