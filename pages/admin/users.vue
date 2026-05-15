<template>
  <NuxtLayout name="admin">
    <NuxtLink to="/admin/setup" class="text-blue-500 text-sm mb-4 inline-block">+ 添加用户</NuxtLink>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div v-for="u in users" :key="u.id" class="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 text-sm">
        <span>{{ u.username }} <span class="text-gray-400 text-xs">({{ u.role }})</span></span>
        <button v-if="u.role !== 'admin'" @click="remove(u.id)" class="text-red-400 text-xs">删除</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { User } from '~~/types'
const users = ref<User[]>([])

onMounted(async () => {
  const data = await $fetch<{ users: User[] }>('/api/users', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  users.value = data.users || []
})

async function remove(id: number) {
  await $fetch(`/api/users/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
  users.value = users.value.filter(u => u.id !== id)
}
</script>
