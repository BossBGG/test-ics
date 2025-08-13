<template>
  <div class="input-text-container">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }} <span v-if="required" class="required">*</span>
    </label>
    <input
        :type="type"
        :id="inputId"
        :name="name"
        class="text-input-field"
        :placeholder="placeholder"
        v-model="internalValue"
        :required="required"
        :aria-label="label || placeholder"
    />
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
  type: {
    type: String,
    default: 'text' // Allow other input types like 'email', 'password'
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

// Use an internal ref for the input's value
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
const inputId = computed(() => props.id || `input-text-${props.name || Math.random().toString(36).substring(2, 9)}`);
</script>

<style scoped>


.input-label {
  color: #333;
  margin-bottom: 8px;
  align-self: flex-start;
  display: block;
  font-size: 14px;
}

.input-label .required {
  color: #e74c3c;
  font-weight: bold;
}

.text-input-field {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #333;
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  width: 100%;
  box-sizing: border-box;
}

.text-input-field::placeholder {
  color: #999;
}

.text-input-field:focus {
  border-color: #8a2be2;
  box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.2);
}
</style>