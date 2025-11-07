<script setup lang="ts">
const fetchComplete = defineModel();
</script>

<template>
  <div class="box_details_request">
    <FormPriceCloneNew :fetchComplete="fetchComplete" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
