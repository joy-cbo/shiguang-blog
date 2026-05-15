<!--
  Halo 风格布局 — themes/halo-style/layout.vue
  使用方式：复制此文件到 layouts/halo.vue，然后把每个页面的 <NuxtLayout name="default">
  改为 <NuxtLayout name="halo"> 即可切换主题。
-->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <!-- 毛玻璃导航栏 -->
    <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">Blog</NuxtLink>
        <nav class="flex items-center gap-6 text-sm font-medium">
          <SearchBox />
          <NuxtLink to="/" class="hover:text-blue-600 transition-colors">首页</NuxtLink>
          <NuxtLink to="/archive" class="hover:text-blue-600 transition-colors">归档</NuxtLink>
          <NuxtLink to="/tags/全部" class="hover:text-blue-600 transition-colors">标签</NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/admin" class="text-blue-600 hover:text-blue-700">后台</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/admin/login" class="hover:text-blue-600 transition-colors">登录</NuxtLink>
          <button v-if="isLoggedIn" @click="logout" class="text-gray-400 hover:text-red-500 transition-colors">退出</button>
          <button @click="toggleDark" class="text-lg hover:scale-110 transition-transform">{{ isDark ? '☀️' : '🌙' }}</button>
        </nav>
      </div>
    </header>

    <!-- 内容区 -->
    <main class="max-w-5xl mx-auto px-6 py-10">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {{ new Date().getFullYear() }} Blog · Powered by Nuxt 3</p>
        <div class="flex gap-4">
          <a href="/feed.xml" class="hover:text-blue-500 transition-colors">RSS</a>
          <a href="/sitemap.xml" class="hover:text-blue-500 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
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
