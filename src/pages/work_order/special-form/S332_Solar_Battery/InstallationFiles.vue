<!-- src/pages/work_order/special-form/s332_Solar_Battery/InstallationFiles.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import "@/styles/installation-files.css";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  uploadDate?: Date;
  isUploading?: boolean;
}

interface Props {
  modelValue?: UploadedFile[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: UploadedFile[]];
  "files-change": [files: UploadedFile[]];
}>();

const uploadedFiles = ref<UploadedFile[]>(props.modelValue || []);
const uploading = ref(false);
const fileInputRef = ref<HTMLInputElement>();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
];

// Computed
const uploadedCount = computed(
  () => uploadedFiles.value.filter((file) => !file.isUploading).length
);

const totalCount = computed(() => uploadedFiles.value.length);

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
      alert(`ไฟล์ ${file.name} ไม่ใช่ไฟล์ที่รองรับ (SVG, PNG, JPG, GIF)`);
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

  // Add files with loading state first
  const tempFiles: UploadedFile[] = validFiles.map((file) => ({
    id: Date.now() + Math.random().toString(),
    name: file.name,
    size: file.size,
    file: file,
    isUploading: true,
  }));

  uploadedFiles.value = [...uploadedFiles.value, ...tempFiles];
  emitChanges();

  // Simulate upload process for each file
  validFiles.forEach((file, index) => {
    // Simulate upload delay
    setTimeout(
      () => {
        const uploadedFile: UploadedFile = {
          ...tempFiles[index],
          uploadDate: new Date(),
          isUploading: false,
        };

        processedCount++;

        // Update specific file when loaded
        const fileIndex = uploadedFiles.value.findIndex(
          (f) => f.id === tempFiles[index].id
        );
        if (fileIndex !== -1) {
          uploadedFiles.value[fileIndex] = uploadedFile;
        }

        emitChanges();

        // Set uploading to false when all files are processed
        if (processedCount === validFiles.length) {
          uploading.value = false;
        }
      },
      1000 + index * 500
    ); // Stagger uploads
  });

  // Reset input
  target.value = "";
};

const removeFile = (id: string) => {
  uploadedFiles.value = uploadedFiles.value.filter((file) => file.id !== id);
  emitChanges();
};

const emitChanges = () => {
  emit("update:modelValue", uploadedFiles.value);
  emit("files-change", uploadedFiles.value);
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

const getUploadStatus = (file: UploadedFile) => {
  if (file.isUploading) {
    return "อัพโหลดกำลังดำเนินการ";
  }
  return "อัพโหลดเสร็จสิ้น";
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "svg":
      return "image";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return "image";
    default:
      return "insert_drive_file";
  }
};

const getFileTypeColor = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "svg":
      return "#f59e0b";
    case "png":
      return "#3b82f6";
    case "jpg":
    case "jpeg":
      return "#10b981";
    case "gif":
      return "#8b5cf6";
    default:
      return "#6b7280";
  }
};
</script>

<template>
  <CardCollapse title="ไฟล์" icon="/assets/images/doc.png">
    <div class="installation-files-container">
      <div class="flex flex-col">
        <div class="text-center pb-4 text-[18px] text-[#57595B]">
          แบบการติดตั้ง
        </div>

        <!-- Upload Area -->
        <div class="upload-section">
          <input
            ref="fileInputRef"
            type="file"
            multiple
            accept=".svg,.png,.jpg,.jpeg,.gif"
            @change="handleFileUpload"
            class="file-input"
            :disabled="uploading"
          />
          <button type="button" @click="triggerFileInput" :disabled="uploading">
            <div class="upload-area">
              <div class="upload-content">
                <div class="upload-icon">
                  <img src="/assets/images/upload-install.png" alt="" />
                </div>

                <div class="upload-text">
                  <p class="upload-title">คลิกเพื่ออัพโหลดหรือลากและวาง</p>
                  <p class="upload-description">
                    SVG, PNG, JPG หรือ GIF (สูงสุด 800x400 พิกเซล)<br />
                    ขนาดไฟล์เกิน 10MB
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Uploaded Files List -->
        <div class="files-list-section">
          <div v-if="uploadedFiles.length > 0" class="files-list">
            <div v-for="file in uploadedFiles" :key="file.id" class="file-item">
              <div class="file-icon">
                <div v-if="file.isUploading" class="loading-spinner">
                  <div class="spinner"></div>
                </div>
                <q-icon
                  v-else
                  :name="getFileIcon(file.name)"
                  class="file-type-icon"
                  :style="{ color: getFileTypeColor(file.name) }"
                />
              </div>

              <div class="file-info">
                <p class="file-name">{{ file.name }}</p>
                <div class="file-meta">
                  <span>{{ formatFileSize(file.size) }}</span>
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
            <q-icon name="description" class="no-files-icon" />
            <p>ไม่มีไฟล์แบบการติดตั้ง</p>
          </div>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>
