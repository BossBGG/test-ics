<!-- src/components/work_order/CustomerInfo.vue -->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'

interface Customer {
  name: string
  tel: string
  address: string
  email: string
  bp: string
  ca: string
  latitude: string
  longitude: string
}

interface Props {
  data: Customer
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:data': [value: Customer]
}>()

const customer = reactive<Customer>({ ...props.data })

const handleChange = (key: keyof Customer, value: string) => {
  customer[key] = value
  emit('update:data', { ...customer })
}
</script>

<template>
  <CardCollapse title="ข้อมูลลูกค้า"
  >
    <div class="customer-form">
      <div class="form-grid">
        <!-- ชื่อลูกค้า -->
        <div class="form-group">
          <label class="form-label">ชื่อลูกค้า</label>
          <q-input
            v-model="customer.name"
            outlined
            placeholder="ชื่อลูกค้า"
            class="form-input"
            @update:model-value="(value) => handleChange('name', value)"
          />
        </div>

        <!-- โทรศัพท์มือถือ -->
        <div class="form-group">
          <label class="form-label">โทรศัพท์มือถือ</label>
          <q-input
            v-model="customer.tel"
            outlined
            placeholder="โทรศัพท์มือถือ"
            class="form-input"
            mask="##########"
            maxlength="10"
            @update:model-value="(value) => handleChange('tel', value)"
          />
        </div>

        <!-- ที่อยู่ขอรับบริการ -->
        <div class="form-group">
          <label class="form-label">ที่อยู่ขอรับบริการ</label>
          <q-input
            v-model="customer.address"
            outlined
            placeholder="ที่อยู่ขอรับบริการ"
            class="form-input"
            @update:model-value="(value) => handleChange('address', value)"
          />
        </div>

        <!-- อีเมล -->
        <div class="form-group">
          <label class="form-label">อีเมล</label>
          <q-input
            v-model="customer.email"
            outlined
            placeholder="อีเมล"
            type="email"
            class="form-input"
            @update:model-value="(value) => handleChange('email', value)"
          />
        </div>

        <!-- BP -->
        <div class="form-group">
          <label class="form-label">BP</label>
          <q-input
            v-model="customer.bp"
            outlined
            placeholder="BP"
            class="form-input"
            @update:model-value="(value) => handleChange('bp', value)"
          />
        </div>

        <!-- CA -->
        <div class="form-group">
          <label class="form-label">CA</label>
          <q-input
            v-model="customer.ca"
            outlined
            placeholder="CA"
            class="form-input"
            @update:model-value="(value) => handleChange('ca', value)"
          />
        </div>

        <!-- Latitude -->
        <div class="form-group">
          <label class="form-label">Latitude</label>
          <q-input
            v-model="customer.latitude"
            outlined
            placeholder="Latitude"
            class="form-input"
            @update:model-value="(value) => handleChange('latitude', value)"
          />
        </div>

        <!-- Longitude -->
        <div class="form-group">
          <label class="form-label">Longitude</label>
          <q-input
            v-model="customer.longitude"
            outlined
            placeholder="Longitude"
            class="form-input"
            @update:model-value="(value) => handleChange('longitude', value)"
          />
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.customer-form {
  padding: 8px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
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
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>