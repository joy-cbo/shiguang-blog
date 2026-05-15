<template>
  <NuxtLayout name="default">
    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
    <template v-else-if="page">
      <h1 class="text-3xl font-bold mb-6">{{ page.title }}</h1>
      <div v-html="page.content" class="prose dark:prose-invert max-w-none"></div>
    </template>
    <div v-else class="text-center py-20 text-gray-400">页面不存在</div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const page = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await $fetch<{ page: any }>(`/api/pages/${route.params.slug}`)
    page.value = data.page
  } catch {}
  loading.value = false
})
</script>
