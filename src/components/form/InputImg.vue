<template>
  <div class="image-upload-container">
    <div class="label-text">{{ label }}</div>
    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleFileChange"
        style="display: none;"
    />
    <div class="upload-area" @click="handleClick">
      <img v-if="selectedImage" :src="selectedImage" alt="Preview" class="image-preview-thumbnail"/>
      <template v-else>
        <img src="@img/upload_img.svg" alt="Preview" class="image-preview-thumbnail"/>
      </template>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  initialImage: {
    type: String,
  }
})

const selectedImage = ref(props.initialImage);
watch(() => props.initialImage, (newVal) => {
  selectedImage.value = newVal
})
const fileInput = ref(null);
const emit = defineEmits(['fileChange']);
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
    // You can also handle the file upload logic here (e.g., to an API)
    console.log('Selected file:', file);
  } else {
    selectedImage.value = null;
  }

  emit('fileChange', file);
};

const handleClick = () => {
  fileInput?.value?.click();
};
</script>

<style scoped>
.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align "ภาพปก" to the left */
  margin-bottom: 20px;
}

.label-text {
  color: #333;
  margin-bottom: 8px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  max-width: 328px;
  max-height: 199px;
  background-color: #f0e6fa; /* Light purple background */
  cursor: pointer;
  transition: background-color 0.3s ease;
  overflow: hidden; /* For image preview */
}

.upload-area:hover {
  background-color: #e0d0f0;
}

.icon-placeholder svg {
  width: 60px; /* Adjust icon size */
  height: 60px; /* Adjust icon size */
  color: #8a2be2; /* Purple icon color */
  margin-bottom: 10px;
}


.image-preview-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area while maintaining aspect ratio */
  border-radius: 6px; /* Slightly less than container to show border */
}
</style>
