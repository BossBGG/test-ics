<script setup lang="ts">
const galleryStore = useArticleStore()
const { gallerys } = storeToRefs(galleryStore)
onMounted(async () => {
  loading.start()
  await galleryStore.fetchGallerys()
  loading.stop()
})
</script>

<template>
  <div>
    <h1>Gallery</h1>
    <pre>
  <!-- {{ gallerys }} -->
 </pre>

    <!-- <ul v-for="gallery in gallerys.results">
      <li>
        <router-link
          :to="{ name: '/pokemon/[name]', params: { name: pokemon.name } }"
        >
          {{ pokemon.name }}
        </router-link>
        <hr />
      </li>
    </ul> -->

    <ul v-for="gallery in gallerys">
      <li>
        <router-link :to="{ name: '/gallery/[id]', params: { id: gallery.id } }">
          <img :src="gallery.thumbnailUrl">
        </router-link>
      </li>
    </ul>
  </div>
</template>
