<!-- src/components/card/CardCollapse.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  icon?: string
  isShowHeader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isShowHeader: true
})

const expanded = ref(true)

const toggleExpanded = () => {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="card-collapse">
    <!-- Header -->
    <div v-if="isShowHeader" class="card-header" @click="toggleExpanded">
      <div class="header-content">
        <!-- Icon -->
        <div v-if="icon" class="header-icon">
          <img v-if="icon.includes('.')" :src="icon" :alt="title" class="icon-image" />
          <component v-else :is="icon" class="icon-component" />
        </div>
        
        <!-- Title -->
        <h3 class="header-title">{{ title }}</h3>
      </div>
      
      <!-- Chevron Icon -->
      <div class="chevron-icon">
        <svg 
          :class="{ 'rotate-180': !expanded }"
          class="chevron-svg"
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div v-if="expanded" class="card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card-collapse {
  background: #F5F7F8;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0px 4px 4px 0px rgba(166, 175, 195, 0.4);
  overflow: hidden;
}

.card-header {
  background-color: #69306D;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.card-header:hover {
  background-color: #69306D;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-component {
  width: 24px;
  height: 24px;
  color: #69306D;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #69306D;
}

.chevron-svg {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.card-content {
  padding: 12px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header {
    padding: 12px 16px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .card-content {
    padding: 8px;
  }
}
</style>