<script setup lang="ts">
const galleryStore = useArticleStore()
const { gallery } = storeToRefs(galleryStore)

const id = useParams('id')

onMounted(async () => {
  loading.start()
  await galleryStore.fetchGallerysByID(id.value)
  loading.stop()
})
</script>

<template>
  <div>
    <h1>Gallery</h1>

    <div>
      <img :src="gallery.url">
    </div>
    <!-- <ul>
      <li v-for="comment in commentArticle" :key="comment.id">
        <p>{{ comment.name }}</p>
        <p>{{ comment.email }}</p>
        <p>{{ comment.body }}</p>
      </li>

    </ul> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@style';

ul {
  li {
    margin: 15px 0;
  }
}
</style>
