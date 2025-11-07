<script setup lang="ts">
const props = defineProps(["customClass", "readonly"]);
const model = defineModel();
</script>

<template>
  <div :class="props.customClass">
    <q-input
      v-model="model"
      filled
      color="primary"
      label="หมายเลขบัตรประชาชน"
      class="idCard input_filled"
      hide-bottom-space
      maxlength="17"
      :rules="[
        (val) =>
          (val !== null && val !== '' && val.length >= 13) ||
          'กรุณากรอกหมายเลขบัตรประชาชน',
      ]"
      :readonly="props.readonly"
      @paste="copyOnlyNumber"
      mask="#-####-#####-##-#"
      unmasked-value
    >
      <template #label>
        หมายเลขบัตรประชาชน<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
