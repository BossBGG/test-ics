<script setup lang="ts">
const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);

const quotationStore = useQuotationStore();
const { quotation, quotationForm } = storeToRefs(quotationStore);
</script>

<template>
  <div class="form-payment">
    <div class="row">
      <div class="col-12">
        <div class="title">
          <h5>รูปแบบการชำระเงิน : ชำระเต็มจำนวน</h5>
        </div>
      </div>
      <div class="col-12 q-mt-md">
        <div class="box_note">
          <q-input
            v-model="quotationForm.reviewer_memo"
            bg-color="white"
            label-color="grey-14"
            color="grey-14"
            label="หมายเหตุผู้ดำเนินการตรวจสอบ"
            class="input_filled_custom"
            filled
            hide-bottom-space
            autogrow
            maxlength="500"
            :readonly="
              (quotation?.value?.status != 'Q' &&
                quotation?.reviewed_by != userProfile?.username) ||
              quotation?.status == 'A' ||
              !quotation?.id ||
              quotation?.review_status == 'R' ||
              quotation?.review_status == 'P'
            "
          />
        </div>
      </div>
      <div class="col-12 q-mt-md">
        <div class="box_note">
          <q-input
            v-model="quotationForm.memo"
            bg-color="white"
            label-color="grey-14"
            color="grey-14"
            label="หมายเหตุผู้ดำเนินการอนุมัติ"
            class="input_filled_custom"
            filled
            hide-bottom-space
            autogrow
            maxlength="500"
            :readonly="
              (quotation?.value?.status != 'Q' &&
                quotation?.approved_by != userProfile?.username) ||
              quotation?.status == 'A' ||
              !quotation?.id
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.form-payment {
  .title {
    h5 {
      font-size: 14px;
      font-weight: 600;
      color: $text_input;

      @media #{$screen-mds-min} {
        font-size: 16px;
      }
    }
  }

  .box_note {
    @include border-radius-separate(4px, 4px, 0, 0);

    small {
      font-size: 10px;
      color: $text_dropdown;

      @media #{$screen-mds-min} {
        font-size: 12px;
      }
    }

    p {
      font-size: 12px;
      color: $text_input;

      @media #{$screen-mds-min} {
        font-size: 15px;
      }
    }

    .input_filled_custom {
      &[type="textarea"] {
        > div {
          min-height: 50px;
        }
      }
    }
  }
}
</style>
