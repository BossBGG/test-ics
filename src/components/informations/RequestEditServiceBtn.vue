<script setup lang="ts">

const props = defineProps<{
  canEdit: boolean
}>()

const canEdit = computed(() => props.canEdit)

</script>

<template>
  <div class="q-pa-sm col-12 col-md-12">
    <q-btn v-if="canEdit" flat label="แก้ไขประเภทคำร้อง" class="bg-secondary text-white"
      @click="openEditServiceModal()" />
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
