<!-- src/components/work_order/WorkOrderInfo.vue -->
<script setup lang="ts">
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import {Options, WorkOrderObj} from "~/api/types";
import {WORK_ORDER_STATUS_MAP} from "~/api/work_order_api";

interface Props {
  data: WorkOrderObj
}

defineProps<Props>()

const jobPriorityOptions: Options[] = [
  {value: 1, label: 'สำคัญมาก (24 ชม.)'},
  {value: 2, label: 'สำคัญปานกลาง (2 วัน)'},
  {value: 3, label: 'ปกติ (5 วัน)'}
]

const getWorkOrderStatusLabel = (statusCode: string): string => {
  return WORK_ORDER_STATUS_MAP[statusCode] || statusCode;
}
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
            v-model="data.workOrderNo"
            outlined
            placeholder="เลขที่ใบสั่งงาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">เลขที่คำร้อง</label>
          <q-input
            :model-value="data.customerRequestNo"
            outlined
            placeholder="เลขที่คำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">เลขที่คำร้อง (SAP)</label>
          <q-input
            :model-value="data.requestSapNo"
            outlined
            placeholder="เลขที่คำร้อง (SAP)"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ประเภทคำร้อง</label>
          <q-input
            :model-value="data.requestType"
            outlined
            placeholder="ประเภทคำร้อง"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">สถานะใบร้อง</label>
          <q-input
            :model-value="getWorkOrderStatusLabel(data.workOrderStatusCode)"
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
            v-model="data.priority"
            :options="jobPriorityOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            placeholder="ลำดับความสำคัญของงาน"
            class="form-input"
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
            :model-value="data.workDescription"
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
            :model-value="data.peaNameFull"
            outlined
            placeholder="กอง/กฟฟ."
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">รหัสโรงงาน</label>
          <q-input
            :model-value="data.officePlant"
            outlined
            placeholder="รหัสโรงงาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ศูนย์งาน</label>
          <q-input
            :model-value="data.mainWorkCenterId"
            outlined
            placeholder="ศูนย์งาน"
            class="form-input"
            readonly
          />
        </div>

        <div class="form-group">
          <label class="form-label">ศูนย์ต้นทุน</label>
          <q-input
            :model-value="data.costCenter"
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
