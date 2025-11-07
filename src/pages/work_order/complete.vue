<script setup lang="ts">
import { ref } from "vue";
import CompleteWorkPopup from "@/components/popup/CompleteWorkPopup.vue";
import { Button } from "@/components/ui/button";

const isPopupOpen = ref(false);

const openPopup = () => {
  isPopupOpen.value = true;
};

const onCompleteWork = (selectedIds: number[]) => {
  console.log("กำลังจะจบงาน ID:", selectedIds);
};
</script>

<template>
  <q-page padding>
    <div class="p-4 flex flex-col items-start gap-4">
      <Button variant="default" @click="openPopup"> เปิด Popup จบงาน </Button>

      <CompleteWorkPopup v-model="isPopupOpen" @complete="onCompleteWork" />
    </div>
  </q-page>
</template>
