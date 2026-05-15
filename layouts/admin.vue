<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
    <aside class="w-56 bg-white dark:bg-gray-900 border-r dark:border-gray-800 min-h-screen p-4 flex flex-col">
      <NuxtLink to="/admin" class="text-lg font-bold mb-6 block">Blog 管理</NuxtLink>
      <nav class="flex-1 space-y-1 text-sm">
        <NuxtLink v-for="item in menu" :key="item.path" :to="item.path"
          class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600': route.path === item.path }">
          {{ item.label }}
        </NuxtLink>
      </nav>
      <NuxtLink to="/" class="text-xs text-gray-400 hover:text-blue-500 mt-4">← 返回前台</NuxtLink>
    </aside>
    <main class="flex-1 p-6">
      <h1 class="text-xl font-bold mb-4">{{ titleMap[String(route.path)] || '' }}</h1>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

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
