<!-- src/components/work_execution/SignatureSection.vue -->
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Props {
  title: string
  signature?: string
  showPresetSignature?: boolean
  showResetButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  signature: '',
  showPresetSignature: true,
  showResetButton: true
})

const emit = defineEmits<{
  'update:signature': [signature: string]
}>()

const showSignature = ref(false)
const isDrawing = ref(false)
const canvasRef = ref<HTMLCanvasElement>()
const currentSignature = ref(props.signature)

// Initialize canvas
const initializeCanvas = async () => {
  if (showSignature.value && canvasRef.value) {
    await nextTick()
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }
}

const handleSignatureClick = () => {
  showSignature.value = true
  nextTick(() => {
    initializeCanvas()
  })
}

const handleSignatureComplete = () => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const dataURL = canvas.toDataURL()
    currentSignature.value = dataURL
    emit('update:signature', dataURL)
  }
  showSignature.value = false
}

const handleResetSignature = () => {
  currentSignature.value = ''
  emit('update:signature', '')
}

const handleUsePresetSignature = () => {
  // จำลองลายเซ็นที่ตั้งไว้
  const presetSignature = 'preset_signature_data_url'
  currentSignature.value = presetSignature
  emit('update:signature', presetSignature)
}

const clearCanvas = () => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}

// Mouse events
const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true
  draw(e)
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()

  if (ctx) {
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
}

const stopDrawing = () => {
  if (!canvasRef.value) return
  isDrawing.value = false
  const ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.beginPath()
  }
}

// Touch events for mobile
const startTouchDrawing = (e: TouchEvent) => {
  e.preventDefault()
  isDrawing.value = true
  const touch = e.touches[0]
  const rect = canvasRef.value?.getBoundingClientRect()
  if (rect) {
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    })
    draw(mouseEvent)
  }
}

const touchDraw = (e: TouchEvent) => {
  e.preventDefault()
  if (!isDrawing.value) return
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  draw(mouseEvent)
}

const stopTouchDrawing = (e: TouchEvent) => {
  e.preventDefault()
  stopDrawing()
}
</script>

<template>
  <div class="signature-section">
    <!-- Title -->
    <div class="signature-header">
      <label class="signature-title w-full text-center rounded-xl bg-[#F1DCEB] p-4">
        {{ title }}
      </label>
    </div>

    <!-- Signature canvas/display  -->
    <div class="signature-display">
      <div
        class="signature-area"
        @click="!currentSignature ? handleSignatureClick() : null"
      >
        <div v-if="currentSignature" class="signature-content">
          <!-- Signature display -->
          <div class="signature-wrapper">
            <img
              v-if="currentSignature"
              :src="currentSignature"
              alt="Signature"
              class="signature-image"
            />
            <div v-else class="signature-placeholder">
              <div class="signature-check">✓</div>
              <p>ลายเซ็นอิเล็กทรอนิกส์</p>
            </div>
          </div>

          <!-- Reset button -->
          <button
            v-if="showResetButton"
            @click="handleResetSignature"
            class="reset-button"
          >
            รีเซ็ต
          </button>
        </div>

        <div v-else class="empty-signature">
          <q-icon name="edit" class="signature-icon" />
          <p>แตะเพื่อเซ็นชื่อ</p>
        </div>
      </div>
    </div>

    <!-- Signature Modal -->
    <div v-if="showSignature" class="signature-modal">
      <div class="modal-backdrop" @click="showSignature = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>ลายเซ็นอิเล็กทรอนิกส์</h3>
        </div>

        <div class="canvas-container">
          <canvas
            ref="canvasRef"
            width="350"
            height="200"
            class="signature-canvas"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startTouchDrawing"
            @touchmove="touchDraw"
            @touchend="stopTouchDrawing"
          />
          <button
            @click="clearCanvas"
            class="clear-button"
          >
            ลบ
          </button>
        </div>

        <div class="modal-actions">
          <button
            @click="showSignature = false"
            class="cancel-button"
          >
            ยกเลิก
          </button>
          <button
            @click="handleSignatureComplete"
            class="confirm-button"
          >
            ยืนยันลายเซ็น
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signature-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

/* Header */
.signature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.signature-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Signature Display */
.signature-display {
  position: relative;
}

.signature-area {
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  min-height: 200px;
  width: 100%;
  background-color: #f9fafb;
  cursor: pointer;
  padding: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-wrapper {
  width: 100%;
  height: 100%;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.signature-placeholder {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.signature-check {
  font-size: 32px;
  color: #374151;
  margin-bottom: 8px;
}

.signature-placeholder p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.reset-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  color: #69306D;
  background: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.reset-button:hover {
  background-color: #f9fafb;
}

.empty-signature {
  text-align: center;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.signature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-signature p {
  font-size: 14px;
  margin: 0;
}

/* Modal */
.signature-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  position: relative;
  z-index: 10;
}

.modal-header {
  padding: 24px 24px 16px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

.canvas-container {
  padding: 0 24px 16px;
  position: relative;
}

.signature-canvas {
  width: 100%;
  height: 200px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  touch-action: none;
}

.clear-button {
  position: absolute;
  top: 12px;
  right: 36px;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.clear-button:hover {
  background: #fee2e2;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-button,
.confirm-button {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background: #f9fafb;
}

.confirm-button {
  background: #69306D;
  color: white;
  border: 1px solid #69306D;
}

.confirm-button:hover {
  background: #5a285d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .signature-area {
    padding: 16px;
    min-height: 180px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 8px;
  }
}
</style>
