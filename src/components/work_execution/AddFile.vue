<!-- src/components/work_execution/AddFile.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import '@/styles/add-file.css'
import {UploadedFile, WorkOrderObj} from "~/api/types.js";
import {uploadWorkOrderExecutionAttachment} from "~/api/work_order_api.js";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:data': [value: WorkOrderObj]
}>()

const uploadedFiles = ref<UploadedFile[]>( [])
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['application/pdf']

onMounted(() => {
  if(props.data?.execution?.attachments?.length > 0) {
    props.data.execution.attachments.map((attach: UploadedFile) => {
      const tempFile: UploadedFile = {
        id: attach.id,
        name: attach.name || attach.fileName || "",
        size: attach.size || attach.fileSize || 0,
        url: attach.url,
        file: attach.file
      }

      uploadedFiles.value = [...uploadedFiles.value, tempFile]
    })
    emitChanges()
  }
})

// Methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  uploading.value = true

  // Filter valid files first
  const validFiles = Array.from(files).filter((file) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`ไฟล์ ${file.name} ไม่ใช่ไฟล์ PDF`)
      return false
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`)
      return false
    }

    return true
  })

  // If no valid files, stop uploading
  if (validFiles.length === 0) {
    uploading.value = false
    target.value = ''
    return
  }

  let processedCount = 0

  // Add files with loading state first
  const tempFiles: UploadedFile[] = validFiles.map(file => ({
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    file: file,
    url: "",
    isUploading: true
  }))

  uploadedFiles.value = [...uploadedFiles.value, ...tempFiles]
  emitChanges()

  // Simulate upload process for each file
  validFiles.forEach(async (file, index) => {
    // Simulate upload delay
    const res = await uploadWorkOrderExecutionAttachment(file);

    if (!res || res?.status !== 200) {
      showError('อัปโหลดไม่สำเร็จ')
      return
    }

    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        ...tempFiles[index],
        uploadDate: new Date(),
        isUploading: false,
        id: res?.data?.id || 0
      }

      processedCount++

      // Update specific file when loaded
      const fileIndex = uploadedFiles.value.findIndex(f => f.id === tempFiles[index].id)
      if (fileIndex !== -1) {
        uploadedFiles.value[fileIndex] = uploadedFile
      }

      emitChanges()

      // Set uploading to false when all files are processed
      if (processedCount === validFiles.length) {
        uploading.value = false
      }
    }, 1000 + index * 500) // Stagger uploads
  })

  // Reset input
  target.value = ''
}

const removeFile = (id: number) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== id)
  emitChanges()
}

const emitChanges = () => {
  emit("update:data", {
    ...props.data,
    attachments: uploadedFiles.value.map((file) => file.id),
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatUploadTime = (date: Date) => {
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const getUploadStatus = (file: UploadedFile) => {
  if (file.isUploading) {
    return 'อัปโหลดไฟล์...'
  }
  return 'เสร็จสิ้น'
}
</script>

<template>
  <CardCollapse title="ไฟล์แนบเพิ่มเติม" icon="/assets/images/doc.png">
    <div class="add-files-container">
      <div class="files-content">

        <!-- Left Column - Uploaded Files List -->
        <div class="files-list-section">
          <h4 class="section-title">
            ไฟล์แนบเพิ่มเติม ({{ uploadedFiles.length }})
          </h4>

          <div v-if="uploadedFiles.length > 0" class="files-list">
            <div
              v-for="file in uploadedFiles"
              :key="file.id"
              class="file-item"
            >
              <div class="file-icon">
                <div v-if="file.isUploading" class="loading-spinner">
                  <div class="spinner"></div>
                </div>
                <q-icon
                  v-else
                  name="picture_as_pdf"
                  class="pdf-icon"
                />
              </div>

              <div class="file-info">
                <a v-if="file.url" :href="file.url" target="_blank">
                  <p class="file-name">{{ file.name }}</p>
                </a>
                <p class="file-name" v-else>{{ file.name }}</p>
                <div class="file-meta">
                  <span>{{ formatFileSize(file.size) }} </span>
                  <span v-if="file.uploadDate" class="upload-time">
                    <div class="flex flex-row">
                        •
                      <div class="flex flex-row px-2 gap-1 justify-between">
                        <img src="/assets/images/success-icon.png" alt="" class="w-4 h-4">

                          {{ getUploadStatus(file) }}

                      </div>
                      <div class="flex flex-row  gap-2 justify-between">
                        <img src="/assets/images/calendar_month.png" alt="" class="w-4 h-4">
                        {{ formatUploadTime(file.uploadDate) }}
                      </div>

                    </div>
                  </span>
                </div>

                <!-- Upload Progress/Status -->
                <!-- <div v-if="file.isUploading" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                </div>
                <div v-else class="">

                </div> -->
              </div>

              <div class="file-actions">

                <button
                  type="button"
                  class="action-btn delete-btn"
                  @click="removeFile(file.id)"
                  :disabled="file.isUploading"
                  title="ลบ"
                >
                  <img src="/assets/images/i-f-delete.png" alt="" class="w-3 h-4">
                </button>
              </div>
            </div>
          </div>

          <div v-else class="no-files">
            <q-icon name="picture_as_pdf" class="no-files-icon" />
            <p>ไม่มีไฟล์แนบเพิ่มเติม</p>
          </div>
        </div>

        <!-- Right Column - Upload Area -->
        <div class="upload-section">
          <div class="upload-area">
            <div class="upload-content">
              <div class="pt-6">
                <img src="/assets/images/upload_file.png" alt="" class="w-13 h-16">
              </div>

              <div class="upload-text">
                <p class="upload-description">
                  รองรับสกุลไฟล์ .pdf<br>
                  ขนาดสูงสุด 10 MB
                </p>

              </div>

              <div class="upload-button-container">
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept=".pdf"
                  @change="handleFileUpload"
                  class="file-input"
                  :disabled="uploading"
                />
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="upload-button"
                  :disabled="uploading"
                >
                  <img src="/assets/images/upload-icon.png" alt="" class="w-5 h-5 mx-2">
                  {{ uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์' }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </CardCollapse>
</template>

