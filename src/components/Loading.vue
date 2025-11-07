<script setup lang="ts">
const loadingStore = useLoadingStore();
watch(
  () => loadingStore.load,
  (newValue) => {
    if (newValue) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  },
);
</script>

<template>
  <div v-if="loadingStore.load" class="bg-loader">
    <div class="wraper_loader">
      <div id="loader" />
    </div>
  </div>
</template>

<style scoped>
.bg-loader {
  background: var(--q-primary) !important;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 99999999;
}

.title {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
.wraper_loader {
  display: inline-block;
  width: 50px;
  height: 50px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
#loader {
  width: 50px;
  height: 50px;
  border: 4px solid #f781ff;
  border-radius: 50%;
  border-top: 4px solid #fff;
  border-bottom: 4px solid #fff;
  border-right: 4px solid #fff;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }

  to {
    bottom: 0px;
    opacity: 1;
  }
}

@keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }

  to {
    bottom: 0;
    opacity: 1;
  }
}
</style>
