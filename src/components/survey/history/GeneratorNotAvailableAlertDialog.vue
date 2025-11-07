<script setup lang="ts">
const props = defineProps(['open'])
const emit = defineEmits(['update:open'])
const open = ref(props.open || false)

function onClose() {
  emit('update:open', false)
}
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card
      style="min-width: 700px; max-width: 700px; width: 700px; height: 300px;"
      class="!px-14 !py-8"
    >
      <q-card-section aligen="center" class="text-center">
        <q-icon name="calendar_today" size="40px" color="primary" />
        <br>
        <div class="text-primary !mt-8">
          เครื่องกำเนิดไฟฟ้าไม่ว่างในช่วงเวลาที่คุณเลือก
          <div class="!mt-8" />
          กรุณาเลือกการไฟฟ้าเจ้าของเครื่องอื่น
        </div>
      </q-card-section>

      <q-card-actions align="center" class="px-4 pb-4 !mt-4">
        <q-btn color="primary" label="ปิด" class="!h-12 !w-[270px]" @click="onClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
