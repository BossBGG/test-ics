<!-- src/components/work_execution/AddImages.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import '@/styles/add-images.css'
interface UploadedImage {
  id: string
  name: string
  size: number
  url: string
  file: File
  uploadDate?: Date
  isUploading?: boolean
}

interface Props {
  modelValue?: UploadedImage[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: UploadedImage[]]
  'images-change': [images: UploadedImage[]]
}>()

const uploadedImages = ref<UploadedImage[]>(props.modelValue || [])
const uploading = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

// Computed
const uploadedCount = computed(() => 
  uploadedImages.value.filter(img => !img.isUploading).length
)

const totalCount = computed(() => uploadedImages.value.length)

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
      alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ (PNG, JPG)`)
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

  // Add images with loading state first
  const tempImages: UploadedImage[] = validFiles.map((file) => ({
    id: Date.now() + Math.random().toString(),
    name: file.name,
    size: file.size,
    url: '',
    file: file,
    isUploading: true,
  }))

  uploadedImages.value = [...uploadedImages.value, ...tempImages]
  emitChanges()

  validFiles.forEach((file, index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const uploadedImage: UploadedImage = {
        ...tempImages[index],
        url: e.target?.result as string,
        uploadDate: new Date(),
        isUploading: false,
      }

      processedCount++

      // Update specific image when loaded
      const imageIndex = uploadedImages.value.findIndex(img => img.id === tempImages[index].id)
      if (imageIndex !== -1) {
        uploadedImages.value[imageIndex] = uploadedImage
      }

      emitChanges()

      // Set uploading to false when all files are processed
      if (processedCount === validFiles.length) {
        uploading.value = false
      }
    }

    reader.onerror = () => {
      processedCount++

      // Remove failed image
      uploadedImages.value = uploadedImages.value.filter(img => img.id !== tempImages[index].id)
      emitChanges()

      if (processedCount === validFiles.length) {
        uploading.value = false
      }
    }

    reader.readAsDataURL(file)
  })

  // Reset input
  target.value = ''
}

const removeImage = (id: string) => {
  uploadedImages.value = uploadedImages.value.filter(img => img.id !== id)
  emitChanges()
}

const emitChanges = () => {
  emit('update:modelValue', uploadedImages.value)
  emit('images-change', uploadedImages.value)
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
    minute: '2-digit',
  })
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const getUploadStatus = (image: UploadedImage) => {
  if (image.isUploading) {
    return 'อัพโหลดกำลังดำเนินการ'
  }
  return 'อัพโหลดเสร็จสิ้น'
}
</script>

<template>
  <CardCollapse title="รูปแนบเพิ่มเติม" icon="/assets/images/doc.png">
    <div class="add-images-container">
      <div class="images-content">
        
        <!-- Left Column - Uploaded Images List -->
        <div class="images-list-section">
          <h4 class="section-title">
            รูปแนบเพิ่มเติม ({{ uploadedImages.length }})
          </h4>

          <div v-if="uploadedImages.length > 0" class="images-list">
            <div 
              v-for="image in uploadedImages" 
              :key="image.id"
              class="image-item"
            >
              <div class="image-thumbnail">
                <div v-if="image.isUploading" class="loading-spinner">
                  <div class="spinner"></div>
                </div>
                <img
                  v-else
                  :src="image.url"
                  :alt="image.name"
                  class="thumbnail-img"
                />
              </div>

              <div class="image-info">
                <p class="image-name">{{ image.name }}</p>
                <div class="image-meta">
                  <span>{{ formatFileSize(image.size) }}</span>
                  <span v-if="image.uploadDate" class="upload-time">
                    • {{ formatUploadTime(image.uploadDate) }}
                  </span>
                </div>

                <!-- Upload Progress/Status -->
                <div v-if="image.isUploading" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                </div>
                <div v-else class="upload-status">
                  {{ getUploadStatus(image) }}
                </div>
              </div>

              <div class="image-actions">
                <button
                  type="button"
                  class="action-btn save-btn"
                  :disabled="image.isUploading"
                  title="บันทึก"
                >
                  <q-icon name="save" />
                </button>
                <button
                  type="button"
                  class="action-btn delete-btn"
                  @click="removeImage(image.id)"
                  :disabled="image.isUploading"
                  title="ลบ"
                >
                  <q-icon name="delete" />
                </button>
              </div>
            </div>
          </div>

          <div v-else class="no-images">
            <q-icon name="image" class="no-images-icon" />
            <p>ไม่มีรูปแนบเพิ่มเติม</p>
          </div>
        </div>

        <!-- Right Column - Upload Area -->
        <div class="upload-section">
          <div class="upload-area">
            <div class="upload-content">
              <div class="upload-icon">
                <q-icon name="image" />
              </div>

              <div class="upload-text">
                <p class="upload-description">
                  รองรับไฟล์นามสกุล .png หรือ .jpg
                </p>
                <p class="upload-limit">ขนาดสูงสุด 10 MB</p>
              </div>

              <div class="upload-button-container">
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg"
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
                  {{ uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดรูปภาพ' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </CardCollapse>
</template>

