<!-- src/components/work_execution/Comment.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'

interface Props {
  modelValue?: string
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxLength: 250
})

const comment = ref(props.modelValue)

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  comment.value = newValue
})

// Computed
const currentLength = computed(() => comment.value.length)

const characterLimit = computed(() => props.maxLength)

const isNearLimit = computed(() =>
  currentLength.value > characterLimit.value - 20
)

const handleChange = (value: string) => {
  // Limit character count
  if (value.length <= characterLimit.value) {
    comment.value = value
  }
}
</script>

<template>
  <CardCollapse title="หมายเหตุเพิ่มเติม" icon="/assets/images/doc.png">
    <div class="comment-container">
      <div class="comment-form">
        <label class="comment-label">
          หมายเหตุเพิ่มเติม
        </label>

        <div class="textarea-container">
          <q-input
            :model-value="comment"
            type="textarea"
            outlined
            placeholder="กรอกหมายเหตุเพิ่มเติม"
            class="comment-textarea"
            :maxlength="characterLimit"
            :rows="4"
            @update:model-value="handleChange"
          />
        </div>

        <div class="character-count">
          <span
            :class="[
              'count-text',
              { 'text-warning': isNearLimit }
            ]"
          >
            {{ currentLength }}/{{ characterLimit }}
          </span>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.comment-container {
  padding: 8px 0;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.textarea-container {
  position: relative;
}

.comment-textarea {
  width: 100%;
}

.character-count {
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
}

.count-text {
  font-size: 12px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.text-warning {
  color: #dc2626 !important;
}

/* Quasar Input Overrides */
:deep(.comment-textarea .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  background-color: white;
  min-height: 100px;
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
  min-height: 80px;
  resize: vertical;
}

:deep(.comment-textarea .q-field__native::placeholder) {
  color: #9ca3af;
}

/* Focus states */
:deep(.comment-textarea .q-field--outlined.q-field--focused .q-field__control::before) {
  border-color: #69306D;
}

:deep(.comment-textarea .q-field--outlined.q-field--focused .q-field__control::after) {
  transform: scale3d(1, 1, 1);
}

/* Error state for character limit */
:deep(.comment-textarea.text-warning .q-field--outlined .q-field__control) {
  border-color: #dc2626;
}

:deep(.comment-textarea.text-warning .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .comment-container {
    padding: 6px 0;
  }

  .comment-form {
    gap: 10px;
  }

  .comment-label {
    font-size: 13px;
  }

  :deep(.comment-textarea .q-field__inner) {
    padding: 10px 14px;
  }

  :deep(.comment-textarea .q-field__native) {
    font-size: 13px;
    min-height: 70px;
  }

  .count-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  :deep(.comment-textarea .q-field__native) {
    min-height: 60px;
  }

  .character-count {
    margin-top: -6px;
  }
}
</style>
