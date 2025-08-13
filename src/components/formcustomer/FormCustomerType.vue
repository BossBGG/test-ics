<script setup lang="ts">
const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerDetail, businessPartnerForm } =
  storeToRefs(businessPartnerStore);

const masterDataStore = useMasterDataStore();
const { legalForms, allIp } = storeToRefs(masterDataStore);

const serviceItemStore = useServiceItemStore();
const { businessTypeFilters } = storeToRefs(serviceItemStore);

const bp = useQuery("bp");
const test = useQuery("test");
const requestId = useParams("uid");
const cardLoading = ref(false);
const tempNationality = ref("");

const addressFormStore = useAddressFormStore();
const { addressIdCardForm } = storeToRefs(addressFormStore);

onMounted(async () => {
  await masterDataStore.fetchLegalForm();
  if (businessPartnerForm.value?.legal_form_description == null) {
    businessPartnerForm.value.legal_form_description = legalForms.value.find(
      (obj) => obj.id == businessPartnerForm.value?.legal_form
    )?.description;
  }

  if (
    !businessPartnerForm.value.nationality &&
    businessPartnerForm.value.legal_type == 1
  ) {
    businessPartnerForm.value.nationality = "TH";
  }
});

async function readCardID() {
  try {
    let dataCardFormatted = "";

    const dataCardMock = {
      data: {
        status: "Success",
        error: null,
        data: "1102002688653|หญิง|น.ส.|เพ็ญพิชชา|แสงเจือ|55/21|ม.8|ตรอก|ซอย|ถนน|ต.เสาธงหิน|อ.บางใหญ่|จ.นนทบุรี|0|TH|19961227|1|",
      },
    };

    if (test.value == "true") {
      dataCardFormatted = dataCardMock.data.data.split("|");
    } else {
      await masterDataStore.fetchAllIp();

      const businessPartnerStore = useBusinessPartnerStore();
      const dataCardId = await businessPartnerStore.readIdCard(
        allIp.value.realIpAddress
      );

      dataCardFormatted = dataCardId.data.data.split("|");
    }

    const [
      PId,
      PGenderTh,
      PTitleTh,
      PFirstNameTh,
      PLastNameTh,
      PHouseAddress,
      PAddressMoo,
      PAddressTrok,
      PAddressSoi,
      PAddressRoad,
      PSubDistrict,
      PDistrict,
      PProvince,
      ReserveForFuture,
      PNational,
      PBirthDate,
      CommandStatus,
      Error,
    ] = dataCardFormatted;

    // console.log("PId:", PId);
    // console.log("PGenderTh:", PGenderTh);
    // console.log("PTitleTh:", PTitleTh);
    // console.log("PFirstNameTh:", PFirstNameTh);
    // console.log("PLastNameTh:", PLastNameTh);
    // console.log("PHouseAddress:", PHouseAddress);
    // console.log("PAddressMoo:", PAddressMoo);
    // console.log("PAddressTrok:", PAddressTrok);
    // console.log("PAddressSoi:", PAddressSoi);
    // console.log("PAddressRoad:", PAddressRoad);
    // console.log("PSubDistrict:", PSubDistrict);
    // console.log("PDistrict:", PDistrict);
    // console.log("PProvince:", PProvince);
    // console.log("ReserveForFuture:", ReserveForFuture);
    // console.log("PNational:", PNational);
    // console.log("PBirthDate:", PBirthDate);
    // console.log("CommandStatus:", CommandStatus);
    // console.log("Error:", Error);

    if (dataCardFormatted) {
      // console.log("dataCardFormatted: ", dataCardFormatted);
      businessPartnerForm.value.legal_type = 1;
      businessPartnerForm.value.cid = PId;
      businessPartnerForm.value.gender = mapOptions("gender", PGenderTh).id;
      businessPartnerForm.value.title_text = mapOptions(
        "title",
        PTitleTh
      ).title_name;
      businessPartnerForm.value.nationality = mapOptions(
        "nationality",
        PNational
      ).nameShort;
      businessPartnerForm.value.first_name = PFirstNameTh;
      businessPartnerForm.value.last_name = PLastNameTh;
      businessPartnerForm.value.birth_date = splitDate(PBirthDate).fullDate;
      //---------------- address --------------------------
      addressIdCardForm.value.address_house_no = PHouseAddress;
      addressIdCardForm.value.address_moo = PAddressMoo;
      addressIdCardForm.value.address_alley = PAddressSoi;
      addressIdCardForm.value.address_street = PAddressRoad;
      addressIdCardForm.value.address_lane = PAddressTrok;

      await mapAddressIdCard(PProvince, PDistrict, PSubDistrict);
    } else {
      // console.log("dataCardId.success:", dataCardId.data.success);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// watch(
//   () => businessPartnerForm.value.legal_type,
//   (newValue) => {
//     if (businessPartnerForm.value.legal_type == 1) {
//       console.log('businessPartnerForm.value.nationality: ', businessPartnerForm.value.nationality);

//       businessPartnerForm.value.nationality = "TH";
//     } else {
//       if (businessPartnerForm.value.nationality == "TH") {
//         businessPartnerForm.value.nationality = tempNationality.value
//       }
//     }
//   },
// );
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
            <q-icon color="black" name="person" />
          </q-item-section>
          <q-item-section class="text_expansion"> ประเภทลูกค้า </q-item-section>
        </template>

        <q-card id="card-option">
          <q-card-section>
            <div class="q-px-md q-pt-md box_dropdown_custom">
              <q-btn-dropdown
                :disable="
                  !CAN_EDIT.BP.value ||
                  (businessPartner?.id && !EDIT_ACTION) ||
                  (hasQuery('bp') && bp != 'null')
                "
                class="btn_dropdown_custom"
                color="secondary"
                label="สร้าง BP ใหม่"
                dropdown-icon="expand_more"
              >
                <q-list class="box_dropdown_custom_open">
                  <!-- <q-item v-close-popup clickable @click="onItemClick">
                    <q-item-section avatar>
                      <q-icon color="secondary" name="plagiarism" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>
                        ดึงข้อมูลจากระบบ ทบร. จากการกรอกหมายเลขบัตรประชาชน
                      </q-item-label>
                    </q-item-section>
                  </q-item> -->

                  <q-item v-close-popup clickable @click="onItemClick">
                    <q-item-section avatar>
                      <q-icon color="secondary" name="document_scanner" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label @click="readCardID()"
                        >อ่านบัตรประชาชน</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item v-close-popup clickable @click="onItemClick">
                    <q-item-section avatar>
                      <q-icon color="secondary" name="keyboard" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>กรอกข้อมูลด้วยตนเอง</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <!-- {{ tempNationality }} -->
            <div class="q-mt-md">
              <q-option-group
                v-model="businessPartnerForm.legal_type"
                class="q-px-sm box_radio option-form-customer-type"
                inline
                color="secondary"
                :options="[
                  BUSINESS_PARTNER.TYPE1,
                  BUSINESS_PARTNER.TYPE2,
                  BUSINESS_PARTNER.TYPE3,
                  BUSINESS_PARTNER.TYPE4,
                ]"
                :disable="
                  !CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                "
              >
                <template #label-0="thai">
                  <span v-html="thai.label" />
                </template>

                <template #label-1="foreigner">
                  <span v-html="foreigner.label" />
                </template>

                <template #label-2="legal_entity">
                  <span>{{ legal_entity.label }}</span>
                </template>

                <template #label-3="government">
                  <span>{{ government.label }}</span>
                </template>
              </q-option-group>

              <q-tab-panels
                v-model="businessPartnerForm.legal_type"
                v-if="businessPartnerForm"
                animated
                class="tap_form"
              >
                <q-tab-panel
                  class="bg_field_gray q-pa-none"
                  :name="BUSINESS_PARTNER.TYPE1.value"
                >
                  <TemplateCustomerOne />
                </q-tab-panel>

                <q-tab-panel
                  class="bg_field_gray q-pa-none"
                  :name="BUSINESS_PARTNER.TYPE2.value"
                >
                  <TemplateCustomerForeigner />
                </q-tab-panel>

                <q-tab-panel
                  class="bg_field_gray q-pa-none"
                  :name="BUSINESS_PARTNER.TYPE3.value"
                >
                  <TemplateCustomerTwo v-model:loading="cardLoading" />
                </q-tab-panel>

                <q-tab-panel
                  class="bg_field_gray q-pa-none"
                  :name="BUSINESS_PARTNER.TYPE4.value"
                >
                  <TemplateCustomerThree v-model:loading="cardLoading" />
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card-section>
          <q-inner-loading
            :showing="cardLoading"
            label="กำลังโหลด..."
            label-class="color_primary"
            style="background-color: rgb(245 247 248)"
          />
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
