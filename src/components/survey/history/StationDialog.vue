<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Generator } from '../../../stores/service-316'
import type { FetchGetGeneratorAvailablesResponse } from '~/stores/service-316'

const props = defineProps({
  generator: { type: Object, default: {} },
  modelOpenDialog: { type: Boolean, default: false },
  defaultSelectSize: { type: String, default: '' },
  selectable: { type: Boolean, default: true },
  title: { type: String, default: 'เลือกเครื่องกำเนิดไฟฟ้า' },
})

const emit = defineEmits(['update:modelOpenDialog', 'update:selectedId', 'update:selectedSize', 'confirm'])

const selectedSize = defineModel('selectedSize', { type: String, default: '' })
const selectItemList = ref<Generator[]>([])
const selectedId = ref<number | string | null>(null)
const search = ref('')
const loadingPeaOffices = ref(false)

const requestStore = useRequestStore()
const { requestForm, requestServiceForm } = storeToRefs(requestStore)

const serviceItemStore = useServiceItemStore()
const { generators } = storeToRefs(serviceItemStore)

const service316Store = useService316Store()

onMounted(async () => {
  await serviceItemStore.fetchGeneratorSizes()
})

const open = computed({
  get: () => props.modelOpenDialog,
  set: v => emit('update:modelOpenDialog', v),
})

const generatorList = computed(() =>
  (Array.isArray(generators.value) ? generators.value : [])
    .map((ge, idx) => ({
      id: ge.ref_generator_size_id,
      label: `${ge?.ref_generator_size_desc ?? ''}`,
      value: ge.ref_generator_size_id,
    })),
)

