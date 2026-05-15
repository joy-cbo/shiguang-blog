<template>
  <NuxtLayout name="admin">
    <div class="flex gap-2 mb-4">
      <input v-model="name" placeholder="分类名" class="border rounded px-3 py-1.5 text-sm flex-1 dark:bg-gray-800 dark:border-gray-600" />
      <input v-model="catSlug" placeholder="别名（可选）" class="border rounded px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-600" />
      <button @click="create" class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">添加</button>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div v-for="c in categories" :key="c.id" class="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 text-sm">
        <span>{{ c.name }} <span class="text-gray-400">({{ c.post_count || 0 }})</span></span>
        <button @click="remove(c.id)" class="text-red-400 text-xs">删除</button>
      </div>
      <p v-if="!categories.length" class="text-gray-400 text-center py-8">暂无分类</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Category } from '~~/types'

const name = ref('')
const catSlug = ref('')
const categories = ref<Category[]>([])

async function load() {
  const data = await $fetch<{ categories: Category[] }>('/api/categories', {
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') },
  })
  categories.value = data.categories || []
}

async function create() {
  if (!name.value) return
  await $fetch('/api/categories', {
    method: 'POST',
    body: { name: name.value, slug: catSlug.value || undefined },
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') },
  })
  name.value = ''; catSlug.value = ''
  load()
}

async function remove(id: number) {
  await $fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

onMounted(load)
</script>
