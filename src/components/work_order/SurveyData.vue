<!-- src/components/work_order/SurveyData.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import "@/styles/surveydata.css";

interface SurveyRecord {
  id: number;
  employee: string;
  surveyDate: string;
  result: "ผ่าน" | "ไม่ผ่าน";
  details: string;
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface Props {
  modelValue?: UploadedImage[];
  surveyData?: SurveyRecord[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  surveyData: () => [],
});

const emit = defineEmits<{
  "update:modelValue": [value: UploadedImage[]];
  "images-change": [images: UploadedImage[]];
}>();

// Mock survey data
const mockSurveyData: SurveyRecord[] = [
  {
    id: 1,
    employee: "501616 : วิโรจน์ ถันชนนาง",
    surveyDate: "08/11/2024",
    result: "ผ่าน",
    details: "ย้ายเสาไฟแรงสูงออกจากหน้าบ้าน",
  },
];

const uploadedImages = ref<UploadedImage[]>(props.modelValue || []);
const fileInputRef = ref<HTMLInputElement>();

const surveyRecords = computed(() => {
  return props.surveyData.length > 0 ? props.surveyData : mockSurveyData;
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return;

  // Filter valid files
  const validFiles = Array.from(files).filter((file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ (PNG, JPG)`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
      return false;
    }

    return true;
  });

  if (validFiles.length === 0) {
    target.value = "";
    return;
  }

  // Process valid files
  validFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: UploadedImage = {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        url: e.target?.result as string,
        file: file,
      };

      uploadedImages.value = [...uploadedImages.value, newImage];
      emitChanges();
    };
    reader.readAsDataURL(file);
  });

  target.value = "";
};

const removeImage = (id: string) => {
  uploadedImages.value = uploadedImages.value.filter((img) => img.id !== id);
  emitChanges();
};

const emitChanges = () => {
  emit("update:modelValue", uploadedImages.value);
  emit("images-change", uploadedImages.value);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const getResultClass = (result: string) => {
  return result === "ผ่าน" ? "result-pass" : "result-fail";
};
</script>

<template>
  <CardCollapse title="ข้อมูลจากการสำรวจ" icon="/assets/images/map-icon.png">
    <div class="survey-data-container">
      <!-- Survey Table Section -->
      <div class="survey-table-section">
        <h4 class="section-title">ประวัติการสำรวจ</h4>

        <div class="table-container">
          <table class="survey-table">
            <thead>
              <tr class="table-header">
                <th class="header-cell">ลำดับ</th>
                <th class="header-cell employee-col">พนักงานสำรวจ</th>
                <th class="header-cell">วันที่สำรวจ</th>
                <th class="header-cell">ผลสำรวจ</th>
                <th class="header-cell details-col">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in surveyRecords"
                :key="record.id"
                class="table-row"
              >
                <td class="table-cell center-cell">{{ index + 1 }}</td>
                <td class="table-cell">{{ record.employee }}</td>
                <td class="table-cell center-cell">{{ record.surveyDate }}</td>
                <td class="table-cell center-cell">
                  <span
                    :class="['result-badge', getResultClass(record.result)]"
                  >
                    {{ record.result }}
                  </span>
                </td>
                <td class="table-cell">{{ record.details }}</td>
              </tr>

              <tr v-if="surveyRecords.length === 0" class="table-row">
                <td colspan="5" class="table-cell no-data">
                  ไม่มีข้อมูลการสำรวจ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Images Upload Section -->
      <div class="surveydata-images-section">
        <h4 class="section-title">รูปแนบเพิ่มเติม</h4>

        <div class="surveydata-images-container">
          <!-- Uploaded Images -->

          <div
            v-for="image in uploadedImages"
            :key="image.id"
            class="surveydata-image-container"
          >
            <div class="bg-white p-2 rounded-lg border border-[#CD9EBE]">
              <img
                :src="image.url"
                :alt="image.name"
                class="surveydata-uploaded-image"
              /> 
              <button
                @click="removeImage(image.id)"
                class="surveydata-remove-button"
                title="ลบรูปภาพ"
              >
                <q-icon name="close" />
              </button>
            </div>
          </div>

          <!-- Upload Area (with upload button) -->
          <div class="surveydata-upload-container">
            <div class="surveydata-upload-area">
              <div class="surveydata-upload-content">
                <div class="flex justify-center items-center mb-8">
                  <img
                    src="/assets/images/images.png"
                    alt=""
                    class="w-16 h-18 object-contain"
                  />
                </div>

                <p class="upload-text">
                  อัปโหลดไฟล์ที่รองรับ 1 รายการ ขนาดสูงสุด 10 MB<br />
                  ขนาดสูงสุด 800x400 px
                </p>

                <button
                  @click="triggerFileInput"
                  class="surveydata-upload-button w-full items-center justify-center text-center"
                  type="button"
                >
                  <img src="/assets/images/upload-icon.png" alt="" class="w-5 h-5 mx-2">
                  อัพโหลดรูปภาพ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden file input -->
        <input
          ref="fileInputRef"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg"
          @change="handleFileUpload"
          class="surveydata-hidden-input"
        />
      </div>
    </div>
  </CardCollapse>
</template>

