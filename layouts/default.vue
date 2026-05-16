<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold shrink-0">Blog</NuxtLink>

        <!-- 桌面端导航 -->
        <nav class="hidden md:flex items-center gap-4 text-sm">
          <SearchBox />
          <NuxtLink to="/" class="hover:text-blue-600">首页</NuxtLink>
          <NuxtLink to="/archive" class="hover:text-blue-600">归档</NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/admin" class="hover:text-blue-600">后台管理</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/admin/login" class="hover:text-blue-600">登录</NuxtLink>
          <button v-if="isLoggedIn" @click="logout" class="hover:text-red-500">退出</button>
          <button @click="toggleDark" class="text-lg">{{ isDark ? '☀️' : '🌙' }}</button>
        </nav>

        <!-- 移动端：搜索 + 暗黑 + 汉堡按钮 -->
        <div class="flex items-center gap-2 md:hidden">
          <SearchBox />
          <button @click="toggleDark" class="text-lg">{{ isDark ? '☀️' : '🌙' }}</button>
          <button @click="menuOpen = !menuOpen" class="p-1 text-xl" aria-label="菜单">
            {{ menuOpen ? '✕' : '☰' }}
          </button>
        </div>
      </div>

      <!-- 移动端下拉菜单 -->
      <transition name="slide">
        <div v-if="menuOpen" class="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 space-y-2 text-sm">
          <NuxtLink @click="menuOpen = false" to="/" class="block py-1.5 hover:text-blue-600">首页</NuxtLink>
          <NuxtLink @click="menuOpen = false" to="/archive" class="block py-1.5 hover:text-blue-600">归档</NuxtLink>
          <NuxtLink v-if="isLoggedIn" @click="menuOpen = false" to="/admin" class="block py-1.5 hover:text-blue-600">后台管理</NuxtLink>
          <NuxtLink v-if="!isLoggedIn" @click="menuOpen = false" to="/admin/login" class="block py-1.5 hover:text-blue-600">登录</NuxtLink>
          <button v-if="isLoggedIn" @click="logout(); menuOpen = false" class="block py-1.5 hover:text-red-500 w-full text-left">退出</button>
        </div>
      </transition>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const isLoggedIn = ref(false)
const isDark = ref(false)
const menuOpen = ref(false)

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
  menuOpen.value = false
  navigateTo('/')
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
