<script setup lang="ts">
const props = defineProps(["disable"]);
const model = defineModel();
</script>

<template>
  <q-field
    v-model="model"
    class="input_filled_custom border_dashed"
    filled
    label="รหัสไปรษณีย์"
    label-color="grey-14"
    readonly
    bg-color="white"
    type="text"
    :disable="props.disable"
  >
    <template #label>
      <div>รหัสไปรษณีย์<span class="color_negative">*</span></div>
    </template>
    <template #control>
      <div class="full-width no-outline self-center" tabindex="0">
        {{ model }}
      </div>
    </template>
  </q-field>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
