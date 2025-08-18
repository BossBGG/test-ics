<script setup lang="ts">
const acticleStore = useArticleStore()
const { article, commentArticle } = storeToRefs(acticleStore)

const id = useParams('id')

onMounted(async () => {
  loading.start()
  await acticleStore.fetchArticleByid(id.value)
  loading.stop()
})
</script>

<template>
  <div>
    <h1>Article</h1>

    <h2>user : {{ article.userId }}</h2>
    <div>
      <h3>หัวข้อ : {{ article.title }}</h3>
      <h5>บทความ : {{ article.body }}</h5>
    </div>
    <div class="q-mt-md">
      <h5>Comment</h5>
      <ul>
        <li v-for="comment in commentArticle" :key="comment.id">
          <p class="comment">
            {{ comment.body }}
          </p>
          <p class="small">
            {{ comment.name }}
          </p>
          <p class="small">
            {{ comment.email }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@style';

h3,
h5 {
  font-size: 16px;
}

ul {
  li {
    margin: 30px 0;

    &:first-child {
      margin-top: 15px;
    }
  }
}

.small {
  font-size: 12px;
}

.comment {
  font-size: 14px;
}
</style>
