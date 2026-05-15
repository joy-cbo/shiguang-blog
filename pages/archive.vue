<template>
  <NuxtLayout name="default">
    <h1 class="text-2xl font-bold mb-6">文章归档</h1>
    <!-- 标签云 -->
    <div class="flex flex-wrap gap-2 mb-8" v-if="tags.length">
      <NuxtLink v-for="t in tags" :key="t.id" :to="`/tags/${t.slug}`"
        class="px-3 py-1 rounded-full text-sm border dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
        {{ t.name }} ({{ t.post_count }})
      </NuxtLink>
    </div>
    <div class="grid gap-6">
      <article v-for="post in posts" :key="post.id" class="border-b dark:border-gray-700 pb-4">
        <h2 class="text-lg font-semibold"><NuxtLink :to="`/posts/${post.slug}`" class="hover:text-blue-600">{{ post.title }}</NuxtLink></h2>
        <p class="text-sm text-gray-500">{{ formatDate(post.created_at) }}</p>
      </article>
    </div>
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button v-for="p in totalPages" :key="p" @click="page=p;load()" :class="['px-3 py-1 rounded text-sm', page===p?'bg-blue-600 text-white':'bg-gray-100 dark:bg-gray-800']">{{ p }}</button>
    </div>
    <p v-if="!posts.length && !loading" class="text-gray-400 text-center py-20">暂无文章</p>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { formatDate } = useFormat()
const { tags, fetchTags } = useTagCloud()
const posts = ref<any[]>([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)

async function load() {
  const data = await $fetch<{ posts: any[]; totalPages: number }>(`/api/posts?page=${page.value}`)
  posts.value = data.posts || []
  totalPages.value = data.totalPages || 1
}

onMounted(async () => { await Promise.all([load(), fetchTags()]); loading.value = false })
</script>
