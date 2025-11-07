import { acceptHMRUpdate, defineStore } from 'pinia'
import axios from 'axios'

export const useArticleStore = defineStore('article', () => {
  const articles = ref({})
  const article = ref({})
  const commentArticle = ref({})

  async function fetchArticles() {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts`,
    )
    articles.value = data
  }

  async function fetchArticleByid(id) {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
    )
    article.value = data

    const { data: comments } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}/comments`,
    )
    commentArticle.value = comments
  }

  return {
    articles: computed(() => articles.value),
    article: computed(() => article.value),
    commentArticle: computed(() => commentArticle.value),

    fetchArticles,
    fetchArticleByid,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useArticleStore as any, import.meta.hot),
  )
}
