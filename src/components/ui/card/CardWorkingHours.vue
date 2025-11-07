<script setup lang="ts">
interface Props {
  title: string;
  hours: number;
  icon?: string;
  backgroundColor?: string;
}

const props = defineProps<Props>();

const iconColor = computed(() => {
  switch (props.title) {
    case "พนักงาน PEA":
      return "text-purple-600";
    case "ผู้รับจ้าง":
      return "text-yellow-500";
    case "ชั่วโมง":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
});

const cardBorderColor = computed(() => {
  switch (props.title) {
    case "พนักงาน PEA":
      return "border-purple-200";
    case "ผู้รับจ้าง":
      return "border-yellow-200";
    case "ชั่วโมง":
      return "border-blue-200";
    default:
      return "border-gray-200";
  }
});

const cardBackgroundStyle = computed(() => {
  return props.backgroundColor
    ? { backgroundColor: props.backgroundColor }
    : {};
});
</script>

<template>
  <div
    class="working-hours-card"
    :class="cardBorderColor"
    :style="cardBackgroundStyle"
  >
    <div class="working-hours-card-content">
      <div class="working-hours-card-header">
        <div class="working-hours-icon-container">
          <img
            v-if="icon && icon.includes('.')"
            :src="icon"
            :alt="title"
            class="working-hours-icon-image"
          />
          <div v-else class="working-hours-icon-placeholder" :class="iconColor">
            <img
              v-if="title === 'พนักงาน PEA'"
              src="/assets/images/pea-em.png"
              alt=""
            />
            <img
              v-if="title === 'ผู้รับจ้าง'"
              src="/assets/images/pea-con.png"
              alt=""
            />
          </div>
        </div>

        <div class="working-hours-title-container justify-between">
          <div class="working-hours-card-title">{{ title }}</div>
          <div class="working-hours-card-subtitle">(ทั้งหมด)</div>
        </div>
        <div class="hours-container">
          <span class="hours-value">{{ hours.toLocaleString() }}</span>
          <span class="hours-unit">ชั่วโมง</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.working-hours-card {
  background: white;

  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  height: 100px;
}

.working-hours-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.working-hours-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  justify-content: center;
}

.working-hours-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.working-hours-icon-container {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.working-hours-icon-image {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.working-hours-icon-placeholder {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.working-hours-title-container {
  flex: 1;
}

.working-hours-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  line-height: 1.2;
  margin-bottom: 2px;
}

.working-hours-card-subtitle {
  font-size: 12px;
  color: #6b7280;
  line-height: 1;
}

.hours-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 8px;
}

.hours-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.hours-unit {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .working-hours-card {
    padding: 12px;
    height: 80px;
  }

  .working-hours-card-header {
    gap: 8px;
  }

  .working-hours-icon-container {
    width: 28px;
    height: 28px;
  }

  .working-hours-icon-image,
  .working-hours-icon-placeholder {
    width: 16px;
    height: 16px;
  }

  .working-hours-card-title {
    font-size: 12px;
  }

  .working-hours-card-subtitle {
    font-size: 10px;
  }

  .hours-value {
    font-size: 20px;
  }

  .hours-unit {
    font-size: 12px;
  }
}
</style>
