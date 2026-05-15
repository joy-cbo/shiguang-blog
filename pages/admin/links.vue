<template>
  <NuxtLayout name="admin">
    <div class="flex gap-2 mb-4">
      <input v-model="linkName" placeholder="名称" class="border rounded px-3 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-600" />
      <input v-model="linkUrl" placeholder="链接" class="border rounded px-3 py-1.5 text-sm flex-1 dark:bg-gray-800 dark:border-gray-600" />
      <button @click="add" class="bg-blue-600 text-white px-4 py-1.5 rounded text-sm">添加</button>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div v-for="l in links" :key="l.id" class="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 text-sm">
        <span>{{ l.name }} <a :href="l.url" target="_blank" class="text-blue-400 text-xs">{{ l.url }}</a></span>
        <button @click="remove(l.id)" class="text-red-400 text-xs">删除</button>
      </div>
      <p v-if="!links.length" class="text-gray-400 text-center py-8">暂无友链</p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Link } from '~~/types'

const linkName = ref('')
const linkUrl = ref('')
const links = ref<Link[]>([])

async function load() {
  const data = await $fetch<{ links: Link[] }>('/api/links', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  links.value = data.links || []
}

async function add() {
  if (!linkName.value || !linkUrl.value) return
  await $fetch('/api/links', { method: 'POST', body: { name: linkName.value, url: linkUrl.value }, headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  linkName.value = ''; linkUrl.value = ''
  load()
}

async function remove(id: number) {
  await $fetch(`/api/links/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

onMounted(load)
</script>
