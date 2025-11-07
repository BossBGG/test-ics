<template>
  <div class="ineligible-container">
    <div class="content-wrapper">
      <div class="image-section">
        <img src="/assets/images/ineligible.png" alt="ไม่มีสิทธิ์เข้าถึง" class="ineligible-image">
      </div>

      <div class="button-section">
        <button
          @click="goBack"
          class="custom-button back-button"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/');
}
</script>

<style scoped>
.ineligible-container {
  min-height: 100vh;
  background-color: #F4EEFF;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.image-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ineligible-image {
  max-width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.button-section {
  width: 50%;
  display: flex;
  justify-content: center;
}

.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 44px;
}

.back-button {
  background-color: #8c4c7b;
}
</style>
