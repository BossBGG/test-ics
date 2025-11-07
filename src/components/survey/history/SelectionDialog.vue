<script setup>
import { computed, ref } from 'vue'

const props = defineProps(['open'])
const emit = defineEmits(['update:open'])
const item = defineModel('item')

const open = ref(props.open || false)
const defaultItem = ref({ ...item.value })
const stationDialogOpen = ref(false)

watch(() => props.open, (newVal) => {
  if (props.open) {
    defaultItem.value = { ...item.value }
  }
  open.value = newVal
})

function confirm() {
  item.value.pea_code = defaultItem.value.pea_code || ''
  item.value.tel_number = defaultItem.value.tel_number || ''
  item.value.pea_name = defaultItem.value.pea_name || null
  item.value.distance = defaultItem.value.distance || 0
  item.value.ref_generator_size_id = defaultItem.value.ref_generator_size_id
  emit('update:open', false)
}

function openStationDialog() {
  stationDialogOpen.value = true
}

function updateItem(peaOffice) {
  if (peaOffice && peaOffice.pea_office) {
    defaultItem.value.pea_code = peaOffice.pea_office.pea_code || ''
    defaultItem.value.tel_number = peaOffice.pea_office.tel_number || ''
    defaultItem.value.pea_name = peaOffice.pea_office.pea_name || null
    defaultItem.value.distance = peaOffice.pea_office.distance || 0
    defaultItem.value.ref_generator_size_id = peaOffice.selectedId || null
    console.log(`defaultItem.value.ref_generator_size_id`, defaultItem.value.ref_generator_size_id)
  }
}

function updateGeneratorSize(id) {
  defaultItem.value.ref_generator_size_id = id || null
  defaultItem.value.pea_code = ''
  defaultItem.value.tel_number = ''
  defaultItem.value.pea_name = null
  defaultItem.value.distance = 0
}

function onClose() {
  emit('update:open', false)
}
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card class="max-w-[92vw] w-[550px]">
      <q-card-section>
        <div class="text-primary !font-semibold">
          เลือกเครื่องกำเนิดไฟฟ้า
        </div>
        <div class="!mb-4">
          <GeneratorSelect
            v-model="defaultItem.ref_generator_size_id"
            class="h-[68px] !border-[1px] !border-[#E7E7E7] !rounded-lg !border-solid"
            @update:model-value="updateGeneratorSize"
          />
        </div>
        <div class="!mb-4">
          <q-input
            v-model="defaultItem.pea_name"
            bg-color="white"
            color="primary"
            filled
            stack-label
            readonly
            standout
            label="เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง"
            class="input_filled input_filled_custom h-[68px] !border-[1px] !border-[#E7E7E7] !rounded-lg !border-solid"
          >
            <template #append>
              <div class="!mt-2">
                <q-btn color="primary" icon="link" @click="openStationDialog()">
                  เลือก
                </q-btn>
              </div>
            </template>
          </q-input>
        </div>
        <div>
          <q-input
            v-model="defaultItem.tel_number"
            bg-color="white"
            color="primary"
            filled
            stack-label
            readonly
            standout
            label="เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง"
            class="input_filled input_filled_custom h-[68px] !border-[1px] !border-[#E7E7E7] !rounded-lg !border-solid"
          />
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="px-4 pb-4">
        <q-btn outline label="ยกเลิก" class="!w-25" @click="onClose" />
        <q-btn color="primary" label="ยืนยัน" class="!w-25" :disabled="!defaultItem.pea_code" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <StationDialog
    v-model:generator="defaultItem"
    :selectable="true"
    :model-open-dialog="stationDialogOpen"
    @update:model-open-dialog="stationDialogOpen = $event"
    @confirm="updateItem"
  />
</template>

<style scoped>
/* optional: remove group border seam look */
:deep(.btn-toggle-gap .q-btn-group) {
  box-shadow: none;
}

.input_filled :deep(.q-field__control::before) {
  border-bottom-style: none;
}

.input_filled :deep(.q-field__control-container) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 68px;
}
</style>
