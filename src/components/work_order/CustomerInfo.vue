<!-- src/components/work_order/CustomerInfo.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'

interface Customer {
  name: string
  tel: string
  address: string
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

const openGoogleMap = () => {
  const lat = customer.latitude
  const lng = customer.longitude
  
  if (lat && lng) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`
    window.open(url, '_blank')
  } else {
    console.log('กรุณากรอกพิกัด Latitude และ Longitude')
  }
}
</script>

<template>
  <CardCollapse title="ข้อมูลลูกค้าและวิสดุอุปกรณ์" icon="/assets/images/user.png">
    <div class="customer-form">
      <!-- Row 1: ชื่อลูกค้า, โทรศัพท์มือถือ -->
      <div class="form-row-1">
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
      </div>

      <!-- Row 2: ที่อยู่ขอรับบริการ + Google Map Button -->
      <div class="form-row-2">
        <div class="form-group address-group">
          <label class="form-label">ที่อยู่ขอรับบริการ</label>
          <div class="address-input-group">
            <q-input
              v-model="customer.address"
              outlined
              placeholder="ที่อยู่ขอรับบริการ"
              class="form-input address-input"
              @update:model-value="(value) => handleChange('address', value)"
            />
            <button class="map-button" @click="openGoogleMap" type="button">
              <svg class="map-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              ไป Google map
            </button>
          </div>
        </div>
      </div>

      <!-- Row 3: Latitude, Longitude -->
      <div class="form-row-3">
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

      <!-- Slot for additional content -->
      <div v-if="$slots['additional-content']" class="additional-content">
        <slot name="additional-content" />
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.customer-form {
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
  grid-template-columns: 1fr 1fr;
}

.form-row-2 {
  grid-template-columns: 1fr;
}

.form-row-3 {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.address-group {
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

.address-input-group {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.address-input {
  flex: 1;
}

.map-button {
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
  min-width: 140px;
  height: 55px;
  white-space: nowrap;
}

.map-button:hover {
  background: #5a285d;
  transform: translateY(-1px);
}

.map-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.additional-content {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
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
  .form-row-1,
  .form-row-3 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .address-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .map-button {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .map-button {
    font-size: 12px;
    padding: 10px 12px;
    min-width: 120px;
  }
  
  .map-icon {
    width: 16px;
    height: 16px;
  }
}
</style>