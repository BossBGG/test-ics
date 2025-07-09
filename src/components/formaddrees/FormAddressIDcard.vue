<script setup lang="ts">
const addressFormStore = useAddressFormStore();
const { addressIdCardForm } = storeToRefs(addressFormStore);

const businessPartnerStore = useBusinessPartnerStore();
const { businessPartner } = storeToRefs(businessPartnerStore);
const addressLoading = ref(false);
const props = defineProps(["props"]);
</script>

<template>
  <div class="box_form_customer_type" id="formAddressIDcard">
    <q-list class="rounded-borders">
      <q-expansion-item header-class="bg_field_light_gray icon_color_gray" default-opened>
        <template #header>
          <q-item-section avatar>
            <q-icon color="black" name="holiday_village" />
          </q-item-section>

          <q-item-section class="text_expansion">
            <!-- ที่อยู่ตามบัตรประชาชน -->
            {{ useTitleFormAddressIDcard() ?? "ที่อยู่ตามบัตรประชาชน" }}
          </q-item-section>
        </template>
        <!-- <pre>
          {{ addressIdCardForm }}
        </pre> -->
        <q-card>
          <q-card-section>
            <div class="box_form_info">
              <div class="row q-pa-sm">
                <AddressInput v-model="addressIdCardForm" v-model:loading="addressLoading" :readonly="!CAN_EDIT.BP.value || (businessPartner?.id && !EDIT_ACTION)
                  " />
              </div>
            </div>
          </q-card-section>

          <q-inner-loading :showing="addressLoading" label="กำลังโหลด..." label-class="color_primary"
            style="background-color: rgb(245 247 248)" />
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
