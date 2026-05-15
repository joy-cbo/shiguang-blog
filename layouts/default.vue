<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold">Blog</NuxtLink>
        <nav class="flex items-center gap-4 text-sm">
          <SearchBox />
          <NuxtLink to="/" class="hover:text-blue-600">首页</NuxtLink>
          <NuxtLink to="/archive" class="hover:text-blue-600">归档</NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/admin" class="hover:text-blue-600">后台管理</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/admin/login" class="hover:text-blue-600">登录</NuxtLink>
          <button v-if="isLoggedIn" @click="logout" class="hover:text-red-500">退出</button>
          <button @click="toggleDark" class="text-lg">{{ isDark ? '☀️' : '🌙' }}</button>
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const isLoggedIn = ref(false)
const isDark = ref(false)

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('auth_token')
  const stored = localStorage.getItem('dark_mode')
  if (stored === 'true' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('dark_mode', String(isDark.value))
}

function logout() {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  navigateTo('/')
}
</script>
