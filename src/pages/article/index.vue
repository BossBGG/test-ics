<script setup lang="ts">
const acticleStore = useArticleStore()
const { articles } = storeToRefs(acticleStore)

onMounted(async () => {
  loading.start()
  await acticleStore.fetchArticles()
  loading.stop()
})
</script>

<template>
  <div>
    <div>Article</div>
    <!-- <pre>{{ articles }}</pre> -->
    <ul v-for="article in articles" class="q-mt-md">
      <li>
        <router-link :to="{ name: '/article/[id]', params: { id: article.id } }">
          {{ article.title }}
          <!-- {{ article.userId }} -->
        </router-link>
      </li>
      <hr>
    </ul>
  </div>
</template>
