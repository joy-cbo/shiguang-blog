<template>
  <NuxtLayout name="admin">
    <form @submit.prevent="save" class="space-y-4 max-w-lg">
      <div><label class="text-sm text-gray-500 block mb-1">站点标题</label><input v-model="form.site_title" class="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600" /></div>
      <div><label class="text-sm text-gray-500 block mb-1">站点副标题</label><input v-model="form.site_subtitle" class="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600" /></div>
      <div><label class="text-sm text-gray-500 block mb-1">站点描述</label><textarea v-model="form.site_description" rows="3" class="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600"></textarea></div>
      <div><label class="text-sm text-gray-500 block mb-1">底部信息</label><input v-model="form.footer_info" class="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600" /></div>
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">保存设置</button>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
const form = reactive({
  site_title: '', site_subtitle: '', site_description: '', footer_info: '',
})

onMounted(async () => {
  const data = await $fetch<Record<string, string>>('/api/settings')
  Object.assign(form, data)
})

async function save() {
  await $fetch('/api/settings', { method: 'PUT', body: form, headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') } })
}
</script>
