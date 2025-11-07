<script setup lang="ts">
const props = defineProps(['disabled', 'labelText', 'customClass'])

const $q = useQuasar()

const model = defineModel<File | string | null>()

// Dialog states
const showConfirmDialog = ref(false)
const showSuccessDialog = ref(false)
const showUploadDialog = ref(false)
const showUploadSuccessDialog = ref(false)
const previousValue = ref<any>(null)
const isClearing = ref(false)
const selectedFile = ref<File | null>(null)

// Watch model changes to detect clearing
watch(model, (newValue, oldValue) => {
  if (oldValue && !newValue && !isClearing.value) {
    // File was cleared, show confirmation
    previousValue.value = oldValue
    model.value = oldValue // Restore the file temporarily
    showDeleteConfirmation()
  }
}, { immediate: true, deep: true })

function downloadFile(file: File | string) {
  if (!file)
    return

  if (typeof file === 'string') {
    // ถ้าเป็น URL จาก server
    window.open(file, '_blank')
  }
  else {
    // ถ้าเป็น File object
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
  }

  $q.notify({
    type: '',
    icon: 'download',
    message: 'ดาวน์โหลดไฟล์เรียบร้อยแล้ว',
    position: 'top',
    timeout: 2000,
    classes: 'default-notify',
    actions: [{ icon: 'close' }],
  })
}

function showDeleteConfirmation(event?: Event) {
  /*
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
    */
  showConfirmDialog.value = true
}

function confirmDelete() {
  isClearing.value = true
  model.value = null
  showConfirmDialog.value = false
  showSuccessDialog.value = true
  // Reset flag after a short delay
  nextTick(() => {
    isClearing.value = false
  })
}

function cancelDelete() {
  showConfirmDialog.value = false
  // File is already restored in the watcher, no need to do anything
}

function closeSuccessDialog() {
  showSuccessDialog.value = false
}

function showUpload() {
  showUploadDialog.value = true
}

function onFileSelect(file: File | null) {
  selectedFile.value = file
}

function confirmUpload() {
  if (selectedFile.value) {
    model.value = selectedFile.value
    showUploadDialog.value = false
    showUploadSuccessDialog.value = true
    selectedFile.value = null
  }
}

function cancelUpload() {
  selectedFile.value = null
  showUploadDialog.value = false
}

function closeUploadSuccessDialog() {
  showUploadSuccessDialog.value = false
}

function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
}

function removeSelectedFile() {
  selectedFile.value = null
}

// Handle file drop event
function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    onFileSelect(files[0])
  }
}

function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'mdi-file-pdf-box'
    case 'doc':
    case 'docx':
      return 'mdi-file-word-box'
    default:
      return 'mdi-file-document'
  }
}

function getFileIconColor(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'negative'
    case 'doc':
    case 'docx':
      return 'blue'
    default:
      return 'grey'
  }
}

function getDisplayName(file: File | string | null): string {
  if (!file)
    return ''

  if (typeof file === 'string') {
    // If it's a URL, extract filename from last part
    // return file.split('/').pop() || file
    return file
  }

  // If it's a File object
  return file.name || ''
}
</script>

