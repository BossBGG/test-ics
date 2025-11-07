<template>
  <div class="input-textarea-container">
    <label v-if="label" :for="inputId" class="textarea-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <textarea
        :id="inputId"
        :name="name"
        class="textarea-field"
        :placeholder="placeholder"
        v-model="internalValue"
        :rows="rows"
        :required="required"
        :aria-label="label || placeholder"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  initialValue: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  rows: {
    type: [String, Number], // Can be a string "5" or number 5
    default: 5 // Default number of rows
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']); // For v-model and custom change event

// Use an internal ref for the textarea's value
const internalValue = ref(props.initialValue);

// Watch for changes in initialValue prop to update internalValue
watch(() => props.initialValue, (newValue) => {
  internalValue.value = newValue;
});

// Watch for changes in internalValue to emit updates
watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue); // For v-model
  emit('change', newValue); // Custom change event
});

// Generate a unique ID if not provided
const inputId = computed(() => props.id || `input-textarea-${props.name || Math.random().toString(36).substring(2, 9)}`);
</script>

<style scoped>
.input-textarea-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%; /* Make it responsive */
}

.textarea-label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
  align-self: flex-start; /* Aligns the label to the left */
}

.textarea-label .required {
  color: #e74c3c; /* Red color for asterisk */
  font-weight: bold;
}

.textarea-field {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  outline: none; /* Remove default focus outline */
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%; /* Make textarea fill its container */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  resize: vertical; /* Allow vertical resizing by user, but not horizontal */
  min-height: 100px; /* Minimum height */
}

.textarea-field::placeholder {
  color: #999;
}

.textarea-field:focus {
  border-color: #8a2be2; /* Purple focus border */
  box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2); /* Light purple glow */
}
</style>