<!-- src/components/work_execution/AddImages.vue -->
<script setup lang="ts">
import {ref, computed} from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import "@/styles/add-images.css";
import {UploaddedImage, WorkOrderObj} from "~/api/types.js";
import {uploadWorkOrderExecutionImage} from "~/api/work_order_api.js";

interface UploadedImage {
  id: number;
  name: string;
  size: number;
  url: string;
  file: File;
  uploadDate?: Date;
  isUploading?: boolean;
}

interface Props {
  data: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const uploadedImages = ref<UploadedImage[]>([]);
const uploading = ref(false);
const fileInputRef = ref<HTMLInputElement>();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

onMounted(() => {
  if (props.data?.execution?.images?.length) {
    props.data.execution.images.map((image: UploaddedImage) => {
      const tempImage: UploadedImage = {
        id: image.id,
        name: image.name || image.fileName,
        size: image.size || image.fileSize,
        url: image.url,
        file: image.file,
      }
      uploadedImages.value = [...uploadedImages.value, tempImage];
    })

    emitChanges()
  }
})

// Methods
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  uploading.value = true;

  // Filter valid files first
  const validFiles = Array.from(files).filter((file) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ (PNG, JPG)`);
      return false;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
      return false;
    }

    return true;
  });

  // If no valid files, stop uploading
  if (validFiles.length === 0) {
    uploading.value = false;
    target.value = "";
    return;
  }

  let processedCount = 0;

  // Add images with loading state first
  const tempImages: UploadedImage[] = validFiles.map((file) => ({
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    url: "",
    file: file,
    isUploading: true,
  }));

  uploadedImages.value = [...uploadedImages.value, ...tempImages];
  emitChanges();

  validFiles.forEach(async (file, index) => {
    const response = await uploadWorkOrderExecutionImage(file);

    if (!response || response?.status !== 200) {
      showError('อัปโหลดไม่สำเร็จ')
      return
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedImage: UploadedImage = {
        ...tempImages[index],
        url: e.target?.result as string,
        uploadDate: new Date(),
        isUploading: false,
        id: response?.data?.id || 0
      };

      processedCount++;

      const imageIndex = uploadedImages.value.findIndex(
        (img) => img.id === tempImages[index].id,
      );
      if (imageIndex !== -1) {
        uploadedImages.value[imageIndex] = uploadedImage;
      }

      emitChanges();

      // Set uploading to false when all files are processed
      if (processedCount === validFiles.length) {
        uploading.value = false;
      }
    };

    reader.onerror = () => {
      processedCount++;

      // Remove failed image
      uploadedImages.value = uploadedImages.value.filter(
        (img) => img.id !== tempImages[index].id,
      );
      emitChanges();

      if (processedCount === validFiles.length) {
        uploading.value = false;
      }
    };

    reader.readAsDataURL(file);
  });

  // Reset input
  target.value = "";
};

const removeImage = (id: number) => {
  uploadedImages.value = uploadedImages.value.filter((img) => img.id !== id);
  emitChanges();
};

const emitChanges = () => {
  emit("update:data", {
    ...props.data,
    images: uploadedImages.value.map((img) => img.id),
  })
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatUploadTime = (date: Date) => {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const getUploadStatus = (image: UploadedImage) => {
  if (image.isUploading) {
    return "อัปโหลดไฟล์...";
  }
  return "เสร็จสิ้น";
};
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
                    <div class="flex flex-row">
                      •
                      <div class="flex flex-row px-2 gap-1 justify-between">
                        <img
                          src="/assets/images/success-icon.png"
                          alt=""
                          class="w-4 h-4"
                        />
                        {{ getUploadStatus(image) }}

                      </div>
                      <div class="flex flex-row gap-2 justify-between">
                        <img
                          src="/assets/images/calendar_month.png"
                          alt=""
                          class="w-4 h-4"
                        />
                        {{ formatUploadTime(image.uploadDate) }}
                      </div>
                    </div>
                  </span>
                </div>

                <!-- Upload Progress/Status -->
                <!-- <div v-if="image.isUploading" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                </div>
                <div v-else class="upload-status">
                  {{ getUploadStatus(image) }}
                </div> -->
              </div>

              <div class="image-actions">

                <button
                  type="button"
                  class="action-btn delete-btn"
                  @click="removeImage(image.id)"
                  :disabled="image.isUploading"
                  title="ลบ"
                >
                  <img src="/assets/images/i-f-delete.png" alt="" class="w-3 h-4">
                </button>
              </div>
            </div>
          </div>

          <div v-else class="no-images">
            <q-icon name="image" class="no-images-icon"/>
            <p>ไม่มีรูปแนบเพิ่มเติม</p>
          </div>
        </div>

        <!-- Right Column - Upload Area -->
        <div class="upload-section">
          <div class="upload-area">
            <div class="upload-content">
              <div class="pt-6">
                <img src="/assets/images/images.png" alt="" class="w-15 h-18">
              </div>

              <div class="upload-text">
                <p class="upload-description">
                  อัปโหลดไฟล์ที่รองรับ 1 รายการ ขนาดสูงสุด 10 MB<br/>
                  ขนาดสูงสุด 800x400 px
                </p>
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
                  class="images-upload-button"
                  :disabled="uploading"
                >
                  <img
                    src="/assets/images/upload-icon.png"
                    alt=""
                    class="w-5 h-5 mx-2"
                  />
                  {{ uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>
