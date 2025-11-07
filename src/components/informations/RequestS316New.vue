<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { GeneratorItem } from '../survey/history/SurveyHistoryS316.vue'

const props = defineProps(['readonly', 'allowUpdateItem', 'disabledSection'])
const { readonly, allowUpdateItem = false, disabledSection = false } = props

const requestStore = useRequestStore()
const { requestServiceForm, validateTimeStatusForm } = storeToRefs(requestStore)

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate,
  ),
)

const generatorList = ref<GeneratorItem[]>([])
const isInitialized = ref(false)

watch(
  () => requestServiceForm.value.requests_serviceS316_kw_size,
  (newForm) => {
    if (newForm && !isInitialized.value) {
      generatorList.value = [...newForm]
      isInitialized.value = true
    }
  },
  { deep: true, immediate: true },
)

watch(
  [requestServiceForm.value.start_time, requestServiceForm.value.end_time],
  () => {
    if (requestServiceForm.value.rental_starttime_endtime)
      return
    requestServiceForm.value.rental_starttime_endtime = {
      start: requestServiceForm.value.start_time || '',
      end: requestServiceForm.value.end_time || '',
    }
    validateTimeStatusForm.value = true
  },
  { deep: true, immediate: true },
)

watch(
  () => requestServiceForm.value.rental_starttime_endtime,
  (newTime) => {
    if (newTime) {
      requestServiceForm.value.start_time = newTime.start
      requestServiceForm.value.end_time = newTime.end
    }
  },
  { deep: true, immediate: true },
)

watch(
  generatorList,
  (newList) => {
    requestServiceForm.value.requests_serviceS316_kw_size = [...newList]
  },
  { deep: true },
)

function increase(item: GeneratorItem) {
  if (item.qty !== undefined) {
    item.qty = item.qty + 1
  }
}

function decrease(item: GeneratorItem) {
  if (item.qty && item.qty > 0) {
    item.qty = item.qty - 1
  }
}

function addItem() {
  const nextId
    = generatorList.value.length > 0
      ? Math.max(...generatorList.value.map(i => i.id)) + 1
      : 1
  generatorList.value.push({
    id: nextId,
    ref_generator_size_id: undefined,
    qty: 1,
  })
}

function removeItem(index: number) {
  generatorList.value.splice(index, 1)
}
// :readonly="!CAN_EDIT.REQUEST.value"
</script>

