<script setup lang="ts">
// Manipulate document head
// useHead({
//   title: 'Vitesse',
//   meta: [
//     {
//       name: 'description',
//       content: 'Opinionated Vite Starter Template',
//     },
//     {
//       name: 'theme-color',
//       content: () => '#ffffff',
//     },
//   ],
//   link: [
//     {
//       rel: 'icon',
//       type: 'image/svg+xml',
//       href: () => '/favicon.svg',
//     },
//   ],
// })
// Test

const serviceStore = useServiceStore();
const { services } = storeToRefs(serviceStore);

// Ensure global variable exists
window.global ||= window;

// Check if running on the client side
const isClient = computed(() => !import.meta.env.SSR);
// console.log('isClient: ', isClient.value)
</script>

<template>
  <q-no-ssr>
    <Loading />
    <RouterView v-if="isClient && services" />
  </q-no-ssr>
</template>
