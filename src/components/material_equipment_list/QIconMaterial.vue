<script lang="ts" setup>
defineProps({
  name: String,
  size: String,
  style: Object,
})
</script>
<template>
  <q-icon :name="name" :size="size" :style="style"/>
</template>
