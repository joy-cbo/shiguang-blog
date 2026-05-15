<!-- 搜索结果页 -->
<template>
  <NuxtLayout name="default">
    <h1 class="text-2xl font-bold mb-2">搜索：{{ q }}</h1>
    <p class="text-sm text-gray-500 mb-6">找到 {{ total }} 篇文章</p>

    <div v-if="loading" class="text-center py-10 text-gray-400">搜索中...</div>
    <div v-else-if="!results.length" class="text-center py-10 text-gray-400">
      <p class="text-lg mb-2">😕 没有找到相关内容</p>
      <p>试试其他关键词，或者 <NuxtLink to="/" class="text-blue-500 underline">回到首页</NuxtLink></p>
    </div>

    <div v-else class="grid gap-6">
      <article v-for="r in results" :key="r.id" class="border-b dark:border-gray-700 pb-6">
        <h2 class="text-lg font-semibold mb-1">
          <NuxtLink :to="`/posts/${r.slug}`" class="hover:text-blue-600">{{ r.title }}</NuxtLink>
        </h2>
        <p class="text-xs text-gray-500 mb-2">{{ r.author_nickname || '匿名' }} · {{ formatDate(r.created_at) }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ r.snippet }}</p>
      </article>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { formatDate } = useFormat()
const q = computed(() => (route.query.q as string || '').trim())
const results = ref<any[]>([])
const total = ref(0)
const loading = ref(true)

watchEffect(async () => {
  if (!q.value) { loading.value = false; return }
  loading.value = true
  try {
    const data = await $fetch<{ results: any[]; total: number }>(`/api/search?q=${encodeURIComponent(q.value)}`)
    results.value = data.results || []
    total.value = data.total || 0
  } catch { results.value = [] }
  loading.value = false
})
</script>
