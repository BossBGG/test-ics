<script setup lang="ts">
import { copyToClipboard } from '~/utils/utils'

const props = defineProps(['item', 'index', 'allowUpdateItem'])
const emit = defineEmits(['remove-order'])
const { item } = props

const openSelectGeneratorDialog = ref(false)
const openConfirmDialog = ref(false)

const serviceItemStore = useServiceItemStore()
const { generators } = storeToRefs(serviceItemStore)

const generatorTitle = computed(() => {
  const found = generators.value.find(ge => ge?.ref_generator_size_id === item.ref_generator_size_id)
  return found ? `${found.ref_generator_size_desc}` : ''
})

function openSelectableDialogFor(index: number) {
  openSelectGeneratorDialog.value = true
}

function onClose() {
  openConfirmDialog.value = false
}
function onOpen() {
  openConfirmDialog.value = true
}

function removeOrder(index: number) {
  emit('remove-order', index)
  openConfirmDialog.value = false
}
</script>

<template>
  <div class="q-pa-sm col-12" style="padding-left: 0 !important;">
    <div class="q-pa-sm text-primary font-weight-600 flex items-center font-16" style="column-gap:8px; padding-bottom: 0 !important;">
      <span class="min-w-32 w-[max-content]">เครื่อง {{ generatorTitle }} :</span> รายการที่ {{ index + 1 }}
      <q-icon
        v-if="allowUpdateItem" size="20px" name="mdi-close-circle" class="cursor-pointer" color="secondary"
        @click="onOpen"
      />
    </div>
    <div class="row col-12">
      <div class="q-pa-sm col-6">
        <div class="h-[56px] flex items-center justify-between border-b border-gray-400 rounded-t-sm border-dashed bg-white !px-5">
          <div>
            <div class="text-[#57595b]">
              การไฟฟ้าเจ้าของเครื่อง
            </div>
            <div class="text-[#343A40]">
              {{ item.pea_name ? `(${item.pea_name})` : '' }}
            </div>
          </div>
          <div class="text-primary">
            ระยะทาง : {{ item.distance || '-' }} กม.
          </div>
          <div>
            <q-btn color="primary" @click="openSelectableDialogFor(index)">
              <q-icon name="launch" class="q-mr-sm" size="20px" />
              เลือก
            </q-btn>
          </div>
        </div>
      </div>
      <div class="q-pa-sm col-6">
        <q-input
          v-model="item.tel_number"
          bg-color="white"
          color="primary"
          label-color="grey-14"
          filled
          stack-label
          label="เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง"
          class="input_filled input_filled_custom"
          hide-bottom-space
          :readonly="true"
        >
          <template #append>
            <div style="font-size: 12px; color: #994C80; cursor: pointer" @click="copyToClipboard(`${item.phone_number}`)">
              <q-icon
                name="content_copy"
                class="cursor-pointer"
                style="color: #994C80"
              />
              คัดลอก
            </div>
          </template>
        </q-input>
      </div>
    </div>
  </div>

  <SelectionDialog
    v-model:open="openSelectGeneratorDialog"
    v-model:item="item"
  />

  <q-dialog v-model="openConfirmDialog" persistent>
    <q-card
      style="min-width: 700px; max-width: 700px; width: 700px; height: 300px;"
      class="!px-14 !py-8"
    >
      <q-card-section aligen="center" class="text-center">
        <q-icon name="delete" size="60px" color="primary" />
        <br>
        <div class="text-primary !mt-4">
          ยืนยันการลบเครื่องหรือไม่
        </div>
      </q-card-section>

      <q-card-actions align="center" class="px-4 pb-4 !mt-10">
        <q-btn outline label="ยกเลิก" class="text-primary !h-12 !w-[270px]" @click="onClose" />
        <q-btn color="primary" label="ยืนยัน" class="!h-12 !w-[270px]" @click="removeOrder" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
