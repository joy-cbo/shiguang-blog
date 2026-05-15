<template>
  <NuxtLayout name="admin">
    <div class="flex gap-2 mb-4">
      <input v-model="name" placeholder="标签名" class="border rounded px-3 py-1.5 text-sm flex-1 dark:bg-gray-800 dark:border-gray-600" />
      <button @click="create" class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">添加</button>
    </div>
    <div class="flex flex-wrap gap-2">
      <span v-for="t in tags" :key="t.id" class="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded text-sm flex items-center gap-2">
        {{ t.name }} ({{ t.post_count || 0 }})
        <button @click="remove(t.id)" class="text-red-400 hover:text-red-600">×</button>
      </span>
      <p v-if="!tags.length" class="text-gray-400 w-full text-center py-8">暂无标签</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Tag } from '~~/types'

const name = ref('')
const tags = ref<Tag[]>([])

async function load() {
  const data = await $fetch<{ tags: Tag[] }>('/api/tags', {
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') },
  })
  tags.value = data.tags || []
}

async function create() {
  if (!name.value) return
  await $fetch('/api/tags', { method: 'POST', body: { name: name.value }, headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  name.value = ''
  load()
}

async function remove(id: number) {
  await $fetch(`/api/tags/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

onMounted(load)
</script>
