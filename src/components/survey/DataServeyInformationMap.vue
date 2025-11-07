<script setup lang="ts">
import GoogleMap from '../GoogleMap.vue'

const requestStore = useRequestStore()
const { request } = storeToRefs(requestStore)
const surveyStore = useSurveyStore()
const { survey, surveyForm, isDisabled } = storeToRefs(surveyStore)
const addressStore = useAddressFormStore()
const { addressRequestForm } = storeToRefs(addressStore)
</script>

<template>
  <div class="box_form_customer_type">
    <q-list class="rounded-borders">
      <q-expansion-item
        header-class="bg_field_light_gray icon_color_gray"
        default-opened
      >
        <template #header>
          <q-item-section avatar>
            <q-icon color="black" name="find_in_page" />
          </q-item-section>
          <q-item-section class="text_expansion">
            คำร้องขอรับบริการ
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="box_form_info">
              <div class="row q-pa-sm">
                <div class="q-pa-sm col-12">
                  <GoogleMap
                    v-model:latitude="surveyForm.latitude"
                    v-model:longitude="surveyForm.longitude"
                    :default-address="
                      request?.requests?.latitude || survey?.latitude
                        ? ''
                        : `${addressRequestForm.address_district} ${addressRequestForm.address_city} ${addressRequestForm.address_province} ${addressRequestForm.address_post_code}`
                    "
                    :disable="isDisabled"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
