<!-- src/components/work_order/WorkOrderStep.vue -->

<script setup lang="ts">

interface Step {
  name: string
  icon: string
}

interface Props {
  steps: Step[]
  currentStep: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:step': [step: number]
}>()

const updateStep = (step: number) => {
  emit('update:step', step)
}
</script>

<template>
  <div class="work-order-step">
    <div class="step-container">
      <div class="steps-wrapper">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ 'is-last': index === steps.length - 1 }"
          @click="updateStep(index)"
        >
          <label 
            :for="`work_order_step_${index}`"
            class="step-label"
          >
            <div 
              class="step-icon"
              :class="{ 'is-active': currentStep === index }"
            >
              <img 
                v-if="step.icon.includes('.')"
                :src="step.icon" 
                :alt="step.name"
                class="icon-image"
              />
              <component 
                v-else 
                :is="step.icon" 
                class="icon-component"
              />
            </div>
            <div class="step-name">{{ step.name }}</div>
          </label>

          <!-- Progress Line -->
          <div 
            v-if="index < steps.length - 1" 
            class="progress-line"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-order-step {
  background: #F2F2F2;
  border-radius: 20px;
  margin-bottom: 16px;
  box-shadow: 0px 4px 4px 0px rgba(166, 175, 195, 0.4);
  padding: 16px 8px;
}

.step-container {
  display: flex;
  justify-content: center;
}

.steps-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
}

.step-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.step-item.is-last {
  flex: 0 0 auto;
}

.step-label {
  display: flex;
  align-items: center;
  margin: 0 12px;
  cursor: pointer;
  gap: 8px;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #AAAAAA;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-icon.is-active {
  background: #69306D;
  color: white;
}

.icon-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.icon-component {
  width: 24px;
  height: 24px;
  color: inherit;
}

.step-name {
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.progress-line {
  height: 6px;
  background: #D4D6DD;
  flex: 1;
  margin: 0 8px;
  border-radius: 3px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .steps-wrapper {
    width: 95%;
  }
  
  .step-icon {
    width: 40px;
    height: 40px;
  }
  
  .icon-image,
  .icon-component {
    width: 20px;
    height: 20px;
  }
  
  .step-name {
    font-size: 12px;
  }
  
  .step-label {
    margin: 0 8px;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .step-name {
    display: none;
  }
  
  .step-label {
    margin: 0 4px;
  }
}
</style>