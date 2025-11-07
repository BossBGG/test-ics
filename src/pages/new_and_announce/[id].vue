<!-- src/pages/new_and_announce/[id].vue -->
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import ContentContainer from "~/layouts/ContentContainer.vue";
import {dismissPopup, showError, showProgress} from "~/composables/alert";
import {getDetailAnnouncement} from "~/api/news_api";
import {mapPublishRange, NewsData} from "~/data/newsData";

const route = useRoute();
const router = useRouter();

const item = ref<NewsData>({} as NewsData);

async function loadData() {
  showProgress()
  const idOrUuid = route.params.id as string;
  try {
    if (idOrUuid) {
      await getDetailAnnouncement(idOrUuid).then(res => {
        if (res.data.success) {
          item.value = res.data.data as NewsData;
          if(parseInt(item.value.status) === 3) {
            router.push('/ineligible')
            dismissPopup()
            return;
          }

          dismissPopup()
        } else {
          showError('ไม่พบข้อมูล').then(() => {
            goBack()
          })
        }
      })
    }
  }catch (error) {
    showError('ไม่พบข้อมูล').then(() => {
      goBack()
    })
  }

}

function goBack() {
  router.push("/new_and_announce/list");
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/assets/images/test-image.png";
}

onMounted(loadData);
</script>

<template>
  <ContentContainer>
    <div class="detail-container">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="main-title">
          {{ item.title }}
        </h1>
        <p class="subtitle">
          {{ item.description }}
        </p>
        <div class="date-info" v-if="item.publishDateStart && item.publishDateEnd">
          <svg class="date-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ mapPublishRange(item.publishDateStart, item.publishDateEnd) }}</span>
        </div>
      </div>

      <!-- Image Section -->
      <div class="image-section">
        <img
          :src="item.coverImageFile?.url || '/assets/images/test-image.png'"
          :alt="item.coverImageFile?.fileName || 'announcement cover image'"
          class="main-image"
          @error="handleImageError"
        />
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <div v-if="item.content" class="content-html" v-html="item.content"/>
      </div>

      <button
        @click="goBack"
        class="custom-button back-button"
      >
        ย้อนกลับ
      </button>
    </div>
  </ContentContainer>
</template>

<style scoped>

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container h2 {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.back-button {
  background: #994C80;
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

.content-html :deep(*) {
  font-size: 16px;
  line-height: 1.7;
  color: #374151;
}

.content-html :deep(h1),
.content-html :deep(h2),
.content-html :deep(h3) {
  margin: 16px 0 8px;
  color: #1f2937;
}

.content-html :deep(p) {
  margin: 0 0 12px;
}

.content-html :deep(ul) {
  padding-left: 20px;
  margin: 0 0 12px;
}

.content-html :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
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
