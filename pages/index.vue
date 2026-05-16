     1|<template>
     2|  <NuxtLayout name="default">
     3|    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
     4|    <template v-else>
     5|      <div class="flex flex-col lg:flex-row gap-8">
     6|        <!-- 文章列表 -->
     7|        <div class="flex-1 min-w-0">
     8|          <div class="grid gap-6">
     9|            <article v-for="post in posts" :key="post.id" class="border-b dark:border-gray-700 pb-6 flex gap-4">
    10|              <NuxtLink :to="`/posts/${post.slug}`" class="shrink-0 hidden sm:block">
    11|                <img :src="post.cover || `/cover/${post.slug}.svg`" :alt="post.title" class="w-32 h-20 object-cover rounded-lg bg-gray-200 dark:bg-gray-700" />
    12|              </NuxtLink>
    13|              <div class="flex-1 min-w-0">
    14|                <div v-if="post.is_pinned" class="text-orange-500 text-xs mb-1">📌 置顶</div>
    15|                <h2 class="text-xl font-semibold mb-2">
    16|                  <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-blue-600">{{ post.title }}</NuxtLink>
    17|                </h2>
    18|                <p class="text-sm text-gray-500 mb-2">
    19|                  {{ post.author_nickname || '匿名' }} · {{ formatDate(post.created_at) }}
    20|                  <NuxtLink v-if="post.category_name" :to="`/categories/${post.category_slug}`" class="text-blue-500 ml-2">{{ post.category_name }}</NuxtLink>
    21|                </p>
    22|                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ stripHtml(post.excerpt || post.content).slice(0, 200) }}</p>
    23|              </div>
    24|            </article>
    25|          </div>
    26|          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
    27|            <button v-for="p in totalPages" :key="p" @click="page=p;load()" :class="['px-3 py-1 rounded text-sm', page===p?'bg-blue-600 text-white':'bg-gray-100 dark:bg-gray-800']">{{ p }}</button>
    28|          </div>
    29|        </div>
    30|
    31|        <!-- 侧边栏 -->
    32|        <aside class="w-full lg:w-64 shrink-0 space-y-6">
    33|          <!-- 最新文章 -->
    34|          <div>
    35|            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">最新文章</h3>
    36|            <ul class="space-y-2">
    37|              <li v-for="r in recentPosts" :key="r.id">
    38|                <NuxtLink :to="`/posts/${r.slug}`" class="text-sm hover:text-blue-600 line-clamp-1">{{ r.title }}</NuxtLink>
    39|                <p class="text-xs text-gray-400">{{ formatDate(r.created_at) }}</p>
    40|              </li>
    41|            </ul>
    42|          </div>
    43|
    44|          <!-- 标签云 -->
    45|          <div>
    46|            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">标签云</h3>
    47|            <div class="flex flex-wrap gap-1">
    48|              <NuxtLink v-for="t in tagCloud" :key="t.id" :to="`/tags/${t.slug}`"
    49|                class="px-2 py-0.5 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900"
    50|                :class="tagSizeClass(t.post_count)"
    51|                :style="{ backgroundColor: tagBg(t.post_count) }">
    52|                {{ t.name }}
    53|              </NuxtLink>
    54|            </div>
    55|          </div>
    56|        </aside>
    57|      </div>
    58|    </template>
    59|  </NuxtLayout>
    60|</template>
    61|
    62|<script setup lang="ts">
    63|import type { Post } from '~~/types'
    64|const { formatDate, stripHtml } = useFormat()
    65|const { tags: tagCloud, fetchTags } = useTagCloud()
    66|
    67|const posts = ref<Post[]>([])
    68|const recentPosts = ref<Array<{ id: number; title: string; slug: string; created_at: string }>>([])
    69|const page = ref(1)
    70|const totalPages = ref(1)
    71|const loading = ref(true)
    72|
    73|async function load() {
    74|  const data = await $fetch<{ posts: Post[]; totalPages: number }>(`/api/posts?page=${page.value}`)
    75|  posts.value = data.posts || []
    76|  totalPages.value = data.totalPages || 1
    77|}
    78|
    79|// 标签大小 — 根据文章数分4档
    80|function tagSizeClass(count: number) {
    81|  if (count >= 10) return 'text-sm font-bold'
    82|  if (count >= 5) return 'text-xs font-semibold'
    83|  if (count >= 2) return 'text-xs'
    84|  return 'text-xs text-gray-500'
    85|}
    86|
    87|function tagBg(count: number) {
    88|  if (count >= 10) return '#dbeafe'
    89|  if (count >= 5) return '#e0e7ff'
    90|  if (count >= 2) return '#f3f4f6'
    91|  return 'transparent'
    92|}
    93|
    94|onMounted(async () => {
    95|  await Promise.all([
    96|    load(),
    97|    fetchTags(),
    98|    $fetch<{ posts: any[] }>('/api/posts?limit=5').then(d => { recentPosts.value = d.posts || [] }),
    99|  ])
   100|  loading.value = false
   101|})
   102|</script>
   103|