const periodTimeTitle = computed(() => {
  if (requestServiceForm.value?.rental_startdate && requestServiceForm.value?.rental_enddate) {
    const start = new Date(requestServiceForm.value.rental_startdate)
    const end = new Date(requestServiceForm.value.rental_enddate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // include start day

    const THDateFormat = new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    const startDate = THDateFormat.format(start)
    const endDate = THDateFormat.format(end)

    return `${startDate} - ${endDate} (${diffDays} วัน)`
  }
  return ''
})

const filtered = computed(() => {
  const q = (search.value || '').trim().toLowerCase()
  const list = Array.isArray(selectItemList.value) ? selectItemList.value : []
  const base = q
    ? list.filter(it => String((it as any)?.pea_name ?? '').toLowerCase().includes(q))
    : list
  return base.filter(it => Number((it as any)?.available ?? 0) > 0)
})

watch(() => [props.modelOpenDialog, props.generator], () => {
  if (Object.keys(props.generator || {}).length > 0) {
    selectedSize.value = props.generator.ref_generator_size_id
    selectedId.value = props.generator.pea_code
  }
  else {
    selectedSize.value = generators.value[0]?.ref_generator_size_id || ''
  }
}, { immediate: true, deep: true })

watch(() => generators, (newVal) => {
  if (newVal.length > 0) {
    selectedSize.value = newVal[0]?.ref_generator_size_id || ''
  }
}, { immediate: true, deep: true })

watch(() => selectedSize.value, async () => {
  if (requestForm.value && requestServiceForm.value) {
    if (requestForm.value?.latitude
      && requestForm.value?.longitude
      && requestServiceForm.value.rental_startdate
      && requestServiceForm.value.rental_enddate
      && selectedSize.value
    ) {
      loadingPeaOffices.value = true
      const response = await service316Store.fetchGetGeneratorAvailables({
        latitude: requestForm.value?.latitude,
        longitude: requestForm.value?.longitude,
        rental_start_date: '2025-09-01', // requestServiceForm.value.rental_startdate,
        rental_end_date: '2025-09-07', // requestServiceForm.value.rental_enddate,
        ref_generator_size_id: selectedSize.value,
      })
      selectItemList.value = (response.data as FetchGetGeneratorAvailablesResponse).data?.pea_offices || []
      loadingPeaOffices.value = false
    }
  }
}, { immediate: true, deep: true })

watch(() => props.defaultSelectSize, () => {
  if (props.defaultSelectSize) {
    selectedSize.value = props.defaultSelectSize
  }
})()

function confirm() {
  const selectedItem = selectItemList.value.find(it => it.pea_code === selectedId.value) || null
  emit('confirm', { selectedId: selectedSize.value, pea_office: selectedItem })
  emit('update:modelOpenDialog', false)
}

function closeDialog() {
  emit('update:modelOpenDialog', false)
}
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card
      style="min-width: 900px; max-width: 900px; width: 90vw;"
    >
      <!-- Header with size toggle -->
      <q-card-section
        class="rounded-t"
        style="background-color: #E1DAEF; height: 174px; padding: 28px 40px;"
      >
        <div class="flex items-center gap-2">
          <q-icon name="place" class="opacity-70" size="25px" />
          <div class="font-semibold">
            {{ title }}
          </div>
          <div>
            วันที่เริ่มต้น - สิ้นสุดการเช่า  {{ periodTimeTitle }}
          </div>
        </div>
        <div class="select-container" style="margin-top:40px">
          <q-btn
            v-for="opt in generatorList"
            :key="opt.value"
            :label="opt.label"
            class="default-btn"
            :class="selectedSize === opt.value ? 'select-btn' : ''"
            icon="local_shipping" no-caps unelevated
            rounded
            @click="selectedSize = opt.value"
          />
        </div>
      </q-card-section>

      <div style="margin: 40px;">
        <!-- Search -->
        <q-card-section style="max-width: 420px;">
          <q-input v-model="search" dense outlined placeholder="ค้นหาการไฟฟ้า" :disable="!selectable && false">
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <!-- List -->
        <q-card-section class="pt-0" style="max-width: 480px;">
          <div class="text-primary font-weight-medium" style="margin-bottom: 12px;">
            เฉพาะในพื้นที่ใกล้เคียง
          </div>
          <div class="divide-y" style="height:300px; max-height: 300px; overflow-y: auto;">
            <q-inner-loading :showing="loadingPeaOffices" />
            <div v-for="it in filtered" :key="it.pea_code" class="flex items-center py-2" style="margin-bottom: 8px;">
              <template v-if="selectable">
                <q-radio v-model="selectedId" :val="it.pea_code" :label="it.pea_name" />
              </template>
              <template v-else>
                <div class="text-gray-800">
                  {{ it.pea_name }}
                </div>
              </template>
              <q-space />
              <div class="text-primary w-[120px] text-right text-sm">
                <span class="">{{ it.available }} เครื่อง</span>
              </div>
              <div class="text-primary w-[80px] text-right text-sm !ml-10">
                <span>{{ it.distance }} กม.</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </div>

      <q-card-section>
        <div class="text-primary-7 text-right text-xs">
          **ระยะทางระหว่างการไฟฟ้าเจ้าของเครื่องถึงสถานที่ให้บริการ
        </div>
      </q-card-section>
      <!-- Actions -->
      <q-card-actions class="flex justify-center px-4 pb-4">
        <template v-if="selectable">
          <q-btn v-close-popup outline label="ยกเลิก" class="!h-12 !w-[270px]" @click="closeDialog" />
          <q-btn :disable="!selectedId" color="primary" label="ยืนยัน" class="!h-12 !w-[270px]" @click="confirm" />
        </template>
        <template v-else>
          <q-btn v-close-popup color="secondary" class="width-270 text-white" st label="ปิด" @click="closeDialog" />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
/* optional: remove group border seam look */
:deep(.btn-toggle-gap .q-btn-group) {
  box-shadow: none;
}

.select-container {
  display: flex;
  gap: 8px;
  margin-top: 20px;

  .default-btn {
    min-width: 120px;
    height: 40px;
    border-radius: 4px;
    background-color: white;
    box-shadow: #00000040 0px 1px 4px;
  }

  .select-btn {
    border: 2px solid $primary;
    color: $primary;
  }
}
</style>
