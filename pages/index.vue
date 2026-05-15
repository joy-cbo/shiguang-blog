<template>
  <NuxtLayout name="default">
    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
    <template v-else>
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 文章列表 -->
        <div class="flex-1 min-w-0">
          <div class="grid gap-6">
            <article v-for="post in posts" :key="post.id" class="border-b dark:border-gray-700 pb-6 flex gap-4">
              <NuxtLink :to="`/posts/${post.slug}`" class="shrink-0 hidden sm:block">
                <img :src="post.cover || `/api/cover/${post.slug}`" :alt="post.title" class="w-32 h-20 object-cover rounded-lg bg-gray-200 dark:bg-gray-700" />
              </NuxtLink>
              <div class="flex-1 min-w-0">
                <div v-if="post.is_pinned" class="text-orange-500 text-xs mb-1">📌 置顶</div>
                <h2 class="text-xl font-semibold mb-2">
                  <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-blue-600">{{ post.title }}</NuxtLink>
                </h2>
                <p class="text-sm text-gray-500 mb-2">
                  {{ post.author_nickname || '匿名' }} · {{ formatDate(post.created_at) }}
                  <NuxtLink v-if="post.category_name" :to="`/categories/${post.category_slug}`" class="text-blue-500 ml-2">{{ post.category_name }}</NuxtLink>
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ stripHtml(post.excerpt || post.content).slice(0, 200) }}</p>
              </div>
            </article>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
            <button v-for="p in totalPages" :key="p" @click="page=p;load()" :class="['px-3 py-1 rounded text-sm', page===p?'bg-blue-600 text-white':'bg-gray-100 dark:bg-gray-800']">{{ p }}</button>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="w-full lg:w-64 shrink-0 space-y-6">
          <!-- 最新文章 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">最新文章</h3>
            <ul class="space-y-2">
              <li v-for="r in recentPosts" :key="r.id">
                <NuxtLink :to="`/posts/${r.slug}`" class="text-sm hover:text-blue-600 line-clamp-1">{{ r.title }}</NuxtLink>
                <p class="text-xs text-gray-400">{{ formatDate(r.created_at) }}</p>
              </li>
            </ul>
          </div>

          <!-- 标签云 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">标签云</h3>
            <div class="flex flex-wrap gap-1">
              <NuxtLink v-for="t in tagCloud" :key="t.id" :to="`/tags/${t.slug}`"
                class="px-2 py-0.5 rounded text-xs hover:bg-blue-100 dark:hover:bg-blue-900"
                :class="tagSizeClass(t.post_count)"
                :style="{ backgroundColor: tagBg(t.post_count) }">
                {{ t.name }}
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Post } from '~~/types'
const { formatDate, stripHtml } = useFormat()
const { tags: tagCloud, fetchTags } = useTagCloud()

const posts = ref<Post[]>([])
const recentPosts = ref<Array<{ id: number; title: string; slug: string; created_at: string }>>([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)

async function load() {
  const data = await $fetch<{ posts: Post[]; totalPages: number }>(`/api/posts?page=${page.value}`)
  posts.value = data.posts || []
  totalPages.value = data.totalPages || 1
}

// 标签大小 — 根据文章数分4档
function tagSizeClass(count: number) {
  if (count >= 10) return 'text-sm font-bold'
  if (count >= 5) return 'text-xs font-semibold'
  if (count >= 2) return 'text-xs'
  return 'text-xs text-gray-500'
}

function tagBg(count: number) {
  if (count >= 10) return '#dbeafe'
  if (count >= 5) return '#e0e7ff'
  if (count >= 2) return '#f3f4f6'
  return 'transparent'
}

onMounted(async () => {
  await Promise.all([
    load(),
    fetchTags(),
    $fetch<{ posts: any[] }>('/api/posts?limit=5').then(d => { recentPosts.value = d.posts || [] }),
  ])
  loading.value = false
})
</script>
