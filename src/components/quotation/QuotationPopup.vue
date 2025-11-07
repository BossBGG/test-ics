<script setup lang="ts">
import { computed, ref } from 'vue'

interface Service {
  idx: string
  pea_name: string
  latlong: string
  distance: string
  shippingTotal: number
  shippingBreakdown: string
  rentalTotal: number
  rentalBreakdown: string
  operatorTotal: number
  operatorCount: number
  operatorPerDayBreakdown: string
  operatorBreakdown: string
}

interface Calculation {
  power: string
  services: Service
  total: number
  numberOfOperators: number
}

const requestStore = useRequestStore();
const { requestForm, requestServiceForm } = storeToRefs(requestStore);

const serviceItemStore = useServiceItemStore();
const { generators } = storeToRefs(serviceItemStore);

const serviceRateStore = useServiceRateStore();
const { currentServiceRate: serviceRate } = storeToRefs(serviceRateStore);

onMounted(async () => {
  await serviceItemStore.fetchGeneratorSizes();
  if (requestServiceForm.value.customer_type) {
    await serviceRateStore.fetchServiceRate(requestServiceForm.value.customer_type);
  }
});

// Watch for changes to customer_type and fetch service rate when it becomes available
watch(
  () => requestServiceForm.value.customer_type,
  async (newCustomerType) => {
    if (newCustomerType && !serviceRate.value) {
      await serviceRateStore.fetchServiceRate(newCustomerType);
    }
  },
  { immediate: false, deep: true }
);

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [data: { calculations: Calculation[] }]
  'cancel': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Helper function to calculate difference in days between two dates
