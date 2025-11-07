<!-- src/components/work_order/WorkOrderStep.vue -->

<script setup lang="ts">
interface Step {
  name: string;
  icon: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:step": [step: number];
}>();

const updateStep = (step: number) => {
  emit("update:step", step);
};
</script>

<template>
  <div class="work-order-step">
    <div class="step-container">
      <div class="steps-wrapper">
        <template v-for="(step, index) in steps" :key="index">
          <!-- Step -->
          <div class="step-item" @click="updateStep(index)">
            <div class="step-content">
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
                <component v-else :is="step.icon" class="icon-component" />
              </div>
              <div class="step-name">{{ step.name }}</div>
            </div>
          </div>

          <!-- Progress Line (แทรกระหว่าง Step) -->
          <div v-if="index < steps.length - 1" class="progress-line">
            <div class="line-inner" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-order-step {
  background: #f2f2f2;
  border-radius: 20px;
  margin-bottom: 16px;
  box-shadow: 0px 4px 4px 0px rgba(166, 175, 195, 0.4);
  padding: 24px 16px;
}

.step-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.steps-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  position: relative;
}

.step-item:not(:last-child) {
  flex: 1;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #aaaaaa;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-icon.is-active {
  background: #6f2075 !important;
  color: white !important;
  
}


.icon-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.icon-component {
  width: 24px;
  height: 24px;
  color: inherit;
  transition: color 0.3s ease;
}

.step-name {
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.progress-line {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 100%; 
  margin: 0 44px;
  position: relative;
}

.line-inner {
  width: 100%;
  height: 3px;
  background: #aaaaaa !important;
  border: none;
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .work-order-step {
    padding: 20px 12px;
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

  .progress-line {
    margin: 0 10px;
    min-width: 30px;
    height: 40px;
  }

  .line-inner {
    height: 2px;
    top: 20px;
  }
}

@media (max-width: 480px) {
  .step-name {
    font-size: 10px;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step-icon {
    width: 36px;
    height: 36px;
  }

  .icon-image,
  .icon-component {
    width: 18px;
    height: 18px;
  }

  .progress-line {
    margin: 0 8px;
    height: 36px;
    min-width: 20px;
  }

  .line-inner {
    height: 2px;
    top: 18px;
  }
}
</style>
