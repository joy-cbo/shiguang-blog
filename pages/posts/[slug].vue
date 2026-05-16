     1|<template>
     2|  <NuxtLayout name="default">
     3|    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
     4|    <template v-else-if="post">
     5|      <!-- 阅读进度条 -->
     6|      <div class="fixed top-0 left-0 h-0.5 bg-blue-500 z-50" :style="{ width: progress + '%' }"></div>
     7|
     8|      <!-- 封面图 -->
     9|      <img :src="post.cover || `/cover/${post.slug}.svg`" :alt="post.title" class="w-full h-48 sm:h-64 object-cover rounded-xl mb-6 bg-gray-200 dark:bg-gray-700" />
    10|
    11|      <h1 class="text-2xl md:text-3xl font-bold mb-3">{{ post.title }}</h1>
    12|      <p class="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
    13|        <img v-if="post.author_avatar" :src="post.author_avatar" class="w-5 h-5 rounded-full" />
    14|        <span>{{ post.author_nickname || '匿名' }}</span>
    15|        <span>·</span>
    16|        <span>{{ formatDate(post.created_at) }}</span>
    17|        <span>·</span>
    18|        <span>{{ post.view_count || 0 }} 次阅读</span>
    19|        <NuxtLink v-if="post.category_name" :to="`/categories/${post.category_slug}`" class="text-blue-500 ml-1">📂 {{ post.category_name }}</NuxtLink>
    20|      </p>
    21|
    22|      <!-- 标签 -->
    23|      <div v-if="post.tags?.length" class="flex gap-1 mb-4 flex-wrap">
    24|        <NuxtLink v-for="t in post.tags" :key="t.id" :to="`/tags/${t.slug}`" class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900">{{ t.name }}</NuxtLink>
    25|      </div>
    26|
    27|      <div v-html="renderedContent" class="prose dark:prose-invert max-w-none mb-10"></div>
    28|
    29|      <!-- 作者卡片 -->
    30|      <div class="border-t dark:border-gray-700 pt-6 mt-6 mb-8">
    31|        <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    32|          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
    33|            {{ (post.author_nickname || '匿')[0] }}
    34|          </div>
    35|          <div>
    36|            <p class="font-semibold">{{ post.author_nickname || '匿名' }}</p>
    37|            <p class="text-xs text-gray-500">{{ post.author_nickname ? '博客作者' : '' }}</p>
    38|          </div>
    39|        </div>
    40|      </div>
    41|
    42|      <!-- 上一篇/下一篇 -->
    43|      <div v-if="prev || next" class="flex justify-between border-t dark:border-gray-700 pt-4 mb-8 text-sm">
    44|        <NuxtLink v-if="prev" :to="`/posts/${prev.slug}`" class="text-blue-500 hover:underline">← {{ prev.title }}</NuxtLink>
    45|        <span v-else class="text-gray-400"></span>
    46|        <NuxtLink v-if="next" :to="`/posts/${next.slug}`" class="text-blue-500 hover:underline">{{ next.title }} →</NuxtLink>
    47|        <span v-else class="text-gray-400"></span>
    48|      </div>
    49|    </template>
    50|
    51|    <!-- 回到顶部 -->
    52|    <button v-if="showTop" @click="scrollTop" class="fixed bottom-6 right-6 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 text-lg z-40">↑</button>
    53|  </NuxtLayout>
    54|</template>
    55|
    56|<script setup lang="ts">
    57|import { marked } from 'marked'
    58|import DOMPurify from 'dompurify'
    59|
    60|const route = useRoute()
    61|const { formatDate } = useFormat()
    62|const { prev, next, fetchNav } = usePostNav()
    63|const post = ref<any>(null)
    64|const loading = ref(true)
    65|const showTop = ref(false)
    66|const progress = ref(0)
    67|
    68|const renderedContent = computed(() => {
    69|  if (!post.value?.content) return ''
    70|  return DOMPurify.sanitize(marked(post.value.content))
    71|})
    72|
    73|onMounted(async () => {
    74|  const data = await $fetch<{ post: any }>(`/api/posts/${route.params.slug}`)
    75|  post.value = data.post
    76|  loading.value = false
    77|  if (post.value?.id) fetchNav(post.value.id)
    78|
    79|  // 阅读进度
    80|  window.addEventListener('scroll', () => {
    81|    const h = document.documentElement.scrollHeight - window.innerHeight
    82|    progress.value = h > 0 ? Math.round((window.scrollY / h) * 100) : 0
    83|    showTop.value = window.scrollY > 500
    84|  })
    85|})
    86|
    87|function scrollTop() {
    88|  window.scrollTo({ top: 0, behavior: 'smooth' })
    89|}
    90|</script>
    91|