<script setup lang="ts">
import SemiCircularGauge from '~/components/ui/graph/SemiCircularGauge.vue'

interface Props {
  total: number;
  completed: number;
}

const props = defineProps<Props>()



const legendItems = [
  {
    label: 'ใบสั่งงานทั้งหมด',
    color: '#c8a2c8' 
  },
  {
    label: 'ดำเนินงานเสร็จสิ้น', 
    color: '#69306d' 
  }
]
</script>

<template>
  <div class="total-work-report-card">
    <div class="gauge-container">
      <SemiCircularGauge 
        :total="total"
        :completed="completed"
      />
    </div>
    
    <div class="legend-container">
      <div 
        v-for="item in legendItems" 
        :key="item.label"
        class="legend-item"
      >
        <div 
          class="legend-dot" 
          :style="{ backgroundColor: item.color }"
        ></div>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.total-work-report-card {
  background: white;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.total-work-report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.gauge-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

}

.legend-container {
  display: flex;
  flex-direction: column;
  gap: px;
  align-items: flex-start;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 14px;
  color: #374151;
  font-weight: 400;
}

/* Responsive Design */
@media (max-width: 768px) {
  .total-work-report-card {
    padding: 16px;
    height: 180px;
  }
  
  .legend-label {
    font-size: 12px;
  }
  
  .legend-dot {
    width: 10px;
    height: 10px;
  }
}
</style>