function getDaysDifference(startDate: Date, endDate: Date): number {
  if (!startDate || !endDate) return 0;
  const diffTime = Math.abs(startDate.getTime() - endDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Computed property for rental period display
const rentalPeriodDisplay = computed(() => {
    if (requestServiceForm.value?.rental_startdate && requestServiceForm.value?.rental_enddate) {
    const start = new Date(requestServiceForm.value.rental_startdate);
    const end = new Date(requestServiceForm.value.rental_enddate);
    
    if (!start || !end) return '';
    
    const THDateFormat = new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    const startDate = THDateFormat.format(start)
    const endDate = THDateFormat.format(end)

    return `${startDate} - ${endDate} (${getDaysDifference(start, end)} วัน)`
  }
  return ''
});

// Helper function to find rate by KVA range
function findRateByKva(rates: any[], kva: number) {
  if (!rates || !Array.isArray(rates)) return null;
  return rates.find((rate: any) => 
    kva >= (rate.size_min_kva || 0) && kva <= (rate.size_max_kva || Infinity)
  );
}

function findOperatorRateByKva(rates: any[], kva: number) {
  if (!rates || !Array.isArray(rates)) return null;
  return rates.find((rate: any) => 
    kva >= (rate.operator_size.size_min_kva || 0) && kva <= (rate.operator_size.size_max_kva || Infinity)
  );
}

// Helper function to calculate rental cost based on number of days
function calculateRentalCost(rentalRates: any[], days: number): { total: number; breakdown: string } {
  
  if (!rentalRates?.length || days <= 0) return { total: 0, breakdown: '' };
  
  const sortedRates = [...rentalRates].sort((a, b) => (a.day_number || 0) - (b.day_number || 0));
  let totalCost = 0;
  const breakdownParts: { price: number; count: number }[] = [];
  
  for (let currentDay = 1; currentDay <= days; currentDay++) {
    // Find the applicable rate for the current day
    // Use the highest day_number that is <= currentDay
    let applicableRate = sortedRates[0]; // Default to first rate
    for (const rate of sortedRates) {
      if (rate.day_number <= currentDay) {
        applicableRate = rate;
      } else {
        break;
      }
    }
    
    const price = applicableRate.price || 0;
    totalCost += price;
    
    // Group consecutive days with same price for breakdown
    const lastPart = breakdownParts[breakdownParts.length - 1];
    if (lastPart && lastPart.price === price) {
      lastPart.count++;
    } else {
      breakdownParts.push({ price, count: 1 });
    }
  }
  
  const breakdownText = breakdownParts
    .map(part => `(${part.count} × ${part.price.toLocaleString('th-TH')})`)
    .join(' + ');
  
  return { 
    total: totalCost, 
    breakdown: breakdownText ? `${breakdownText} = ${totalCost.toLocaleString('th-TH')}` : ''
  };
}

// Helper function to calculate tiered shipping cost based on distance
function calculateShippingCost(shippingRates: any[], distance: number): { total: number; breakdown: string } {
  if (!shippingRates?.length || distance <= 0) return { total: 0, breakdown: '' };
  
  const sortedRates = [...shippingRates].sort((a, b) => 
    (a.shipping_distance?.distance_min_km || 0) - (b.shipping_distance?.distance_min_km || 0)
  );
  
  let totalCost = 0;
  const breakdownParts: string[] = [];
  
  for (const rate of sortedRates) {
    const minKm = rate.shipping_distance?.distance_min_km || 0;
    const maxKm = rate.shipping_distance?.distance_max_km;
    const price = rate.price || 0;
    
    if (distance < minKm) continue;
    
    let kmInThisTier = 0;
    
    if (maxKm === null || maxKm === undefined) {
      kmInThisTier = distance - minKm;
    } else if (distance <= maxKm) {
      kmInThisTier = minKm === 0 ? Math.min(distance, maxKm) : distance - minKm + 1;
    } else {
      kmInThisTier = minKm === 0 ? maxKm : maxKm - minKm + 1;
    }
    
    totalCost += kmInThisTier * price;
    breakdownParts.push(`(${kmInThisTier} × ${price.toLocaleString('th-TH')})`);
    
    if (maxKm !== null && maxKm !== undefined && distance <= maxKm) break;
  }
  
  return { 
    total: totalCost, 
    breakdown: breakdownParts.length ? `${breakdownParts.join(' + ')} = ${totalCost.toLocaleString('th-TH')}` : '' 
  };
}

// Calculate services dynamically based on requestServiceForm.kw_size_reservation
const calculations = computed<Calculation[]>(() => {
  const reservations = requestServiceForm.value.kw_size_reservation || [];
  const currentServiceRate = serviceRate.value;
  
  const sortedReservations = [...reservations].sort((a: any, b: any) => 
    (a.ref_generator_size_id || 0) - (b.ref_generator_size_id || 0)
  );
  
  return sortedReservations.map((reservation: any, index: number) => {
    const generator = generators.value.find((g: any) => g?.ref_generator_size_id === reservation.ref_generator_size_id);
    const generatorDesc = generator?.ref_generator_size_desc || 'Unknown';
    const kva = generator?.ref_generator_size_kva || 0;
    const distance = Number(reservation.distance) || 0;
    
    // Calculate shipping
    const shippingRateConfig = findRateByKva(currentServiceRate?.shipping_rates.mas_service_shipping_size || [], kva);
    const shippingResult = calculateShippingCost(shippingRateConfig?.shipping_rates || [], distance);
    
    // Calculate rental
    const rentalRateConfig = findRateByKva(currentServiceRate?.rental_rates?.mas_service_rental_sizes || [], kva);
    const rentalDays = requestServiceForm.value?.rental_startdate && requestServiceForm.value?.rental_enddate
      ? getDaysDifference(new Date(requestServiceForm.value.rental_startdate), new Date(requestServiceForm.value.rental_enddate))
      : 0;
    const rentalResult = calculateRentalCost(rentalRateConfig?.rental_rates || [], rentalDays);
    
    // Calculate operator
    const operatorRate = findRateByKva(currentServiceRate?.operator_rates?.operator_rates?.[0]?.mas_service_operator_rate_size || [], kva);
    const operatorCostPerDay = operatorRate?.price || 0;
    const teamSize = findOperatorRateByKva(currentServiceRate?.operator_rates?.operator_teams?.[0]?.team_sizes || [], kva);
    const numberOfOperators = teamSize?.number_of_operator || 1;
    const operatorTotal = operatorCostPerDay * numberOfOperators;
    
    const services: Service = { 
      idx: String(index + 1), 
      pea_name: reservation.pea_name || '',
      latlong: `${reservation.lat || ''}, ${reservation.lon || ''}`,
      distance: String(distance * 2), 
      shippingTotal: shippingResult.total,
      shippingBreakdown: shippingResult.breakdown,
      rentalTotal: rentalResult.total,
      rentalBreakdown: rentalResult.breakdown,
      operatorTotal: operatorTotal * rentalDays,
      operatorCount: numberOfOperators,
      operatorPerDayBreakdown: `(${operatorCostPerDay.toLocaleString('th-TH')} × ${numberOfOperators} คน) = ${operatorTotal.toLocaleString('th-TH')}`,
      operatorBreakdown: `(${operatorCostPerDay.toLocaleString('th-TH')} × ${numberOfOperators} คน) * (${rentalDays} วัน) = ${(operatorTotal * rentalDays).toLocaleString('th-TH')}`,
    }
    
    return {
      power: generatorDesc,
      services,
      total: services.shippingTotal + services.rentalTotal + services.operatorTotal,
      numberOfOperators,
    };
  });
})

const isEdit = ref(false)
const tempDistances = ref<{ [key: string]: number }>({})

const grandTotal = computed(() => calculations.value.reduce((sum, calc) => sum + calc.total, 0))

const groupedCalculations = computed(() => {
  const groups = new Map<string, { power: string; total: number; count: number; items: Calculation[]; breakdown: string }>();
  
  calculations.value.forEach(calc => {
    const key = calc.power;
    if (!groups.has(key)) {
      groups.set(key, { power: key, total: 0, count: 0, items: [], breakdown: '' });
    }
    const group = groups.get(key)!;
    group.total += calc.total;
    group.count += 1;
    group.items.push(calc);
  });
  
  groups.forEach(group => {
    const breakdownParts = group.items.map(item => `${item.total.toLocaleString('th-TH')} บาท`);
    group.breakdown = `${breakdownParts.join(' + ')} = ${group.total.toLocaleString('th-TH')} บาท`;
  });
  
  return Array.from(groups.values());
});

const totalRental = computed(() => calculations.value.reduce((sum, calc) => sum + calc.services.rentalTotal, 0))
const totalOperator = computed(() => calculations.value.reduce((sum, calc) => sum + calc.services.operatorTotal, 0))
const totalShipping = computed(() => calculations.value.reduce((sum, calc) => sum + calc.services.shippingTotal, 0))

function increaseDistance(service: Service) {
  const idx = service.idx;
  if (!tempDistances.value[idx]) tempDistances.value[idx] = (Number(service.distance) || 0) / 2;
  tempDistances.value[idx]++;
}

function decreaseDistance(service: Service) {
  const idx = service.idx;
  if (!tempDistances.value[idx]) tempDistances.value[idx] = (Number(service.distance) || 0) / 2;
  if (tempDistances.value[idx] > 0) tempDistances.value[idx]--;
}

function confirm() {
  emit('confirm', { calculations: calculations.value })
  emit('update:modelValue', false)
}

function cancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function enableEdit(){
  isEdit.value = true
  tempDistances.value = {}
  calculations.value.forEach((calc) => {
    // Store one-way distance for editing (divide by 2 since distance is stored as round-trip)
    tempDistances.value[calc.services.idx] = (Number(calc.services.distance) || 0) / 2;
  });
}

function disableEdit(){
  isEdit.value = false
  tempDistances.value = {}
}

function confirmDistanceEdit(){
  const reservations: any[] = requestServiceForm.value.kw_size_reservation || [];
  const sortedReservations = [...reservations].sort((a: any, b: any) => 
    (a.ref_generator_size_id || 0) - (b.ref_generator_size_id || 0)
  );
  
  Object.keys(tempDistances.value).forEach((idx) => {
    const sortedIndex = Number(idx) - 1;
    if (sortedReservations[sortedIndex]) {
      const originalIndex = reservations.findIndex(r => r === sortedReservations[sortedIndex]);
      if (originalIndex !== -1) {
        reservations[originalIndex].distance = tempDistances.value[idx];
      }
    }
  });
  isEdit.value = false;
  tempDistances.value = {};
}
</script>

<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 1200px; background-color: #F5F7F8;">
      <q-card-section class="row bg-primary items-center text-white">
        <div class="text-h6">
          คำนวณค่าบริการ
        </div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close" round @click="cancel" />
      </q-card-section>

      <div class="overflow-scroll p-5" style="max-height: 80vh;">
        <!-- Customer Information Section -->
        <q-card-section style="background-color: #DBDADC;margin-bottom: 24px;">
          <div class="q-mb-md text-primary text-xl font-semibold">
            <q-icon name="mdi-account" />
            ข้อมูลผู้ขอบริการ
          </div>
          <div class="q-gutter-md row">
            <q-input
              v-model="requestForm.first_name"
              bg-color="white"
              label-color="grey-14"
              color="primary"
              class="input_filled input_filled_custom"
              filled
              hide-bottom-space
              readonly
              stack-label
              label="ชื่อ"
            />
            <q-input
              v-model="requestForm.last_name" bg-color="white"
              label-color="grey-14"
              color="primary"
              class="input_filled input_filled_custom"
              filled
              hide-bottom-space
              readonly
              stack-label
              label="นามสกุล"
            />
            <q-input
              v-model="requestForm.pea_office" bg-color="white"
              label-color="grey-14"
              color="primary"
              class="input_filled input_filled_custom col"
              filled
              hide-bottom-space
              readonly
              stack-label
              label="ชื่อองค์กร/หน่วยงาน"
            />
            <q-input
              v-model="requestServiceForm.government_objective" bg-color="white"
              label-color="grey-14"
              color="primary"
              class="input_filled input_filled_custom"
              filled
              hide-bottom-space
              readonly
              stack-label
              label="วัตถุประสงค์การใช้งานเครื่องกำเนิดไฟฟ้า"
            />
          </div>
        </q-card-section>

        <!-- Calculation Loop Section -->
        <q-card-section style="background-color: #DBDADC;margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="q-mb-md text-subtitle2">
              ค่าบริการค่าใช้จ่าย
            </div>
            <div v-if="!isEdit" class="q-mb-md text-subtitle2" style="color: #994C80; cursor: pointer;" @click="enableEdit">
              <q-icon name="edit" />
              แก้ไขระยะทาง
            </div>
            <div v-if="isEdit" class="flex" >
              <div class="q-mb-md text-subtitle2" style="color: #994C80; cursor: pointer;" @click="disableEdit" >
                <q-icon name="cancel" />
                ยกเลิก
              </div>
              <div class="q-mb-md text-subtitle2 ml-4" style="color: #994C80; cursor: pointer;" @click="confirmDistanceEdit" >
                <q-icon name="check_circle" />
                ยืนยัน
              </div>
            </div>
            
          </div>

          <div v-for="(group, groupIndex) in groupedCalculations" :key="`group-${groupIndex}`" class="q-mb-md">
            <!-- Group Header -->
            <div class="q-mb-sm text-body1 text-weight-bold">
              เครื่อง {{ group.power }} : <span class="text-primary">{{ group.count }} รายการ</span>
            </div>
            
            <div v-for="(item, index) in group.items" :key="`item-${index}`" class="q-mb-md">
            <div class="row q-pa-sm request-customer-type" style="padding-right: 0;">
              <div class="q-pa-sm col-12 col-md-3">
                <q-input
                  v-if="index===0"
                  :model-value="rentalPeriodDisplay"
                  bg-color="white"
                  label-color="grey-14"
                  color="primary"
                  class="input_filled input_filled_custom"
                  label="วันที่เริ่มต้น - สิ้นสุดการเช่า"
                  filled
                  hide-bottom-space
                  readonly
                  stack-label
                />
              </div>
              <div class="q-pa-sm col-12 col-md-2">
                <div class="text-sub-header">
                  <q-input
                    v-if="index===0"
                    :model-value="item.numberOfOperators * group.count"
                    bg-color="white"
                    color="primary"
                    class="input_filled input_filled_custom"
                    label="จำนวนผู้คุมเครื่อง"
                    filled
                    hide-bottom-space
                    readonly
                    stack-label
                  />
                </div>
              </div>
              <div class="q-pa-sm col-12 col-md-7 custom-table flex">
                <!-- First row: Shipping -->
                <div style="background-color: white; width: 100%;" class="flex">
                  <!-- Index column -->
                  <q-input
                    :model-value="item.services.idx"
                    bg-color="white"
                    color="primary"
                    readonly
                    filled
                    hide-bottom-space
                    style="width: 40px;"
                  />
                  
                  <!-- Description column -->
                  <q-input
                    :model-value="item.services.pea_name"
                    bg-color="white"
                    color="primary"
                    label="การไฟฟ้าเจ้าของเครื่อง"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                  />
                  
                  <!-- Location column -->
                  <q-input
                    :model-value="item.services.latlong"
                    bg-color="white"
                    color="primary"
                    label="lat long สถานที่เช่า"
                    readonly
                    filled
                    hide-bottom-space
                    stack-label
                    class="col"
                    style="min-width: 160px;"
                  />
                  
                  <!-- Distance column -->
                  <q-input
                    v-if="!isEdit"
                    :model-value="Number(item.services.distance).toLocaleString('th-TH')"
                    bg-color="white"
                    color="primary"
                    label="ระยะทางไป-กลับ"
                    suffix="กม."
                    readonly
                    filled
                    hide-bottom-space
                    stack-label
                    style="max-width: 120px;"
                  />
                  <q-input
                    v-else
                    v-model.number="tempDistances[item.services.idx]"
                    bg-color="white"
                    color="primary"
                    label="ระยะทางไป-กลับ"
                    suffix="กม."
                    type="number"
                    filled
                    hide-bottom-space
                    stack-label
                    style="max-width: 120px;"
                  />
                  
                  <!-- Edit buttons -->
                  <div v-if="isEdit" style="display: grid;height: 56px; border-bottom: 1px rgba(0, 0, 0, 0.42) dashed;">
                    <q-btn dense flat icon="add" class="q-ml-xs" @click="increaseDistance(item.services)" />
                    <q-btn dense flat icon="remove" class="q-ml-xs" @click="decreaseDistance(item.services)" />
                  </div>
                  <div v-else style="width: 10px;height: 56px; border-bottom: 1px rgba(0, 0, 0, 0.42) dashed;" />
                  
                  <!-- Amount column -->
                  <q-input
                    :model-value="item.services.shippingTotal.toLocaleString('th-TH')"
                    bg-color="white"
                    color="primary"
                    label="รวมค่าขนส่งและติดตั้ง"
                    suffix="บาท"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                  >
                    <q-tooltip v-if="item.services.shippingBreakdown" :offset="[0, 8]">
                      {{ item.services.shippingBreakdown }}
                    </q-tooltip>
                  </q-input>
                </div>

                <!-- Second row: Rental -->
                <div style="background-color: white; width: 100%;" class="flex">
                  <!-- Index column (empty) -->
                  <div style="width: 40px; height: 56px; border-bottom: 1px rgba(0, 0, 0, 0.42) dashed;" />
                  
                  <!-- Description column -->
                  <q-input
                    :model-value="item.services.rentalBreakdown"
                    bg-color="white"
                    color="primary"
                    label="อัตราค่าเช่าต่อวัน"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                    style="flex: 1 1 70%;"
                  />
                  
                  <!-- Amount column -->
                  <q-input
                    :model-value="item.services.rentalTotal.toLocaleString('th-TH')"
                    bg-color="white"
                    color="primary"
                    label="รวมค่าเช่า"
                    suffix="บาท"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                  >
                    <q-tooltip v-if="item.services.rentalBreakdown" :offset="[0, 8]">
                      {{ item.services.rentalBreakdown }}
                    </q-tooltip>
                  </q-input>
                </div>

                <!-- Third row: Operator -->
                <div style="background-color: white; width: 100%;" class="flex">
                  <!-- Index column (empty) -->
                  <div style="width: 40px; height: 56px; border-bottom: 1px rgba(0, 0, 0, 0.42) dashed;" />
                  
                  <!-- Description column -->
                  <q-input
                    :model-value="item.services.operatorBreakdown"
                    bg-color="white"
                    color="primary"
                    label="อัตราค่าควบคุมงานต่อคนต่อวัน"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                    style="flex: 1 1 70%;"
                  />
                  
                  <!-- Amount column -->
                  <q-input
                    :model-value="item.services.operatorTotal.toLocaleString('th-TH')"
                    bg-color="white"
                    color="primary"
                    label="รวมค่าควบคุมงาน"
                    suffix="บาท"
                    readonly
                    filled
                    stack-label
                    hide-bottom-space
                    class="col"
                  >
                    <q-tooltip v-if="item.services.operatorBreakdown" :offset="[0, 8]">
                      {{ item.services.operatorBreakdown }}
                    </q-tooltip>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row q-pa-sm justify-end">
            <div class="q-mt-sm col-md-2 text-right">
              <q-input
                :model-value="group.total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })"
                bg-color="white"
                color="primary"
                class="input_filled input_filled_custom summary-total"
                label="ราคารวม"
                suffix="บาท"
                filled
                readonly
                stack-label
                hide-bottom-space
              >
                <q-tooltip v-if="group.breakdown" :offset="[0, 8]">
                  {{ group.breakdown }}
                </q-tooltip>
              </q-input>
            </div>
          </div>
          <div v-if="groupIndex < groupedCalculations.length - 1" style="display: flex; justify-content: center; margin: 32px 0;">
            <q-separator style="width: 90%; height: 1px;" />
          </div>

        </div>
        </q-card-section>

        <q-card-section style="background-color: white;margin-bottom: 20px;">
          <div class="text-right">
            <div class="text-h5 text-primary mb-4 !font-semibold">
              รวมค่าใช้จ่ายให้เช่าทุกรายการ
            </div>
            <div class="my-2">
              ค่าเช่า {{ totalRental.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} บาท
            </div>
            <div class="my-2">
              ค่าคุมงาน {{ totalOperator.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} บาท
            </div>
            <div class="my-2">
              ค่าขนส่ง {{ totalShipping.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} บาท
            </div>
          </div>
        </q-card-section>

        <q-card-section style="background-color: white;">
          <div class="text-right">
            <div class="text-h5 text-primary !font-semibold">
              รวม {{ grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} บาท
            </div>
          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="center" style="margin: 20px 0;">
          <q-btn color="secondary" label="ยกเลิก" class="width-270" style="margin-right: 40px;" @click="cancel" />
          <q-btn color="primary" label="ยืนยัน" class="width-270" @click="confirm" />
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.custom-table {
  height: fit-content;
}

.custom-table :deep(.q-input) {
  height: 56px;
}
.custom-table :deep(.q-table__container) {
  box-shadow: none !important;
}

.custom-table :deep(.q-table tr) {
  height: 56px;
  border-bottom: 1px dotted #ccc;
}

.custom-table :deep(.q-table td) {
  height: 56px;
  vertical-align: middle;
  border-bottom: 1px dashed #ccc;
}

.custom-table :deep(.q-table tr:last-child) {
  border-bottom: none;
}

.custom-table :deep(.custom-description) {
  padding: 8px;
  font-weight: 500;
  color: #333;
}

.summary-total :deep(.q-field__native) {
  color: #994c80;
  font-weight: bold;
}

/* Hide number input arrows */
:deep(input[type="number"]::-webkit-outer-spin-button),
:deep(input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

:deep(input[type="number"]) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
