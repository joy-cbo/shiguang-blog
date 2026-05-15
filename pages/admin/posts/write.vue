<template>
  <NuxtLayout name="admin">
    <form @submit.prevent="save" class="space-y-4 max-w-3xl">
      <input v-model="title" placeholder="文章标题" class="w-full text-2xl font-bold border-0 border-b pb-2 focus:outline-none dark:bg-gray-900" required />
      <div class="flex gap-4 text-sm">
        <select v-model="status" class="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600">
          <option value="draft">草稿</option><option value="published">发布</option>
        </select>
        <input v-model="slug" placeholder="固定链接（可选）" class="border rounded px-2 py-1 flex-1 dark:bg-gray-800 dark:border-gray-600" />
        <input v-model="category" placeholder="分类（可选）" class="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600" />
      </div>
      <TipTapEditor v-model="content" />
      <div class="flex gap-2">
        <input v-model="tagInput" @keyup.enter.prevent="addTag" placeholder="标签（回车添加）" class="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600" />
        <div class="flex flex-wrap gap-1">
          <span v-for="(t, i) in tags" :key="i" class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs flex items-center gap-1">
            {{ t }} <button type="button" @click="tags.splice(i,1)" class="hover:text-red-500">×</button>
          </span>
        </div>
      </div>
      <p v-if="savedHint" class="text-green-500 text-xs">草稿已自动保存 {{ savedHint }}</p>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
      <button type="submit" :disabled="saving" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {{ saving ? '保存中...' : '发布文章' }}
      </button>
    </form>
  </NuxtLayout>
</template>

<script setup lang="ts">
const title = ref('')
const content = ref('')
const slug = ref('')
const status = ref('draft')
const category = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const error = ref('')
const saving = ref(false)
const savedHint = ref('')

// 草稿自动保存
const draft = useAutoSave('new')
let autoSaveTimer: ReturnType<typeof setInterval>

onMounted(() => {
  const data = draft.load()
  if (data) {
    title.value = data.title || ''
    content.value = data.content || ''
    slug.value = data.slug || ''
    status.value = data.status || 'draft'
    tags.value = data.tags || []
    category.value = data.category || ''
  }
  autoSaveTimer = setInterval(() => {
    draft.save({
      title: title.value, content: content.value, slug: slug.value,
      status: status.value, tags: tags.value, category: category.value
    })
    const now = new Date()
    savedHint.value = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
    setTimeout(() => { savedHint.value = '' }, 2000)
  }, 30000)
})

onUnmounted(() => clearInterval(autoSaveTimer))

function addTag() {
  const t = tagInput.value.trim()
  if (t && !tags.value.includes(t)) tags.value.push(t)
  tagInput.value = ''
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: { title: title.value, content: content.value, slug: slug.value || undefined, status: status.value, tags: tags.value.length ? tags.value : undefined },
      headers: { Authorization: 'Bearer ' + (localStorage.getItem('auth_token') || '') },
    })
    draft.clear()
    navigateTo('/admin/posts')
  } catch (e: any) {
    error.value = e?.data?.message || '保存失败'
  } finally { saving.value = false }
}
</script>
