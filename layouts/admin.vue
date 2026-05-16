<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <!-- 桌面端侧边栏 -->
    <aside class="hidden lg:flex w-56 bg-white dark:bg-gray-900 border-r dark:border-gray-800 min-h-screen p-4 flex-col fixed left-0 top-0 bottom-0 z-40">
      <NuxtLink to="/admin" class="text-lg font-bold mb-6 block">Blog 管理</NuxtLink>
      <nav class="flex-1 space-y-1 text-sm overflow-auto">
        <NuxtLink v-for="item in menu" :key="item.path" :to="item.path"
          class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600': route.path === item.path }">
          {{ item.label }}
        </NuxtLink>
      </nav>
      <NuxtLink to="/" class="text-xs text-gray-400 hover:text-blue-500 mt-4">← 返回前台</NuxtLink>
    </aside>

    <!-- 移动端顶部栏 -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-12 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center px-4 z-40">
      <button @click="sidebarOpen = !sidebarOpen" class="text-xl mr-3" aria-label="菜单">☰</button>
      <NuxtLink to="/admin" class="font-bold text-sm">Blog 管理</NuxtLink>
    </div>

    <!-- 移动端侧边栏遮罩 -->
    <div v-if="sidebarOpen" class="lg:hidden fixed inset-0 bg-black/50 z-40" @click="sidebarOpen = false"></div>

    <!-- 移动端侧边栏滑出 -->
    <transition name="sidebar">
      <aside v-if="sidebarOpen" class="lg:hidden fixed left-0 top-0 bottom-0 w-56 bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4 z-50 overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <NuxtLink to="/admin" class="text-lg font-bold" @click="sidebarOpen = false">Blog 管理</NuxtLink>
          <button @click="sidebarOpen = false" class="text-xl">✕</button>
        </div>
        <nav class="space-y-1 text-sm">
          <NuxtLink v-for="item in menu" :key="item.path" :to="item.path"
            class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600': route.path === item.path }"
            @click="sidebarOpen = false">
            {{ item.label }}
          </NuxtLink>
        </nav>
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-blue-500 mt-4 block">← 返回前台</NuxtLink>
      </aside>
    </transition>

    <!-- 主内容区 -->
    <main class="flex-1 p-6 lg:ml-56 mt-12 lg:mt-0">
      <h1 class="text-xl font-bold mb-4">{{ titleMap[String(route.path)] || '' }}</h1>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const menu = [
  { label: '仪表盘', path: '/admin' },
  { label: '文章管理', path: '/admin/posts' },
  { label: '写文章', path: '/admin/posts/write' },
  { label: '分类管理', path: '/admin/categories' },
  { label: '标签管理', path: '/admin/tags' },
  { label: '页面管理', path: '/admin/pages' },
  { label: '友链管理', path: '/admin/links' },
  { label: '媒体库', path: '/admin/media' },
  { label: '回收站', path: '/admin/trash' },
  { label: '访问记录', path: '/admin/visits' },
  { label: '用户管理', path: '/admin/users' },
  { label: '站点设置', path: '/admin/settings' },
  { label: '个人资料', path: '/admin/profile' },
]

const titleMap: Record<string, string> = {
  '/admin': '仪表盘',
  '/admin/posts': '文章管理',
  '/admin/posts/write': '写文章',
  '/admin/categories': '分类管理',
  '/admin/tags': '标签管理',
  '/admin/pages': '页面管理',
  '/admin/links': '友链管理',
  '/admin/media': '媒体库',
  '/admin/trash': '回收站',
  '/admin/visits': '访问记录',
  '/admin/users': '用户管理',
  '/admin/settings': '站点设置',
  '/admin/profile': '个人资料',
}
</script>

<style scoped>
.sidebar-enter-active, .sidebar-leave-active {
  transition: transform 0.25s ease;
}
.sidebar-enter-from, .sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
