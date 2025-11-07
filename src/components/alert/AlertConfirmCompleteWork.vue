<script setup lang="ts">
import ButtonFormat from "~/components/ui/button/ButtonFormat.vue";

const props = defineProps<{
  modelValue: boolean;
  count: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

const onClose = () => {
  emit("update:modelValue", false);
};

const onConfirm = () => {
  emit("confirm");
  onClose();
};
</script>

<template>
  <q-dialog
    :model-value="props.modelValue"
    @update:model-value="onClose"
    persistent
  >
    <q-card class="w-full max-w-md">
      <q-bar class="bg-[#69306D] text-white p-2 h-[48px]">
        <span class="text-xl font-medium">ยืนยันการทำรายการ</span>
      </q-bar>
      <q-card-section class="flex flex-col items-center gap-4">
        <img
          src="/assets/images/confirm-cpw.png"
          alt="confirm icon"
          class="w-50 h-36"
        />
        <div class="text-xl font-medium text-center">
          ยืนยันจบใบสั่งงาน <span class="text-[#65004A]">‘ใช่ หรือ ไม่’ </span>
        </div>
        <div class="text-base text-gray-500 text-center">
          จบงานจำนวน
          <span class="text-[#65004A]">'{{ props.count }} ใบ'</span>
        </div>
      </q-card-section>

      <q-card-actions class="flex justify-center gap-4 p-4">
        <ButtonFormat format="close" @click="onClose" />
        <ButtonFormat format="confirm" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
