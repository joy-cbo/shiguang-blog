<template>
  <NuxtLayout name="admin">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="card in cards" :key="card.label" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border dark:border-gray-700">
        <p class="text-sm text-gray-500">{{ card.label }}</p>
        <p class="text-2xl font-bold">{{ card.value }}</p>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border dark:border-gray-700">
      <h2 class="font-semibold mb-3">最近文章</h2>
      <table class="w-full text-sm">
        <thead><tr class="text-left text-gray-500 border-b dark:border-gray-700"><th class="py-2">标题</th><th>状态</th><th>时间</th></tr></thead>
        <tbody>
          <tr v-for="p in recentPosts" :key="p.id" class="border-b dark:border-gray-700">
            <td class="py-2">{{ p.title }}</td>
            <td>{{ p.status === 'published' ? '✅' : '📝' }}</td>
            <td class="text-gray-400">{{ formatDate(p.created_at) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!recentPosts.length && !loading" class="text-gray-400 py-4 text-center">暂无文章</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Post } from '~~/types'
const { fetch } = useApi()
const { formatDate } = useFormat()

const cards = ref([
  { label: '文章总数', value: 0 }, { label: '今日访问', value: 0 },
  { label: '分类数', value: 0 }, { label: '标签数', value: 0 },
])
const recentPosts = ref<Post[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [statsData, postsData] = await Promise.all([
      $fetch<{ stats: Record<string, number> }>('/api/stats', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } }),
      $fetch<{ posts: Post[] }>('/api/posts?status=all&limit=5', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } }),
    ])
    const s = statsData.stats
    cards.value = [
      { label: '文章总数', value: s.posts }, { label: '今日访问', value: s.todayVisits },
      { label: '分类数', value: s.categories }, { label: '标签数', value: s.tags },
    ]
    recentPosts.value = postsData.posts || []
  } catch {} finally { loading.value = false }
})
</script>
