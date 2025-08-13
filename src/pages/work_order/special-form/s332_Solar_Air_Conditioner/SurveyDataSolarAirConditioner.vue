<!-- src/pages/work_order/special-form/s332_Solar_Air_Conditioner/SurveyDataSolarAirConditioner.vue -->
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
  showSurveyTable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  surveyData: () => [],
  showSurveyTable: true,
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

// Define image containers with titles
const imageContainers = [
    { id: 'main_panel', title: 'ภาพหน้าบ้านลูกค้า' },
    { id: 'air_conditioner', title: 'ภาพรุ่น model เครื่องปรับอากาศ' },
    { id: 'mounting_structure', title: 'ภาพโครงสร้างยึดแผง (Mounting Structure)' },
    { id: 'solar_panel', title: 'ภาพรุ่น/model แผงโซลาร์' },
    { id: 'solar_installation', title: 'ภาพการติดตั้งแผงโซลาร์' },
    { id: 'coil', title: 'ภาพคอยล์เย็น และ คอยล์ร้อน' },
    { id: 'water_pipe', title: 'ภาพเดินท่อน้ำยาและน้ำทิ้ง' },
    { id: 'ac_breaker', title: 'รูป AC Breaker และการเดินสายไฟ' },
    { id: 'dc_breaker', title: 'รูป DC Breaker และการเดินสายไฟ' },
    { id: 'warranty_card', title: 'ใบรับประกัน' },
    { id: 'grounding_system', title: 'รูปการต่อสายกราวด์ (Grounding System) (ถ้ามี)' },
];

const uploadedImages = ref<{ [key: string]: UploadedImage | null }>({});
const fileInputRefs = ref<{ [key: string]: HTMLInputElement }>({});

const surveyRecords = computed(() => {
  return props.surveyData.length > 0 ? props.surveyData : mockSurveyData;
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const handleFileUpload = (event: Event, containerId: string) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;

  const file = files[0]; // Only take the first file

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพที่รองรับ (PNG, JPG)`);
    target.value = "";
    return;
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    alert(`ไฟล์ ${file.name} มีขนาดเกิน 10MB`);
    target.value = "";
    return;
  }

  // Process the file
  const reader = new FileReader();
  reader.onload = (e) => {
    const newImage: UploadedImage = {
      id: Date.now() + Math.random().toString(),
      name: file.name,
      url: e.target?.result as string,
      file: file,
    };

    uploadedImages.value[containerId] = newImage;
    emitChanges();
  };
  reader.readAsDataURL(file);

  target.value = "";
};

const removeImage = (containerId: string) => {
  uploadedImages.value[containerId] = null;
  emitChanges();
};

const emitChanges = () => {
  const allImages = Object.values(uploadedImages.value).filter(
    (img) => img !== null
  ) as UploadedImage[];
  emit("update:modelValue", allImages);
  emit("images-change", allImages);
};

const triggerFileInput = (containerId: string) => {
  const input = fileInputRefs.value[containerId];
  if (input) {
    input.click();
  }
};

const getResultClass = (result: string) => {
  return result === "ผ่าน" ? "result-pass" : "result-fail";
};

// Group containers into rows of 3
const imageContainerRows = computed(() => {
  const rows = [];
  for (let i = 0; i < imageContainers.length; i += 3) {
    rows.push(imageContainers.slice(i, i + 3));
  }
  return rows;
});
</script>

<template>
  
    <div class="solar-survey-data-container">
      <!-- Survey Table Section -->
      <div v-if="showSurveyTable" class="survey-table-section">
        
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
      <div class="solar-images-section">
        <!-- Image Container Rows -->
        <div
          v-for="(row, rowIndex) in imageContainerRows"
          :key="rowIndex"
          class="solar-image-row"
        >
          <div
            v-for="container in row"
            :key="container.id"
            class="solar-image-container"
          >
            <!-- Container Title -->
            <div class="container-title">
              {{ container.title }}
            </div>

            <!-- Image Display Area -->
            <div class="solar-image-display">
              <!-- Show uploaded image -->
              <div
                v-if="uploadedImages[container.id]"
                class="uploaded-image-wrapper"
              >
                <img
                  :src="uploadedImages[container.id]!.url"
                  :alt="uploadedImages[container.id]!.name"
                  class="solar-uploaded-image"
                />
                <button
                  @click="removeImage(container.id)"
                  class="solar-remove-button"
                  title="ลบรูปภาพ"
                >
                  <q-icon name="close" />
                </button>
              </div>

              <!-- Upload area when no image -->
              <div v-else class="solar-upload-area">
                <div class="solar-upload-content">
                  <img
                    src="/assets/images/images.png"
                    alt=""
                    class="w-12 h-12 mb-2"
                  />
                  <p class="upload-text">
                    อัปโหลดไฟล์ที่รองรับ 1 รายการ ขนาดสูงสุด 10 MB<br />
                    ขนาดสูงสุด 800x400 px
                  </p>
                  <button
                    @click="triggerFileInput(container.id)"
                    class="solar-upload-button"
                    type="button"
                  >
                    <img src="/assets/images/upload-icon.png" alt="" class="w-5 h-5 mx-2">
                    อัพโหลดรูปภาพ
                  </button>
                </div>
              </div>

              <!-- Hidden file input for each container -->
              <input
                :ref="
                  (el) => {
                    if (el)
                      fileInputRefs[container.id] = el as HTMLInputElement;
                  }
                "
                type="file"
                accept=".png,.jpg,.jpeg"
                @change="(event) => handleFileUpload(event, container.id)"
                class="solar-hidden-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  
</template>

<style scoped>
    @import "@/styles/solar-air-conditioner.css";
</style>
