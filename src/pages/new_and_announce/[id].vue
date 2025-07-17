<!-- src/pages/new_and_announce/[id].vue -->
<template>
  <content-container>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="!item" class="error-container">
      <h2>ไม่พบข้อมูล</h2>
      <p>ไม่สามารถหาข้อมูลที่คุณต้องการได้</p>
      <button @click="goBack" class="back-button">กลับหน้าหลัก</button>
    </div>

    <div v-else class="detail-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="main-title">{{ item.title }}</h1>
        <p class="subtitle">{{ item.intro }}</p>
        <div class="date-info">
          <svg class="date-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ item.date }}</span>
        </div>
      </div>

      <!-- Image Section -->
      <div class="image-section">
        <img
          :src="item.image || '/assets/images/test-image.png'"
          :alt="item.title"
          class="main-image"
          @error="handleImageError"
        />
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <div class="description-text">
          {{ item.description }}
        </div>

        <!-- Event Details -->
        <div>
          <h2 class="section-title">กำหนดการอบรม</h2>

          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label"
                > • วัน/เวลา:
                <span class="detail-value">{{
                  item.date
                }}</span></span
              >
            </div>

            <div class="detail-item">
              <span class="detail-label"
                > • สถานที่:
                <span class="detail-value">{{
                  item.location || "ไม่ระบุ"
                }}</span></span
              >
            </div>

            <div class="detail-item">
              <span class="detail-label"
                > • กลุ่มเป้าหมาย:
                <span class="detail-value">{{
                  item.target || "ไม่ระบุ"
                }}</span></span
              >
            </div>

            <div class="detail-item">
              <span class="detail-label"
                > • ค่าใช้จ่าย:
                <span class="detail-value">{{
                  item.cost || "ไม่ระบุ"
                }}</span></span
              >
            </div>
          </div>
        </div>

        <!-- Topics Section -->
        <div v-if="item.topic" class="topics-section">
          <h2 class="section-title">หัวข้อการอบรม</h2>
          <div>
            <div
              v-for="(topic, index) in topicsList"
              :key="index"
              class="topic-item"
            >
              • {{ topic }}
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div v-if="item.contact">
          <h2 class="detail-value">หากต้องการสอบถามเพิ่มเติม กรุณาติดต่อ</h2>
          <div class="contact-info">
            <a :href="`mailto:${item.contact}`" class="contact-link">
              {{ item.contact }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </content-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ContentContainer from "~/layouts/ContentContainer.vue";
import {
  mockNewAndAnnounceData,
  type NewAndAnnounceData,
} from "~/data/newAndAnnounceData";

const route = useRoute();
const router = useRouter();

// Reactive data
const item = ref<NewAndAnnounceData | null>(null);
const loading = ref(true);

// Computed properties
const itemId = computed(() => parseInt(route.params.id as string));

const breadcrumbs = computed(() => [
  { text: "หน้าหลัก", link: "/" },
  { text: "ข่าวและประกาศ", link: "/new_and_announce/list" },
  { text: item.value?.title || "รายละเอียด" },
]);

const topicsList = computed(() => {
  if (!item.value?.topic) return [];
  return item.value.topic
    .split("/n")
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
});

// Methods
const loadData = async () => {
  try {
    loading.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Find item by ID
    const foundItem = mockNewAndAnnounceData.find(
      (data) => data.id === itemId.value
    );

    if (foundItem) {
      item.value = foundItem;
    } else {
      item.value = null;
    }
  } catch (error) {
    console.error("Error loading data:", error);
    item.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/new_and_announce/list");
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/assets/images/test-image.png";
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  min-height: 400px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #69306d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.error-container h2 {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.back-button {
  background: #69306d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 3px solid #69306d;
}

.main-title {
  font-size: 32px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.date-info {
  display: flex;
  align-items: start;
  justify-content: start;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.date-icon {
  width: 20px;
  height: 20px;
}

.image-section {
  margin-bottom: 32px;

  justify-items: center;
}

.main-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-bottom: 40px;
}

.description-text {
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 16px;
  text-align: justify;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 8px 0 8px 0;
  padding-bottom: 2px;
}

.details-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font: bold;
  font-size: 16px;
  color: #000000;
}

.detail-value {
  font-size: 16px;
  color: #374151;
}

.topics-section {
  margin-bottom: 32px;
}

.topic-item {
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
  line-height: 1.5;
}

.topic-item:last-child {
  margin-bottom: 0;
}

.contact-info {
  display: flex;
  align-items: center;

  
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.contact-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.back-section {
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.back-to-list-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #69306d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-to-list-button:hover {
  background: #5a285d;
  transform: translateY(-2px);
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .detail-container {
    padding: 0 16px;
  }
}
</style>
