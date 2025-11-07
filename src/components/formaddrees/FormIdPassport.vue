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
      label="หมายเลขหนังสือเดินทาง"
      class="input_filled"
      hide-bottom-space
      :readonly="props.readonly"
      maxlength="30"
      :rules="[
        (val) => (val && val.length > 0) || 'กรุณากรอกหมายเลขหนังสือเดินทาง',
      ]"
    >
      <template #label>
        หมายเลขหนังสือเดินทาง<span class="color_negative">*</span>
      </template>
    </q-input>
    {{}}
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
