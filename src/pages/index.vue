<script setup lang="ts">
const test = hasQuery("test");
</script>

<template>
  <TheIndexTest v-if="test" />
</template>

<style lang="scss" scoped>
@import "@style";
</style>
