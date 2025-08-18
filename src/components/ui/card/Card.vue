<!-- src/components/ui/card/Card.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {mapPublishRange, NewsData} from "~/data/newsData";

interface Props {
  data: NewsData;
}

const props = defineProps<Props>();
const router = useRouter();

const statusClass = computed(() => {
  switch (props.data.status) {
    case "new":
      return "bg-red-500 text-white";
    case "news":
      return "bg-blue-500 text-white";
    case "activity":
      return "bg-green-500 text-white";
    case "training":
      return "bg-orange-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
});

const statusLabel = computed(() => {
  switch (props.data.status) {
    case "new":
      return "ใหม่";
    case "news":
      return "ข่าวสาร";
    case "activity":
      return "กิจกรรม";
    case "training":
      return "อบรม";
    default:
      return props.data.status;
  }
});

function handleCardClick() {
  const param = props.data.uuid || String(props.data.id);
  router.push(`/new_and_announce/${param}`);
}

function onImageError(e: Event) {
  (e.target as HTMLImageElement).src = "/assets/images/test-image.png";
}
</script>

<template>
  <div class="card-container" @click="handleCardClick">
    <!-- Image Section -->
    <div class="card-image-section">
      <img
        :src="data.coverImageFile?.url || '/assets/images/test-image.png'"
        :alt="data.coverImageFile?.fileName || 'announcement cover image'"
        class="card-image"
        @error="onImageError"
      />
      <!-- Status Badge -->
      <div
        v-if="data.isNew"
        class="status-badge"
        :class="[statusClass]"
      >
        {{ statusLabel }}
      </div>
    </div>

    <!-- Content Section -->
    <div class="card-content">
      <h3 class="card-title">
        {{ data.title }}
      </h3>
      <p class="card-subtitle">
        {{ data.description }}
      </p>
      <div class="card-date" v-if="data.publishDateStart && data.publishDateEnd">
        <svg class="date-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"
            clip-rule="evenodd"
          />
        </svg>
        <span>
          {{ mapPublishRange(data.publishDateStart, data.publishDateEnd) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-container:hover .card-image {
  transform: scale(1.05);
}

.status-badge {
  background-color: #c40c0c;

  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2em;
}

.card-subtitle {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.card-date {
  background-color: #f8f2ff;
  border-radius: 8px;
  width: fit-content;
  height: 24px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #65004a;
  margin-top: auto;
}

.date-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-content {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-subtitle {
    font-size: 13px;
  }

  .card-image-section {
    height: 160px;
  }
}
</style>
