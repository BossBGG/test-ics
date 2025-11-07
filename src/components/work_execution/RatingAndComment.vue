<!-- src/components/work_execution/RatingAndComment.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  rating?: number
  comment?: string
  maxWords?: number
}

const props = withDefaults(defineProps<Props>(), {
  rating: 0,
  comment: '',
  maxWords: 250
})

const emit = defineEmits<{
  'rating-change': [rating: number]
  'comment-change': [comment: string]
}>()

const currentRating = ref(props.rating)
const currentComment = ref(props.comment)

// Watch for prop changes
watch(() => props.rating, (newValue) => {
  currentRating.value = newValue
})

watch(() => props.comment, (newValue) => {
  currentComment.value = newValue
})

// Computed
const wordLimit = computed(() => props.maxWords)

const getRatingText = (rating: number) => {
  switch (rating) {
    case 1:
      return "ไม่พอใจมาก"
    case 2:
      return "ไม่พอใจ"
    case 3:
      return "ปานกลาง"
    case 4:
      return "พอใจ"
    case 5:
      return "พอใจมาก"
    default:
      return ""
  }
}

const currentWordCount = computed(() => {
  return currentComment.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const isNearLimit = computed(() =>
  currentWordCount.value > wordLimit.value - 10
)

// Methods
const handleRatingChange = (rating: number) => {
  currentRating.value = rating
  emit('rating-change', rating)
}

const handleCommentChange = (value: string) => {
  const words = value.trim().split(/\s+/).filter(word => word.length > 0)

  // จำกัดจำนวนคำ
  if (words.length <= wordLimit.value) {
    currentComment.value = value
    emit('comment-change', value)
  } else {
    // ถ้าเกินจำนวนคำที่กำหนด ให้ตัดเอาเฉพาะคำที่อยู่ในขีดจำกัด
    const limitedWords = words.slice(0, wordLimit.value)
    const limitedComment = limitedWords.join(' ')
    currentComment.value = limitedComment
    emit('comment-change', limitedComment)
  }
}
</script>

<template>
  <div class="rating-comment-container">
    <!-- Rating Section -->
    <div class="rating-section">
      <label class="rating-label">
        คะแนนรวมความพอใจ 5/5
      </label>

      <div class="rating-stars">
        <div class="stars-wrapper">
          <button
            v-for="star in 5"
            :key="star"
            @click="handleRatingChange(star)"
            :class="[
              'star-button',
              {
                'star-active': star <= currentRating,
                'star-inactive': star > currentRating
              }
            ]"
          >
            <q-icon name="star" />
          </button>
        </div>
        <span class="rating-text">
          {{ currentRating }}/5
          <span v-if="currentRating > 0" class="rating-description">
            {{ getRatingText(currentRating) }}
          </span>
        </span>
      </div>
    </div>

    <!-- Comment Section -->
    <div class="comment-section">
      <div class="comment-header">
        <label class="comment-label">
          ความคิดเห็นเพิ่มเติมจากลูกค้า :
        </label>
        <span
          :class="[
            'word-count',
            { 'text-warning': isNearLimit }
          ]"
        >

        </span>
      </div>

      <div class="comment-input-wrapper">
        <q-input
          :model-value="currentComment"
          type="textarea"
          outlined
          placeholder="ระบุข้อคิดเห็น"
          class="comment-textarea"
          :rows="6"
          @update:model-value="handleCommentChange"
        />
      </div>

      <!-- Warning message when approaching word limit -->
      <div v-if="isNearLimit" class="limit-warning">
        <span class="warning-text">
          เหลืออีก {{ wordLimit - currentWordCount }} คำ
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rating-comment-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Rating Section */
.rating-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars-wrapper {
  display: flex;
  gap: 4px;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.2s ease;
  color: #d1d5db;
  padding: 4px;
}

.star-button:hover {
  transform: scale(1.1);
}

.star-active {
  color: #fbbf24 !important;
}

.star-active:hover {
  color: #f59e0b !important;
}

.star-inactive:hover {
  color: #9ca3af !important;
}

.rating-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.rating-description {
  color: #6b7280;
  font-weight: normal;
}

/* Comment Section */
.comment-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.word-count {
  font-size: 12px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.text-warning {
  color: #dc2626 !important;
}

.comment-input-wrapper {
  width: 100%;
}

.comment-textarea {
  width: 100%;
}

.limit-warning {
  margin-top: 4px;
}

.warning-text {
  font-size: 12px;
  color: #dc2626;
}

/* Quasar Input Overrides */
:deep(.comment-textarea .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
  min-height: 120px;
}

:deep(.comment-textarea .q-field--outlined .q-field__control:hover) {
  border-color: #69306D;
}

:deep(.comment-textarea .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306D;
  box-shadow: 0 0 0 3px rgba(105, 48, 109, 0.1);
}

:deep(.comment-textarea .q-field__inner) {
  padding: 12px 16px;
}

:deep(.comment-textarea .q-field__control-container) {
  padding-top: 0;
}

:deep(.comment-textarea .q-field__native) {
  font-size: 14px;
  line-height: 1.5;
  min-height: 100px;
  resize: vertical;
}

:deep(.comment-textarea .q-field__native::placeholder) {
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 768px) {
  .rating-comment-container {
    gap: 20px;
  }

  .star-button {
    font-size: 20px;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  :deep(.comment-textarea .q-field__native) {
    min-height: 80px;
  }
}

@media (max-width: 480px) {
  .stars-wrapper {
    gap: 2px;
  }

  .star-button {
    font-size: 18px;
    padding: 2px;
  }

  .rating-text {
    font-size: 13px;
  }
}
</style>
