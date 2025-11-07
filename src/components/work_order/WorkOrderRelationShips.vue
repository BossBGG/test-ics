<template>
  <Teleport to="body">
    <Transition name="wor-fade">
      <div v-if="isOpen" class="wor-overlay" @click="closePanel"></div>
    </Transition>

    <Transition name="wor-slide">
      <div v-if="isOpen" class="wor-sidebar">
        <!-- Header -->
        <div class="wor-header">
          <div class="wor-header-content">
            <img src="/assets/images/link.png" alt="" class="wor-header-icon" />
            <h2 class="wor-header-title">แสดงความสัมพันธ์ใบสั่งงาน</h2>
          </div>
          <button class="wor-close-btn" @click="closePanel">
            <svg
              class="wor-close-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="wor-content">
          <div v-if="relationships.length === 0" class="wor-empty-state">
            <img src="/assets/images/link.png" alt="" class="wor-empty-icon" />
            <h3 class="wor-empty-title">ไม่พบความสัมพันธ์ใบสั่งงาน</h3>
            <p class="wor-empty-description">
              ยังไม่มีใบสั่งงานที่เกี่ยวข้องในขณะนี้
            </p>
          </div>

          <div v-else class="wor-list">
            <div
              v-for="parent in relationships"
              :key="parent.id"
              class="wor-parent-container"
            >
              <!-- Parent Item -->
              <div class="wor-parent-item">
                <div class="wor-parent-header">
                  <div class="wor-parent-icon-black">
                    <img
                      src="/assets/images/contract.png"
                      alt=""
                      class="wor-icon-white mr-1"
                    />
                  </div>
                  <div class="wor-parent-info">
                    <div class="flex flex-row">
                      <div class="flex-1 flex-col justify-center">
                        <div class="wor-parent-title">
                          {{ parent.orderNumber }}
                        </div>
                        <div class="wor-parent-subtitle">
                          {{ parent.workOrderType }}
                        </div>
                      </div>
                      <button class="wor-doc-icon-purple">
                        <img
                          src="/assets/images/doc.png"
                          alt=""
                          class="wor-icon-doc-white"
                        />
                      </button>
                    </div>
                    <div class="wor-parent-details">
                      <div class="wor-detail-item">
                        <span class="wor-label">เลขที่คำร้อง :</span>
                        <span class="wor-value">{{
                          parent.requestNumber
                        }}</span>
                      </div>
                      <div class="wor-detail-item">
                        <span class="wor-label">ชื่อลูกค้า :</span>
                        <span class="wor-value">{{ parent.customerName }}</span>
                      </div>
                      <div class="wor-detail-item">
                        <span class="wor-label">วันที่สร้างใบสั่งงาน :</span>
                        <span class="wor-value">{{ parent.date }}</span>
                      </div>
                      <div class="wor-detail-item">
                        <span class="wor-label">รายละเอียด :</span>
                        <span class="wor-value">
                          {{ parent.details }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Children with vertical line -->
              <div
                v-if="parent.hasChildren && parent.children"
                class="wor-children-container"
              >
                <div class="wor-vertical-line-main"></div>

                <div
                  v-for="(child1, index) in parent.children"
                  :key="child1.id"
                  class="wor-child1-wrapper"
                >
                  <!-- Child Level 1 -->
                  <div class="wor-child1-item">
                    <div class="wor-child1-header">
                      <div class="wor-child1-icon">
                        <img
                          src="/assets/images/contract.png"
                          alt=""
                          class="wor-icon-white mr-1"
                        />
                      </div>
                      <div class="wor-child1-info">
                        <div class="flex flex-row">
                          <div
                            class="wor-child1-title-col flex-1 flex-col justify-center"
                          >
                            <div class="wor-child1-title">
                              {{ child1.orderNumber }}
                            </div>
                            <div class="wor-child1-subtitle">
                              {{ child1.workOrderType }}
                            </div>
                          </div>
                          <div class="flex flex-row gap-2">
                            <button class="wor-doc-icon-purple">
                              <img
                                src="/assets/images/doc.png"
                                alt=""
                                class="wor-icon-doc-white"
                              />
                            </button>
                            <button
                              v-if="child1.hasChildren"
                              class="wor-expand-btn mb-2"
                              @click="toggleExpand(child1.id)"
                            >
                              <svg
                                class="wor-expand-icon"
                                :class="{
                                  'wor-rotated': expandedItems.has(child1.id),
                                }"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div class="wor-child1-details">
                          <div class="wor-detail-item">
                            <span class="wor-label"
                              >วันที่สร้างใบสั่งงาน :</span
                            >
                            <span class="wor-value">{{ child1.date }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Child Level 2 -->
                  <Transition name="wor-expand">
                    <div
                      v-if="
                        child1.hasChildren &&
                        expandedItems.has(child1.id) &&
                        child1.children
                      "
                      class="wor-child2-container"
                    >
                      <div class="wor-vertical-line-child2"></div>

                      <div
                        v-for="child2 in child1.children"
                        :key="child2.id"
                        class="wor-child2-item"
                      >
                        <div class="wor-child2-icon">
                          <img
                            src="/assets/images/contract.png"
                            alt=""
                            class="wor-icon-dark mr-1"
                          />
                        </div>
                        <div class="wor-child2-info">
                          <div class="flex flex-row justify-between">
                            <div class="wor-child2-title">
                              {{ child2.orderNumber }}
                            </div>
                            <button class="wor-doc-icon-purple-small">
                              <img
                                src="/assets/images/doc.png"
                                alt=""
                                class="wor-icon-doc-white"
                              />
                            </button>
                          </div>
                          <div class="wor-detail-item">
                            <span class="wor-label"
                              >วันที่สร้างใบสั่งงาน :</span
                            >
                            <span class="wor-value">{{ child2.date }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  mockWorkOrderRelationships,
  getStatusColorClass,
  type WorkOrderRelationship,
} from "~/data/workOrderRelationships";
import "~/styles/work-order-relationships.css";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const relationships = ref<WorkOrderRelationship[]>(mockWorkOrderRelationships);
const expandedItems = ref<Set<number>>(new Set());

const closePanel = () => {
  isOpen.value = false;
};

const toggleExpand = (itemId: number) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};
</script>

<style scoped>
.wor-fade-enter-active,
.wor-fade-leave-active {
  transition: opacity 0.3s ease;
}

.wor-fade-enter-from,
.wor-fade-leave-to {
  opacity: 0;
}

.wor-slide-enter-active,
.wor-slide-leave-active {
  transition: transform 0.3s ease;
}

.wor-slide-enter-from,
.wor-slide-leave-to {
  transform: translateX(100%);
}

.wor-expand-enter-active,
.wor-expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.wor-expand-enter-from,
.wor-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.wor-expand-enter-to {
  opacity: 1;
  max-height: 800px;
}
</style>
