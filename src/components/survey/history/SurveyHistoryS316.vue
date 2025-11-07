<script setup lang="ts">
import GeneratorNotAvailableAlertDialog from './GeneratorNotAvailableAlertDialog.vue'

const $q = useQuasar()

const requestStore = useRequestStore()
const { request, requestForm, requestServiceForm, nowRequestCode } = storeToRefs(requestStore)

const serviceItemStore = useServiceItemStore()

onMounted(async () => {
  await serviceItemStore.fetchGeneratorSizes()
})

export interface GeneratorItem {
  id: number
  ref_generator_size_id?: number
  distance?: number
  phone_number?: string
  qty?: number
}

const availableGeneratorModal = ref(false)
const allowUpdateItem = ref(true)
const addItem = ref(false)

const stationDialogSelectable = ref(false)
const dialogSelectedId = ref<string | undefined>(undefined)

const reservationList = computed({
  get: () => requestServiceForm.value.kw_size_reservation || [],
  set: (value) => {
    requestServiceForm.value.kw_size_reservation = value
  }
})

const newGeneratorList = computed({
  get: () => requestServiceForm.value.kw_size_reservation_add_new || [],
  set: (value) => {
    requestServiceForm.value.kw_size_reservation_add_new = value
  }
})

watch([requestServiceForm.value.start_time, requestServiceForm.value.end_time], () => {
  if (requestServiceForm.value.rental_starttime_endtime)
    return
  requestServiceForm.value.rental_starttime_endtime = {
    start: requestServiceForm.value.start_time || '',
    end: requestServiceForm.value.end_time || '',
  }
}, { deep: true, immediate: true })

function addOrder() {
  addItem.value = true
  availableGeneratorModal.value = true
  stationDialogSelectable.value = true
}

function removeOrder(index: number) {
  reservationList.value.splice(index, 1)
}

function showAvailableGeneratorModal() {
  stationDialogSelectable.value = false
  availableGeneratorModal.value = true
}

function openSelectableDialogFor(index: number) {
  stationDialogSelectable.value = true
  availableGeneratorModal.value = true
}

function onStationConfirm(item) {
  if (addItem.value) {
    newGeneratorList.value.push({
      ...item.pea_office,
      ref_generator_size_id: item.selectedId,
      id: newGeneratorList.value.length + reservationList.value.length + 1,
    })
  }
  availableGeneratorModal.value = false
  stationDialogSelectable.value = false
  addItem.value = false
}
</script>

<template>
  <div>
    <div>
      <div class="box_form_customer_type">
        <q-list class="rounded-borders bg_field_primary">
          <q-expansion-item
            header-class="icon_color_gray"
            default-opened
          >
            <template #header>
              <q-item-section avatar>
                <div />
              </q-item-section>

              <q-item-section class="text_expansion text-white">
                <h5>รายการเครื่องที่ขอรับบริการ</h5>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <div class="row col-12 col-md-12">
                  <div class="col-12 col-md-12 q-pa-sm text-right">
                    <div class="text-primary cursor-pointer" @click="showAvailableGeneratorModal">
                      <q-icon name="map" class="q-mr-sm" />
                      ดูรายการเครื่องที่ว่าง
                    </div>
                  </div>
                </div>
                <div class="row col-12 col-md-12">
                  <div class="col-12 col-md-3">
                    <div class="q-pa-sm col-6">
                      <div class="q-pa-sm text-primary font-weight-600 font-16">
                        วันที่ขอรับบริการ
                      </div>
                      <div class="row col-3 col-md-3">
                        <FormDatePicker
                          v-model="requestServiceForm.rental_startdate"
                          custom-class="col-6 col-md-6"
                          label-text="วันที่เริ่มต้น"
                          :date-start="true"
                        />

                        <FormDatePicker
                          v-model="requestServiceForm.rental_enddate"
                          custom-class="col-6 col-md-6"
                          label-text="วันที่สิ้นสุด"
                          type="endDate"
                          :date-end="true"
                        />
                      </div>
                    </div>
                    <div class="q-pa-sm col-6 mt-2">
                      <div class="q-pa-sm text-primary font-weight-600 font-16">
                        ประมาณเวลาที่เริ่มต้น-สิ้นสุดที่ต้องการใช้งาน
                      </div>
                      <div class="col-12">
                        <FormTimePicker
                          v-model="requestServiceForm.rental_starttime_endtime"
                          label-text="เวลาที่เริ่มต้น"
                          :startHour="8"
                          :endHour="16"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-9">
                    <template v-for="(item, index) in reservationList" :key="item.id">
                      <GeneratorItem
                        :item="item" :index="index" :allow-update-item="allowUpdateItem"
                        @remove-order="removeOrder"
                        @open-selectable-dialog-for="openSelectableDialogFor"
                      />
                    </template>
                    <hr>
                    <template v-for="(item, index) in newGeneratorList" :key="item.id">
                      <GeneratorItem
                        :item="item" :index="index + reservationList.length" :allow-update-item="allowUpdateItem"
                        @remove-order="removeOrder"
                        @open-selectable-dialog-for="openSelectableDialogFor"
                      />
                    </template>
                    <div v-if="allowUpdateItem" class="q-pa-sm col-12 col-md-12 offset-md-7">
                      <q-btn v-if="true" label="เพิ่มรายการ" outline color="secondary" icon="add" class="bg-white" style="width: 180px;" @click="addOrder" />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <StationDialog
        v-model:selected-id="dialogSelectedId"
        :model-open-dialog="availableGeneratorModal"
        :selectable="stationDialogSelectable"
        @confirm="onStationConfirm"
        @update:model-open-dialog="availableGeneratorModal = $event"
      />
    </div>
    <GeneratorNotAvailableAlertDialog :open="false" />
  </div>
</template>
