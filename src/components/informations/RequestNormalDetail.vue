<script setup lang="ts">
const props = defineProps<{
  title: string;
  canEdit: boolean;
}>();

const canEdit = computed(() => props.canEdit);

const requestStore = useRequestStore();
const { requestServiceForm } = storeToRefs(requestStore);
</script>

<template>
  <div class="col-12">
    <div class="text-sub-head q-px-sm q-pt-sm text-weight-600">
      {{ props.title }}
    </div>
  </div>
  <div class="q-pa-sm col-12 col-md-12">
    <q-field
      class="border_dashed input_filled_custom"
      readonly
      filled
      label="บริการที่ต้องการขอใช้"
      stack-label
      label-color="grey-14"
      bg-color="white"
      type="text"
    >
      <template #control>
        <div class="full-width no-outline self-center" tabindex="0">
          {{ getServiceTitle() }}
        </div>
      </template>
    </q-field>
  </div>

  <div class="q-pa-sm col-12 col-md-12">
    <q-field
      class="border_dashed input_filled_custom"
      readonly
      filled
      label="ช่วงเวลาที่สะดวกให้ติดต่อกลับ"
      stack-label
      label-color="grey-14"
      bg-color="white"
      type="text"
    >
      <template #control>
        <div class="full-width no-outline self-center" tabindex="0">
          {{ getTimeByFlag(requestServiceForm) }}
        </div>
      </template>
    </q-field>
  </div>

  <div class="q-pa-sm col-12 col-md-12">
    <q-input
      :readonly="!canEdit"
      v-model="requestServiceForm.detail"
      bg-color="white"
      color="primary"
      label-color="grey-14"
      filled
      label
      class="input_filled input_filled_custom"
      hide-bottom-space
      type="textarea"
      :input-style="{ height: '80px' }"
    >
      <template #label> รายละเอียดเพิ่มเติม </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
