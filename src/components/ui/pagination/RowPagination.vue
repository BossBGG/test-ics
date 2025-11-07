<!-- src/components/ui/pagination/RowPagination.vue -->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage?: number
  totalPages?: number  
  totalItems?: number
  itemsPerPage?: number
  showFirstLast?: boolean
}

interface Emits {
  (e: 'update:currentPage', page: number): void
  (e: 'update:itemsPerPage', items: number): void
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 5,
  showFirstLast: true
})

const emit = defineEmits<Emits>()

// Options for items per page
const itemsPerPageOptions = [5, 10, 25, 50, 100]

// Computed properties
const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const calculated = props.currentPage * props.itemsPerPage
  return Math.min(calculated, props.totalItems)
})

const displayText = computed(() => {
  if (props.totalItems === 0) {
    return 'ไม่มีข้อมูล'
  }
  return `${startItem.value}-${endItem.value} of ${props.totalItems}`
})

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

// Event handlers
const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const goToFirstPage = () => goToPage(1)
const goToPreviousPage = () => goToPage(props.currentPage - 1)
const goToNextPage = () => goToPage(props.currentPage + 1)
const goToLastPage = () => goToPage(props.totalPages)

const updateItemsPerPage = (value: number) => {
  emit('update:itemsPerPage', value)
  // Reset to first page when changing items per page
  emit('update:currentPage', 1)
}
</script>

<template>
  <div class="row-pagination">
    <!-- Items per page selector -->
    <div class="items-per-page">
      <label class="items-per-page-label">แถวต่อหน้า:</label>
      <q-select
        :model-value="itemsPerPage"
        :options="itemsPerPageOptions"
        outlined
        dense
        class="items-per-page-select"
        @update:model-value="updateItemsPerPage"
      />
    </div>

    <!-- Page info display -->
    <div class="page-info">
      {{ displayText }}
    </div>

    <!-- Navigation buttons -->
    <div class="navigation-buttons">
      <!-- First page button -->
      <button
        v-if="showFirstLast"
        class="nav-btn"
        :class="{ 'nav-btn-disabled': !canGoPrevious }"
        :disabled="!canGoPrevious"
        @click="goToFirstPage"
        title="หน้าแรก"
      >
        <q-icon name="first_page" />
      </button>

      <!-- Previous page button -->
      <button
        class="nav-btn"
        :class="{ 'nav-btn-disabled': !canGoPrevious }"
        :disabled="!canGoPrevious"
        @click="goToPreviousPage"
        title="หน้าก่อนหน้า"
      >
        <q-icon name="chevron_left" />
      </button>

      <!-- Next page button -->
      <button
        class="nav-btn"
        :class="{ 'nav-btn-disabled': !canGoNext }"
        :disabled="!canGoNext"
        @click="goToNextPage"
        title="หน้าถัดไป"
      >
        <q-icon name="chevron_right" />
      </button>

      <!-- Last page button -->
      <button
        v-if="showFirstLast"
        class="nav-btn"
        :class="{ 'nav-btn-disabled': !canGoNext }"
        :disabled="!canGoNext"
        @click="goToLastPage"
        title="หน้าสุดท้าย"
      >
        <q-icon name="last_page" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.row-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0;
  
  margin-top: 8px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-per-page-label {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.items-per-page-select {
  width: 80px;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  min-width: 120px;
  text-align: center;
}

.navigation-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.nav-btn:hover:not(.nav-btn-disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.nav-btn:active:not(.nav-btn-disabled) {
  background: #e5e7eb;
}

.nav-btn-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  color: #d1d5db;
}

.nav-btn-disabled:hover {
  background: white;
  border-color: #d1d5db;
}

/* Quasar Select Overrides */
:deep(.items-per-page-select .q-field--outlined .q-field__control) {
  border-radius: 4px;
  border-color: #d1d5db;
  min-height: 32px;
  font-size: 14px;
}

:deep(.items-per-page-select .q-field__inner) {
  padding: 4px 8px;
}

:deep(.items-per-page-select .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306d;
  box-shadow: 0 0 0 1px rgba(105, 48, 109, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .row-pagination {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .items-per-page,
  .page-info,
  .navigation-buttons {
    justify-content: center;
  }

  .page-info {
    text-align: center;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .row-pagination {
    gap: 8px;
    padding: 8px 0;
  }

  .items-per-page-label {
    font-size: 12px;
  }

  .page-info {
    font-size: 12px;
  }

  .nav-btn {
    width: 28px;
    height: 28px;
  }

  .items-per-page-select {
    width: 70px;
  }
}
</style>