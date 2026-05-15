<template>
  <NuxtLayout name="admin">
    <div class="mb-4">
      <input type="file" @change="upload" class="text-sm" />
    </div>
    <div class="grid grid-cols-4 gap-3">
      <div v-for="item in items" :key="item.id" class="bg-white dark:bg-gray-800 rounded border dark:border-gray-700 p-2 text-center">
        <img v-if="item.category === 'image'" :src="item.url" class="max-h-24 mx-auto mb-1 rounded" />
        <span v-else class="text-4xl">📁</span>
        <p class="text-xs text-gray-400 truncate">{{ item.filename }}</p>
        <button @click="remove(item.id)" class="text-red-400 text-xs mt-1">删除</button>
      </div>
    </div>
    <p v-if="!items.length" class="text-gray-400 text-center py-8">暂无文件</p>
  </NuxtLayout>
</template>

<script setup lang="ts">
const items = ref<any[]>([])

async function load() {
  const data = await $fetch<{ attachments: any[] }>('/api/attachments', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } }).catch(() => ({ attachments: [] }))
  items.value = data.attachments || []
}

async function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const form = new FormData()
  form.append('file', file)
  await $fetch('/api/upload', { method: 'POST', body: form, headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

async function remove(id: number) {
  await $fetch(`/api/attachments/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  load()
}

onMounted(load)
</script>
