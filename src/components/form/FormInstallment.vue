<script setup lang="ts">
const selectedOption = ref('')
const serviceOptions = ['ผ่อนชำระเป็นงวด', 'ผ่อนชำระเป็นงวด']

const selectedOption2 = ref(null)
const serviceOptions2 = ['ผ่อนชำระเป็นงวด', 'ผ่อนชำระเป็นงวด']

const price = ref(null)
</script>

<template>
  <div class="form-installment">
    <div class="row">
      <div class="col-md-4 col-12 q-pr-lg-sm q-p-none">
        <q-select
          v-model="selectedOption" filled :options="serviceOptions" bg-color="white" label="การชำระเงิน"
          class="input_filled_custom border_dashed" label-color="grey-14"
        />
      </div>
      <div class="col-md-4 col-12 q-px-s mtop">
        <q-select
          v-model="selectedOption2" filled :options="serviceOptions2" bg-color="white"
          label="ระบุจำนวนงวดที่ผ่อนชำระ" class="input_filled_custom border_dashed" label-color="grey-14"
        />
      </div>
      <div class="col-md-4 col-12 mtop q-pl-lg-sm">
        <q-input
          v-model.number="price" filled class="input_filled_custom border_dashed" label-color="grey-14"
          type="text" :value="allPrice" maxlength="10" bg-color="white" label="ราคาต่องวด" @keypress="allowOnlyPrice"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@style';

.form-installment {
  .q-my-md {
    margin: 0;
  }

  .q-pr-lg-sm {
    padding-right: 16px;

    @media #{$screen-mds-max} {
      padding-right: 0;
    }
  }

  .q-pl-lg-sm {
    padding-left: 16px;

    @media #{$screen-mds-max} {
      padding-left: 0;
    }
  }

  .mtop {
    margin-top: 0;

    @media #{$screen-mds-max} {
      margin-top: 16px;
    }
  }
}
</style>
