<template>
  <NuxtLayout name="admin">
    <div class="flex gap-2 mb-4">
      <input v-model="pageTitle" placeholder="页面标题" class="border rounded px-3 py-1.5 text-sm flex-1 dark:bg-gray-800 dark:border-gray-600" />
      <input v-model="pageSlug" placeholder="别名" class="border rounded px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-600" />
      <button @click="create" class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">添加</button>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div v-for="p in pages" :key="p.id" class="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 text-sm">
        <span>{{ p.title }} <span class="text-gray-400 text-xs">/{{ p.slug }}</span></span>
        <button @click="remove(p.id)" class="text-red-400 text-xs">删除</button>
      </div>
      <p v-if="!pages.length" class="text-gray-400 text-center py-8">暂无页面</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Page } from '~~/types'

const pageTitle = ref('')
const pageSlug = ref('')
const pages = ref<Page[]>([])

async function load() {
  const data = await $fetch<{ pages: Page[] }>('/api/pages', {
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') },
  })
  pages.value = data.pages || []
}

async function create() {
  if (!pageTitle.value) return
  await $fetch('/api/pages', { method: 'POST', body: { title: pageTitle.value, slug: pageSlug.value || undefined }, headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  pageTitle.value = ''; pageSlug.value = ''
  load()
}

async function remove(id: number) {
  await $fetch(`/api/pages/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

onMounted(load)
</script>
