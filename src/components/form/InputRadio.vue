<template>
  <div class="radio-group-container">
    <div
        v-for="option in options"
        :key="option.value"
        class="radio-option"
        @click="selectOption(option.value)"
    >
      <input
          type="radio"
          :id="`radio-${option.value}`"
          :name="name"
          :value="option.value"
          :checked="modelValue == option.value"
          @change="handleChange"
          class="hidden-radio"
      />
      <label :for="`radio-${option.value}`" class="custom-radio-label">
        <span class="custom-radio-circle" :class="{ 'is-selected': modelValue == option.value }">
          <span v-if="modelValue == option.value" class="custom-radio-dot"></span>
        </span>
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true // All radios in a group must share the same name
  },
  options: {
    type: Array, // Array of { label: string, value: string }
    required: true,
    validator: (value) => value.every(option => typeof option.label === 'string' && typeof option.value === 'string')
  },
  modelValue: {
    // The currently selected value (used with v-model)
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (event) => {
  const newValue = event.target.value;
  emit('update:modelValue', newValue);
  emit('change', newValue); // Emit custom change event if needed
};

// Allows clicking the whole option div to select the radio
const selectOption = (value) => {
  // Only change if it's different to avoid unnecessary re-renders
  if (props.modelValue !== value) {
    emit('update:modelValue', value);
    emit('change', value);
  }
};
</script>

<style scoped>
.radio-group-container {
  display: flex;
  gap: 20px; /* Space between radio options */
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  width: fit-content; /* Adjust width to content */
  align-items: center; /* Align items vertically in the middle */
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  -webkit-user-select: none; /* Prevent text selection */
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.hidden-radio {
  /* Hide the default browser radio button */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.custom-radio-label {
  display: flex;
  align-items: center;
  color: #333;
  cursor: pointer;
}

.custom-radio-circle {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px; /* Size of the custom radio circle */
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-right: 8px;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0; /* Prevent shrinking on smaller screens */
}

.radio-option:hover .custom-radio-circle {
  border-color: #69306D; /* Purple on hover */
}

.is-selected {
  border-color: #69306D; /* Purple when selected */
  background-color: #69306D; /* Purple background when selected */
}

.custom-radio-dot {
  width: 8px; /* Size of the inner dot */
  height: 8px;
  background-color: #fff; /* White dot */
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
}
</style>
