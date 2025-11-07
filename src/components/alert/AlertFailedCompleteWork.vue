<script setup lang="ts">
import ButtonFormat from "~/components/ui/button/ButtonFormat.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const onClose = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <q-dialog
    :model-value="props.modelValue"
    @update:modelValue="onClose"
    persistent
  >
    <q-card class="w-full max-w-md ">
      <q-bar class="bg-[#69306D] text-white p-2 h-[48px]">
        <span class="text-xl font-medium">ทำรายการไม่สำเร็จ</span>
      </q-bar>
      <q-card-section class="flex flex-col items-center gap-4">
        <img
          src="/assets/images/failed.png"
          alt="failed icon"
          class="w-50 h-36"
        />
        <div class="text-xl font-medium text-gray-500 text-center">
          จบงาน <span class="text-[#65004A]">'ไม่สำเร็จ!'</span>
        </div>
      </q-card-section>

      <q-card-actions class="flex justify-center gap-4 p-4">
        <ButtonFormat format="close" @click="onClose" />
        <ButtonFormat format="re_entertransaction" @click="onClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
