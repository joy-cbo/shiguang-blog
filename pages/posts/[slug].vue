<template>
  <NuxtLayout name="default">
    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
    <template v-else-if="post">
      <!-- 阅读进度条 -->
      <div class="fixed top-0 left-0 h-0.5 bg-blue-500 z-50" :style="{ width: progress + '%' }"></div>

      <!-- 封面图 -->
      <img :src="post.cover || `/api/cover/${post.slug}`" :alt="post.title" class="w-full h-48 sm:h-64 object-cover rounded-xl mb-6 bg-gray-200 dark:bg-gray-700" />

      <h1 class="text-2xl md:text-3xl font-bold mb-3">{{ post.title }}</h1>
      <p class="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <img v-if="post.author_avatar" :src="post.author_avatar" class="w-5 h-5 rounded-full" />
        <span>{{ post.author_nickname || '匿名' }}</span>
        <span>·</span>
        <span>{{ formatDate(post.created_at) }}</span>
        <span>·</span>
        <span>{{ post.view_count || 0 }} 次阅读</span>
        <NuxtLink v-if="post.category_name" :to="`/categories/${post.category_slug}`" class="text-blue-500 ml-1">📂 {{ post.category_name }}</NuxtLink>
      </p>

      <!-- 标签 -->
      <div v-if="post.tags?.length" class="flex gap-1 mb-4 flex-wrap">
        <NuxtLink v-for="t in post.tags" :key="t.id" :to="`/tags/${t.slug}`" class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900">{{ t.name }}</NuxtLink>
      </div>

      <div v-html="renderedContent" class="prose dark:prose-invert max-w-none mb-10"></div>

      <!-- 作者卡片 -->
      <div class="border-t dark:border-gray-700 pt-6 mt-6 mb-8">
        <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
            {{ (post.author_nickname || '匿')[0] }}
          </div>
          <div>
            <p class="font-semibold">{{ post.author_nickname || '匿名' }}</p>
            <p class="text-xs text-gray-500">{{ post.author_nickname ? '博客作者' : '' }}</p>
          </div>
        </div>
      </div>

      <!-- 上一篇/下一篇 -->
      <div v-if="prev || next" class="flex justify-between border-t dark:border-gray-700 pt-4 mb-8 text-sm">
        <NuxtLink v-if="prev" :to="`/posts/${prev.slug}`" class="text-blue-500 hover:underline">← {{ prev.title }}</NuxtLink>
        <span v-else class="text-gray-400"></span>
        <NuxtLink v-if="next" :to="`/posts/${next.slug}`" class="text-blue-500 hover:underline">{{ next.title }} →</NuxtLink>
        <span v-else class="text-gray-400"></span>
      </div>
    </template>

    <!-- 回到顶部 -->
    <button v-if="showTop" @click="scrollTop" class="fixed bottom-6 right-6 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 text-lg z-40">↑</button>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const { formatDate } = useFormat()
const { prev, next, fetchNav } = usePostNav()
const post = ref<any>(null)
const loading = ref(true)
const showTop = ref(false)
const progress = ref(0)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return DOMPurify.sanitize(marked(post.value.content))
})

onMounted(async () => {
  const data = await $fetch<{ post: any }>(`/api/posts/${route.params.slug}`)
  post.value = data.post
  loading.value = false
  if (post.value?.id) fetchNav(post.value.id)

  // 阅读进度
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight
    progress.value = h > 0 ? Math.round((window.scrollY / h) * 100) : 0
    showTop.value = window.scrollY > 500
  })
})

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
