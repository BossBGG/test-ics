<script setup lang="ts">
interface Props {
  title: string;
  count: number;
  icon?: string;
  unit: string;
  backgroundColor?: string;
}

const props = defineProps<Props>()

const cardBackgroundStyle = computed(() => {
  if (props.backgroundColor) {
    return { background: props.backgroundColor }
  }
  return { background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }
})
</script>

<template>
  <div class="work-report-card" :style="cardBackgroundStyle">
    <div class="work-report-card-content">
      <div class="work-report-card-info">
        <div class="work-report-card-title">
          {{ title }}
        </div>
        <div class="work-report-card-count">
          {{ count }} 
          <span class="work-report-card-unit">/ {{ unit }}</span>
        </div>
      </div>
      <div class="work-report-card-icon">
        <img v-if="icon && icon.includes('.')" :src="icon" :alt="title" class="work-report-icon-image">
        <div v-else class="work-report-icon-placeholder">
          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-report-card {
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 140px;
  display: flex;
  align-items: center;
}

.work-report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.work-report-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.work-report-card-info {
  flex: 1;
}

.work-report-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  line-height: 1.3;
}

.work-report-card-count {
  font-size: 32px;
  font-weight: 700;
  color: black;
  line-height: 1;
}

.work-report-card-unit {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin-left: 4px;
}

.work-report-card-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.work-report-icon-image {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.work-report-icon-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .work-report-card {
    padding: 16px;
    height: 120px;
  }
  
  .work-report-card-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .work-report-card-count {
    font-size: 24px;
  }
  
  .work-report-card-unit {
    font-size: 14px;
  }
  
  .work-report-card-icon {
    width: 50px;
    height: 50px;
  }
  
  .work-report-icon-image {
    width: 32px;
    height: 32px;
  }
}
</style>