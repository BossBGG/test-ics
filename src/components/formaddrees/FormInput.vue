<script setup lang="ts">
const props = defineProps([
  "customClass",
  "label",
  "rule",
  "maxLength",
  "readonly",
]);
const model = defineModel();
</script>

<template>
  <div :class="props.customClass">
    <q-input
      v-model="model"
      filled
      bg-color="white"
      :label="props.label"
      class="input_filled input_filled_custom"
      hide-bottom-space
      :maxlength="props.maxLength"
      :rules="[props.rule ?? '']"
      @keypress="blockNumbers"
      @paste="copyOnlyText"
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
