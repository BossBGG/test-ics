<!-- src/pages/new_and_announce/list.vue -->
<template>
  <content-container
    :breadcrumbs="[{ text: 'หน้าหลัก' }, { text: 'ข่าวและประกาศ' }]"
    :last_update="'2025-02-14 09:30:00'"
  >
    

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <!-- Search Bar -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาข่าวและประกาศ..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Filter Button -->
      <button
        @click="showFilterDialog = true"
        class="filter-button"
      >
        <svg class="filter-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
        </svg>
    
      </button>
    </div>

    <!-- Cards Grid -->
    <div class="cards-container">
      <div v-if="filteredData.length === 0" class="no-data">
        <div class="no-data-content">
          <svg class="no-data-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>ไม่พบข้อมูล</h3>
          <p>ไม่พบข่าวและประกาศที่ตรงกับการค้นหา</p>
        </div>
      </div>

      <div v-else class="cards-grid">
        <Card
          v-for="item in filteredData"
          :key="item.id"
          :data="item"
        />
      </div>
    </div>

    <!-- Filter Dialog -->
    <NewsAnnounceFilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleApplyFilters"
    />
  </content-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ContentContainer from "~/layouts/ContentContainer.vue"
import Card from "~/components/ui/card/Card.vue"
import NewsAnnounceFilterDialog from "~/components/dialog/NewsAnnounceFilterDialog.vue"
import { mockNewAndAnnounceData, type NewAndAnnounceData } from "~/data/newAndAnnounceData"

// Reactive data
const searchQuery = ref('')
const showFilterDialog = ref(false)
const currentFilters = ref({
  startDate: '',
  endDate: '',
  status: '',
})

// Computed filtered data
const filteredData = computed(() => {
  let data = [...mockNewAndAnnounceData]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    data = data.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    )
  }

  // Filter by status
  if (currentFilters.value.status) {
    data = data.filter(item => item.status === currentFilters.value.status)
  }

  // Add date filtering logic here if needed
  // if (currentFilters.value.startDate && currentFilters.value.endDate) {
  //   // Implement date range filtering
  // }

  return data
})

</script>

<style scoped>
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #C99530;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.search-filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
}

.search-container {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  max-width: full;
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
  border-color: #69306D;
  box-shadow: 0 0 0 3px rgba(105, 48, 109, 0.1);
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #69306D;
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