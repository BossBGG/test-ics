<!-- src/pages/work_order/special-form/s332_Solar_Air_Conditioner/Video.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import "@/styles/surveydata.css";

interface UploadedVideo {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface Props {
  modelValue?: { [key: string]: UploadedVideo | null };
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
});

const emit = defineEmits<{
  "update:modelValue": [value: { [key: string]: UploadedVideo | null }];
  "videos-change": [videos: UploadedVideo[]];
}>();

// Define video containers
const videoContainers = [
  { 
    id: 'ac-breaker-off', 
    title: 'คลิปการทำงานของเครื่องปรับอากาศยังสามารถทำงานโดยที่',
    subtitle: 'Off เบรกเกอร์ AC ที่รับไฟจากการไฟฟ้า'
  },
  { 
    id: 'dc-breaker-off', 
    title: 'คลิปการทำงานของเครื่องปรับอากาศยังสามารถทำงานโดยที่',
    subtitle: 'Off เบรกเกอร์ DC ที่รับไฟจากแผง'
  }
];

const uploadedVideos = ref<{ [key: string]: UploadedVideo | null }>(props.modelValue || {});
const fileInputRefs = ref<{ [key: string]: HTMLInputElement }>({});

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for videos
const ALLOWED_TYPES = ["video/mp4", "video/avi", "video/mov", "video/wmv"];

const handleFileUpload = (event: Event, containerId: string) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;

  const file = files[0]; // Only take the first file

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    alert(`ไฟล์ ${file.name} ไม่ใช่วิดีโอที่รองรับ (MP4, AVI, MOV, WMV)`);
    target.value = "";
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    alert(`ไฟล์ ${file.name} มีขนาดเกิน 100MB`);
    target.value = "";
    return;
  }

  // Process the file
  const reader = new FileReader();
  reader.onload = (e) => {
    const newVideo: UploadedVideo = {
      id: Date.now() + Math.random().toString(),
      name: file.name,
      url: e.target?.result as string,
      file: file,
    };

    uploadedVideos.value[containerId] = newVideo;
    emitChanges();
  };
  reader.readAsDataURL(file);

  target.value = "";
};

const removeVideo = (containerId: string) => {
  uploadedVideos.value[containerId] = null;
  emitChanges();
};

const emitChanges = () => {
  emit("update:modelValue", { ...uploadedVideos.value });
  const allVideos = Object.values(uploadedVideos.value).filter(video => video !== null) as UploadedVideo[];
  emit("videos-change", allVideos);
};

const triggerFileInput = (containerId: string) => {
  const input = fileInputRefs.value[containerId];
  if (input) {
    input.click();
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<template>
  <CardCollapse title="คลิปวิดีโอ" icon="/assets/images/doc.png">
    <div class="video-container">
      <!-- Video Container Grid -->
      <div class="video-grid">
        <div
          v-for="container in videoContainers"
          :key="container.id"
          class="video-item-container"
        >
          <!-- Container Header -->
          <div class="video-header">
            <div class="video-title">{{ container.title }}</div>
            <div class="video-subtitle">{{ container.subtitle }}</div>
          </div>

          <!-- Video Display Area -->
          <div class="video-display">
            <!-- Show uploaded video -->
            <div v-if="uploadedVideos[container.id]" class="uploaded-video-wrapper">
              <!-- Video Preview -->
              <div class="video-preview">
                <video 
                  :src="uploadedVideos[container.id]!.url"
                  class="video-element"
                  controls
                  preload="metadata"
                >
                  เบราว์เซอร์ของคุณไม่รองรับการแสดงวิดีโอ
                </video>
                
                <!-- Video Info -->
                <div class="video-info">
                  <div class="video-name">{{ uploadedVideos[container.id]!.name }}</div>
                  <div class="video-size">{{ formatFileSize(uploadedVideos[container.id]!.file.size) }}</div>
                </div>

                <!-- Remove Button -->
                <button
                  @click="removeVideo(container.id)"
                  class="video-remove-button"
                  title="ลบวิดีโอ"
                >
                  <q-icon name="close" />
                </button>
              </div>
            </div>

            <!-- Upload area when no video -->
            <div v-else class="video-upload-area">
              <div class="video-upload-content">
                <div class="upload-icon">
                  <img src="/assets/images/video.png" alt="" class="w-18 h-14">
                </div>
                <p class="upload-text">
                  อัปโหลดไฟล์วิดีโอที่รองรับ<br>
                  ขนาดสูงสุด 100 MB<br>
                  รองรับไฟล์: MP4, AVI, MOV, WMV
                </p>
                <button
                  @click="triggerFileInput(container.id)"
                  class="video-upload-button"
                  type="button"
                >
                  <q-icon name="cloud_upload" />
                  อัพโหลดวิดีโอ
                </button>
              </div>
            </div>

            <!-- Hidden file input for each container -->
            <input
              :ref="(el) => { if (el) fileInputRefs[container.id] = el as HTMLInputElement }"
              type="file"
              accept=".mp4,.avi,.mov,.wmv,video/*"
              @change="(event) => handleFileUpload(event, container.id)"
              class="video-hidden-input"
            />
          </div>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
     @import "@/styles/video.css";
</style>