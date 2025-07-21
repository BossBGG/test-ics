<!-- src/components/work_execution/AddFile.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import '@/styles/add-file.css'
interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
  uploadDate?: Date
  isUploading?: boolean
}

interface Props {
  modelValue?: UploadedFile[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: UploadedFile[]]
  'files-change': [files: UploadedFile[]]
}>()

const uploadedFiles = ref<UploadedFile[]>(props.modelValue || [])
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['application/pdf']

// Computed
const uploadedCount = computed(() => 
  uploadedFiles.value.filter(file => !file.isUploading).length
)

const totalCount = computed(() => uploadedFiles.value.length)

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
    id: Date.now() + Math.random().toString(),
    name: file.name,
    size: file.size,
    file: file,
    isUploading: true
  }))

  uploadedFiles.value = [...uploadedFiles.value, ...tempFiles]
  emitChanges()

  // Simulate upload process for each file
  validFiles.forEach((file, index) => {
    // Simulate upload delay
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        ...tempFiles[index],
        uploadDate: new Date(),
        isUploading: false
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

const removeFile = (id: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== id)
  emitChanges()
}

const emitChanges = () => {
  emit('update:modelValue', uploadedFiles.value)
  emit('files-change', uploadedFiles.value)
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
    return 'อัพโหลดกำลังดำเนินการ'
  }
  return 'อัพโหลดเสร็จสิ้น'
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
                <p class="file-name">{{ file.name }}</p>
                <div class="file-meta">
                  <span>{{ formatFileSize(file.size) }} • PDF</span>
                  <span v-if="file.uploadDate" class="upload-time">
                    • {{ formatUploadTime(file.uploadDate) }}
                  </span>
                </div>

                <!-- Upload Progress/Status -->
                <div v-if="file.isUploading" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                </div>
                <div v-else class="upload-status">
                  {{ getUploadStatus(file) }}
                </div>
              </div>

              <div class="file-actions">
                <button
                  type="button"
                  class="action-btn save-btn"
                  :disabled="file.isUploading"
                  title="บันทึก"
                >
                  <q-icon name="save" />
                </button>
                <button
                  type="button"
                  class="action-btn delete-btn"
                  @click="removeFile(file.id)"
                  :disabled="file.isUploading"
                  title="ลบ"
                >
                  <q-icon name="delete" />
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
              <div class="upload-icon">
                <q-icon name="picture_as_pdf" />
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
                  <q-icon name="cloud_upload" />
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

