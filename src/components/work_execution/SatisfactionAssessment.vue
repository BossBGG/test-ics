<!-- src/components/work_execution/SatisfactionAssessment.vue -->
<script setup lang="ts">
import { reactive } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import RatingAndComment from './RatingAndComment.vue'
import SignatureSection from './SignatureSection.vue'
import {WorkOrderObj} from "~/api/types.js";

interface SatisfactionData {
  rating: number
  comment: string
  signature: string
}

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:data': [value: WorkOrderObj]
}>()

const satisfactionData = reactive<SatisfactionData>({
  rating: props.data?.serviceSatisfaction || 0,
  comment: props.data?.satisfactionComment || '',
  signature: props.data?.execution?.customerSignature?.url || props.data?.customerSignatureBase64 || ''
})

const handleRatingChange = (newRating: number) => {
  satisfactionData.rating = newRating
  updateData()
}

const handleCommentChange = (newComment: string) => {
  satisfactionData.comment = newComment
  updateData()
}

const handleSignatureChange = (newSignature: string) => {
  satisfactionData.signature = newSignature
  updateData()
}

const updateData = () => {
  emit('update:data', {
    ...props.data,
    serviceSatisfaction: satisfactionData.rating,
    satisfactionComment: satisfactionData.comment,
    customerSignatureBase64: satisfactionData.signature
  } as WorkOrderObj)
}
</script>

<template>
  <CardCollapse
    title="ความพึงพอใจต่อการให้บริการ"
    icon="/assets/images/doc.png"
  >
    <div class="satisfaction-container">
      <!-- Main Layout with flex-row -->
      <div class="satisfaction-layout">
        <!-- Left side - Rating and Comment -->
        <div class="rating-comment-section">
          <RatingAndComment
            :rating="satisfactionData.rating"
            :comment="satisfactionData.comment"
            :max-words="250"
            @rating-change="handleRatingChange"
            @comment-change="handleCommentChange"
          />
        </div>

        <!-- Right side - Signature Section (ลบส่วนปุ่มเลือกออก) -->
        <div class="signature-section-wrapper">
          <SignatureSection
            title="ภาพลายเซ็นลูกค้า"
            :signature="satisfactionData.signature"
            :show-preset-signature="false"
            :show-reset-button="true"
            @update:signature="handleSignatureChange"
          />
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
.satisfaction-container {
  padding: 16px 0;
}

.satisfaction-layout {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-start;
}

/* Left section - Rating and Comment */
.rating-comment-section {
  flex: 1;
  max-width: 54%;
  width: 100%;
}

/* Right section - Signature */
.signature-section-wrapper {
  flex: 0 0 45%;
  width: 45%;
  max-width: 45%;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .satisfaction-layout {
    flex-direction: column;
    gap: 20px;
  }

  .rating-comment-section,
  .signature-section-wrapper {
    flex: none;
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .satisfaction-container {
    padding: 12px 0;
  }

  .satisfaction-layout {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .satisfaction-container {
    padding: 8px 0;
  }

  .satisfaction-layout {
    gap: 12px;
  }
}
</style>
