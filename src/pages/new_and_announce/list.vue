<!-- src/pages/new_and_announce/list.vue -->
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { AxiosRequestConfig } from "axios";
import { debounce } from "lodash";
import ContentContainer from "~/layouts/ContentContainer.vue";
import Card from "~/components/ui/card/Card.vue";
import NewsAnnounceFilterDialog from "~/components/dialog/NewsAnnounceFilterDialog.vue";
import { dismissPopup, showError, showProgress } from "~/composables/alert";
import { getAnnouncement } from "~/api/news_api";
import type {
  AnnouncementFilter,
  NewsData,
  NewsDataFilter,
} from "~/data/newsData";
import {dateFormatBy, getCurrentDateTimeYmd, toTimestamp} from "~/composables/datetime";

const search = ref("");
const showFilterDialog = ref(false);
const filters = ref<NewsDataFilter>({
  from: "",
  to: "",
  status: "",
});

// State
const items = ref<NewsData[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
const limit = ref(12);
const debounceData = debounce(() => fetchAnnouncements(), 500);
const update_latest_at = ref<string>(getCurrentDateTimeYmd())
watch(
  () => search.value,
  () => {
    debounceData();
  },
);

watch(
  () => filters.value,
  () => {
    fetchAnnouncements();
  },
  { deep: true },
);
async function fetchAnnouncements() {
  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: search.value || "",
      ...filters.value,
      status: 1,
      isActive: true,
    } as AxiosRequestConfig<AnnouncementFilter>;

    showProgress();
    await getAnnouncement(params).then((res) => {
      if (res.data.success) {
        const responseData = res.data.data as any;
        items.value = responseData?.items || [];
        totalItems.value = responseData?.meta.totalCount || 0;
        update_latest_at.value = getCurrentDateTimeYmd()
        dismissPopup();
      } else {
        showError(res.data.message || "");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  fetchAnnouncements();
}

function handleApplyFilters(filter: NewsDataFilter) {
  filters.value = filter;
  if (filters.value.from) {
    filters.value.from = dateFormatBy(
      toTimestamp(filters.value.from),
      "YYYY-MM-DD",
    );
  }
  if (filters.value.to) {
    filters.value.to = dateFormatBy(
      toTimestamp(filters.value.to),
      "YYYY-MM-DD",
    );
  }
  showFilterDialog.value = false;
}

onMounted(fetchAnnouncements);
</script>

<template>
  <ContentContainer
    :breadcrumbs="[{ text: 'หน้าหลัก' }, { text: 'ข่าวและประกาศ' }]"
    :last_update="update_latest_at"
  >
    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <!-- Search Bar -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="ค้นหาข่าวและประกาศ..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Filter Button -->
      <button
        class="filter-button flex items-center justify-center border border-gray-300 rounded-md bg-white px-3 py-2 transition-colors hover:bg-gray-50"
        style="width: 55px; height: 55px"
        title="ตัวกรอง"
        type="button"
        @click="showFilterDialog = true"
      >
        <q-icon name="filter_alt" size="md" style="color: #65004a" />
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="cards-container">
      <div v-if="items.length === 0" class="no-data">
        <div class="no-data-content">
          <svg
            class="no-data-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <h3>ไม่พบข้อมูล</h3>
          <p>ไม่พบข่าวและประกาศที่ตรงกับการค้นหา</p>
        </div>
      </div>

      <div v-else class="cards-grid">
        <Card v-for="item in items" :key="item.id" :data="item" />
      </div>

      <div class="pagination-wrapper" v-if="items.length > 0">
        <ListPagination
          :current-page="currentPage"
          :total-items="totalItems"
          @update:page="handlePageChange"
          :items-per-page="limit"
        />
      </div>
    </div>

    <!-- Filter Dialog -->
    <NewsAnnounceFilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleApplyFilters"
    />
  </ContentContainer>
</template>

<style scoped>
.search-filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
  .filter-button {
    height: 55px;
    min-width: 55px;
    cursor: pointer;
    background-color: #f1dceb !important;
  }
}

.search-container {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #69306d;
  box-shadow: 0 0 0 3px rgba(105, 48, 109, 0.1);
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #69306d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-button:hover {
  background: #5a285d;
  transform: translateY(-1px);
}

.filter-icon {
  width: 20px;
  height: 20px;
}

.cards-container {
  min-height: 400px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  padding: 8px 0;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.no-data-content {
  text-align: center;
  color: #6b7280;
}

.no-data-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.5;
}

.no-data h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #374151;
}

.no-data p {
  font-size: 16px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
    gap: 12px;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  .filter-button {
    width: 100%;
    justify-content: center;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .page-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    font-size: 14px;
  }

  .filter-button {
    font-size: 14px;
    padding: 10px 16px;
  }
}
</style>