<template>
  <q-input
    :model-value="getDisplayName(model ?? null)"
    standout
    :label="labelText"
    class="input_file input_filled input_filled_custom clickable-filename"
    :class="[customClass]"
    readonly
    style="cursor: pointer;"
    @click="model ? downloadFile(model) : showUpload()"
  >
    <template #append>
      <q-btn
        v-if="model"
        icon="mdi-close-circle"
        flat
        round
        size="sm"
        style="color: #994C80"
        @click.stop="showDeleteConfirmation"
      />

      <q-btn
        v-if="model"
        icon="download"
        color="primary"
        label="ดาวน์โหลด"
        size="md"
        variant="infilled"
        flat outline
        @click="downloadFile(model || '')"
      />
      <!-- Remove upload icon if file exists -->
      <q-btn
        v-else
        icon="o_file_upload"
        color="primary"
        label="อัปโหลด"
        size="md"
        @click="showUpload"
      />
    </template>
    <template #label>
      {{ labelText }}
    </template>
  </q-input>

  <!-- Confirmation dialog -->
  <q-dialog v-model="showConfirmDialog">
    <q-card style="min-width: 700px; min-height: 300px;">
      <q-card-section class="q-pb-none row items-center justify-center">
        <q-icon style="margin-top: 40px;" name="mdi-file-remove-outline" color="primary" size="48px" />
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-h6 q-mt-sm text-primary">
          ยืนยันการลบไฟล์หรือไม่
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none" style="margin-top: 32px;">
        <q-btn
          label="ยกเลิก"
          outline
          color="primary"
          class="q-px-xl width-270 height-40"
          @click="cancelDelete"
        />
        <q-btn
          label="ยืนยัน"
          color="primary"
          class="q-px-xl width-270 height-40"
          @click="confirmDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Success dialog -->
  <q-dialog v-model="showSuccessDialog">
    <q-card style="min-width: 700px; min-height: 300px;">
      <q-card-section class="q-pb-none row items-center justify-center">
        <q-icon style="margin-top: 40px;" name="mdi-check-circle" color="primary" size="58px" />
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-h6 text-primary q-mt-sm">
          ลบไฟล์เรียบร้อยแล้ว
        </div>
      </q-card-section>

      <q-card-actions align="center" style="margin-top: 32px;">
        <q-btn
          v-close-popup
          color="primary"
          label="ตกลง"
          class="q-px-xl width-270 height-40"
          @click="closeSuccessDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Upload dialog -->
  <q-dialog v-model="showUploadDialog">
    <q-card style="min-width: 550px;" class="q-pa-md">
      <div class="text-h6 q-mt-sm text-primary">
        อัปโหลดไฟล์
      </div>

      <q-card-section>
        <div
          class="custom-upload-area flex-column flex items-center justify-center"
          style="border: 1px dashed #AAAAAA; border-radius: 12px; padding: 32px; background: #f8f8f9;"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="handleDrop"
        >
          <div class="text-center">
            <q-icon name="file_upload" size="48px" style="color: #C8C8C8" />
            <div class="text-body2" style="color: #C8C8C8">
              ลากหรือวางไฟล์ที่นี่
            </div>
          </div>
          <div style="width: 80%; border-bottom: 1px solid #e0e0e0; text-align: center; margin-bottom: 20px;">
            <span class="text-grey-6" style="background: #f8f8f9; padding: 0 12px; position: relative; top: 12px;">
              หรือ
            </span>
          </div>
          <q-btn
            label="เลือกไฟล์"
            outline
            style="min-width: 120px; border-color: #C8C8C8 !important; color: #C8C8C8"
            @click="($refs.fileInput as HTMLInputElement)?.click()"
          />
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            style="display: none;"
            @change="(e) => onFileSelect((e.target as HTMLInputElement)?.files?.[0] || null)"
          >
        </div>
        <div class="q-mt-sm text-body">
          รองรับไฟล์ pdf ขนาดไม่เกิน 25 MB สูงสุด 1 ไฟล์
        </div>
        <!-- Show selected file as attachment -->
        <div v-if="selectedFile" class="q-mt-md">
          <q-card flat bordered class="q-pa-sm">
            <div class="row items-center">
              <q-icon
                name="mdi-file"
                style="color: #69306D"
                size="24px"
                class="q-mr-sm"
              />
              <div class="col">
                <div class="text-body2 text-weight-medium">
                  {{ selectedFile.name }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ formatFileSize(selectedFile.size) }}
                </div>
              </div>
              <q-btn
                icon="mdi-close-circle"
                flat
                round
                size="md"
                style="color: #69306D"
                @click="removeSelectedFile"
              />
            </div>
          </q-card>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pt-none">
        <q-btn
          label="ยกเลิก"
          color="grey-6"
          outline
          style="min-width: 100px;"
          @click="cancelUpload"
        />
        <q-btn
          label="ยืนยัน"
          color="primary"
          style="min-width: 100px;"
          :disable="!selectedFile"
          @click="confirmUpload"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Upload success dialog -->
  <q-dialog v-model="showUploadSuccessDialog">
    <q-card style="min-width: 700px; min-height: 300px;">
      <q-card-section style="margin-top: 40px;" class="q-pb-none row items-center justify-center">
        <q-icon name="mdi-check-circle" color="primary" size="58px" />
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-h6 text-primary q-mt-sm">
          อัปโหลดไฟล์เรียบร้อยแล้ว
        </div>
      </q-card-section>

      <q-card-actions align="center" style="margin-top: 32px;">
        <q-btn
          v-close-popup
          color="primary"
          label="ตกลง"
          class="q-px-xl width-270 height-40"
          @click="closeUploadSuccessDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.input_filled_custom :deep(.q-field__control) {
  background: white !important;
}
:deep(.q-field__control:before) {
  border: none !important;
  border-bottom: 1px dashed #c0c0c0 !important;
}
.q-field {
  :deep(.q-field__native > input ~ div) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
  }
}

.clickable-filename {
  :deep(.q-field__native) {
    text-decoration: underline;
    cursor: pointer;
    //color: #1976d2; // Primary blue color for link appearance

    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }
}
/*
.input_file {
  .q-field__native > input ~ div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
  }

  .mdi-close-circle {
    color: #994c80;
    padding-top: 12px;
  }

  .q-field__control {
    &::before {
      border-bottom-style: dashed;
    }

    background-color: white !important;
    .q-field__native div {
      color: black !important;
    }
  }
}
*/
</style>
