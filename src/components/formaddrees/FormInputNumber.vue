<script setup lang="ts">
const props = defineProps([
  "customClass",
  "label",
  "rule",
  "readonly",
  "required",
]);
const model = defineModel();
</script>

<template>
  <div :class="props.customClass">
    <q-input
      v-model="model"
      filled
      :label="props.label"
      class="input_filled"
      hide-bottom-space
      maxlength="13"
      :rules="[props.rule ?? '']"
      @keypress="allowOnlyNumbers"
      @paste="copyOnlyNumber"
      :readonly="props.readonly"
    >
      <template #label v-if="props.rule">
        {{ props.label }}<span class="color_negative">*</span>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