<template>
  <div v-if="requestServiceForm" class="box_form_customer_type w-full">
    <q-list class="rounded-borders title">
      <q-expansion-item
        v-if="!disabledSection"
        header-class="bg_field_primary"
        default-opened
      >
        <template #header>
          <q-item-section avatar>
            <q-icon color="white" name="book" />
          </q-item-section>
          <q-item-section class="text_expansion">
            ข้อมูลเครื่องที่ขอรับบริการ
          </q-item-section>
        </template>
        <q-card>
          <div class="row q-pa-sm col-12 col-md-12">
            <div class="row col-6">
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
              <div class="q-pa-sm col-6">
                <div class="q-pa-sm text-primary font-weight-600 font-16">
                  ประมาณเวลาที่เริ่มต้น-สิ้นสุดที่ต้องการใช้งาน
                </div>
                <div class="col-12">
                  <FormTimePicker
                    v-model="requestServiceForm.rental_starttime_endtime"
                    label-text="เวลาที่เริ่มต้น"
                    @update:model-value="
                      (val) =>
                        (requestServiceForm.rental_starttime_endtime = val)
                    "
                  />
                </div>
              </div>
            </div>

            <div
              v-if="generatorList.length === 0"
              class="q-pa-sm col-6 col-6"
            />

            <template v-for="(item, index) in generatorList" :key="item.id">
              <div v-if="index > 0" class="col-6" />
              <div class="q-pa-sm col-6" style="padding-left: 0 !important">
                <div
                  class="q-pa-sm text-primary font-weight-600 flex items-center font-16"
                  style="column-gap: 8px; padding-bottom: 0 !important"
                >
                  รายการที่ {{ index + 1 }}
                  <q-icon
                    v-if="allowUpdateItem"
                    name="mdi-close-circle"
                    class="cursor-pointer"
                    color="secondary"
                    @click="removeItem(index)"
                  />
                </div>
                <div class="row col-12">
                  <div class="q-pa-sm col-6">
                    <GeneratorSelect
                      :model-value="item.ref_generator_size_id"
                      @update:model-value="
                        (val) => (item.ref_generator_size_id = val)
                      "
                    />
                  </div>
                  <div class="q-pa-sm col-6">
                    <q-input
                      v-model.number="item.qty"
                      bg-color="white"
                      color="primary"
                      label-color="grey-14"
                      filled
                      label="จำนวนเครื่องที่ต้องการ"
                      class="input_filled input_filled_custom"
                      hide-bottom-space
                      @keypress="allowOnlyNumbers"
                      @paste="allowOnlyNumbers"
                    >
                      <template #append>
                        <div style="display: grid">
                          <q-icon
                            name="add"
                            color="secondary"
                            class="cursor-pointer"
                            @click="increase(item)"
                          />
                          <q-icon
                            name="remove"
                            color="secondary"
                            class="cursor-pointer"
                            @click="decrease(item)"
                          />
                        </div>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </template>
            <div
              v-if="allowUpdateItem"
              class="row q-pa-sm col-12 col-md-12 offset-md-7"
            >
              <q-btn
                v-if="true"
                label="เพิ่มรายการ"
                outline
                color="secondary"
                icon="add"
                style="width: 180px"
                @click="addItem"
              />
            </div>
          </div>
        </q-card>
      </q-expansion-item>

      <!-- Show card directly when disabled -->
      <div v-if="disabledSection">
        <div class="row col-12 col-md-12">
          <div class="row col-6">
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
            <div class="q-pa-sm col-6">
              <div class="q-pa-sm text-primary font-weight-600 font-16">
                ประมาณเวลาที่เริ่มต้น-สิ้นสุดที่ต้องการใช้งาน
              </div>
              <div class="col-12">
                <FormTimePicker
                  v-model="requestServiceForm.rental_starttime_endtime"
                  label-text="เวลาที่เริ่มต้น"
                />
              </div>
            </div>
          </div>

          <template v-for="(item, index) in generatorList" :key="item.id">
            <div v-if="index > 0" class="col-6" />
            <div class="q-pa-sm col-6" style="padding-left: 0 !important">
              <div
                class="q-pa-sm text-primary font-weight-600 flex items-center font-16"
                style="column-gap: 8px; padding-bottom: 0 !important"
              >
                รายการที่ {{ index + 1 }}
                <q-icon
                  v-if="allowUpdateItem"
                  name="mdi-close-circle"
                  class="cursor-pointer"
                  size="20px"
                  color="secondary"
                  @click="removeItem(index)"
                />
              </div>
              <div class="row col-12">
                <div class="q-pa-sm col-6">
                  <GeneratorSelect
                    :model-value="item.ref_generator_size_id"
                    @update:model-value="
                      (val) => (item.ref_generator_size_id = val)
                    "
                  />
                </div>
                <div class="q-pa-sm col-6">
                  <q-input
                    v-model.number="item.qty"
                    bg-color="white"
                    color="primary"
                    label-color="grey-14"
                    filled
                    label="จำนวนเครื่องที่ต้องการ"
                    class="input_filled input_filled_custom"
                    hide-bottom-space
                    @keypress="allowOnlyNumbers"
                    @paste="allowOnlyNumbers"
                  >
                    <template #append>
                      <div style="display: grid">
                        <q-icon
                          name="add"
                          color="secondary"
                          class="cursor-pointer"
                          @click="increase(item)"
                        />
                        <q-icon
                          name="remove"
                          color="secondary"
                          class="cursor-pointer"
                          @click="decrease(item)"
                        />
                      </div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </template>
          <div
            v-if="allowUpdateItem"
            class="row q-pa-sm col-12 col-md-12 offset-md-7"
          >
            <q-btn
              v-if="true"
              label="เพิ่มรายการ"
              outline
              color="secondary"
              icon="add"
              class="bg-white"
              style="width: 180px"
              @click="addItem"
            />
          </div>
        </div>
      </div>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import '@style';
</style>
