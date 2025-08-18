<script setup lang="ts">
const route = useRoute();
const masterStore = useMasterDataStore();

const requestStore = useRequestStore();
const { request, requestForm, serviceData } = storeToRefs(requestStore);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerDetail, businessPartnerForm } =
  storeToRefs(businessPartnerStore);

const bp = useQuery("bp");
const ca = useQuery("ca");
const requestId = useQuery("requestId");
const channelName = ref("");
const statusName = ref("");
const serviceName = ref("");

onMounted(async () => {
  businessPartnerForm.value.bp_no = bp.value ?? null;
  businessPartnerForm.value.ca_no = ca.value ?? null;
  if (!request.value?.requests?.id) {
    channelName.value = await masterStore.getChannel(
      requestForm.value?.channel || 0
    );
    statusName.value = await masterStore.getStatusName();
    serviceName.value = `${serviceData.value?.request_code} : ${serviceData.value?.name}`;
  } else {
    channelName.value = request.value?.channel_name;
    statusName.value = request.value?.status_name;
    serviceName.value = `${request.value?.service_code} : ${request.value?.service_name}`;
  }
});
</script>

<template>
  <div v-if="request" class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>รายละเอียดคำร้อง</h4>
    </div>
    <!-- {{ businessPartnerForm }} -->
    <div class="wraper_form">
      <div class="row q-pa-sm request-detail-form">
        <div class="q-pa-sm col-12 col-md-6">
          <q-field
            filled
            label="เลขที่คำร้อง"
            stack-label
            readonly
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
              >
                {{ request.requests?.customer_request_no ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="q-pa-sm col-12 col-md-3">
          <q-field
            filled
            label="หมายเลข BP."
            readonly
            stack-label
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
                v-if="businessPartner?.bp_no && !businessPartnerDetail?.bpNo"
              >
                {{ businessPartner?.bp_no ?? "-" }}
              </div>
              <div
                class="full-width no-outline color_text_input self-center"
                v-else-if="
                  !businessPartner?.bp_no && businessPartnerDetail?.bpNo
                "
              >
                {{ businessPartnerDetail?.bpNo ?? "-" }}
              </div>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
                v-else-if="
                  !businessPartner?.bp_no &&
                  !businessPartnerDetail?.bpNo &&
                  businessPartnerForm?.bp_no
                "
              >
                {{ businessPartnerForm?.bp_no ?? "-" }}
              </div>
              <div
                class="full-width no-outline color_text_input self-center"
                v-else
              >
                -
              </div>
            </template>
          </q-field>
        </div>
        <div class="q-pa-sm col-12 col-md-3">
          <q-field
            filled
            label="สถานะคำร้อง"
            readonly
            stack-label
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
              >
                <!-- {{ request.requests?.status }} -->
                {{ statusName ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="q-pa-sm col-12 col-md-6">
          <q-field
            filled
            label="ประเภทคำร้อง"
            stack-label
            readonly
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
              >
                {{ serviceName ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="q-pa-sm col-12 col-md-3">
          <q-field
            filled
            label="ช่องทางรับคำร้อง"
            stack-label
            readonly
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
              >
                {{ channelName ?? "-" }}
              </div>
            </template>
          </q-field>
        </div>

        <div class="q-pa-sm col-12 col-md-3">
          <q-field
            filled
            label="วันที่รับคำร้อง"
            stack-label
            readonly
            bg-color="white"
          >
            <template #control>
              <div
                class="full-width no-outline color_text_input self-center"
                tabindex="0"
              >
                {{
                  dateFormatThaiMonth(
                    request.requests?.created_date ?? new Date(),
                    "YYYY/MM/DD"
                  )
                }}
              </div>
            </template>
          </q-field>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.box_details_request {
  .title {
    background-color: $primary;
    color: $white;
    @include border-radius-separate(8px, 8px, 0, 0);

    h4 {
      font-size: 14px;
      font-weight: 500;

      @media #{$screen-mds-min} {
        font-size: 20px;
      }
    }
  }
}
</style>
