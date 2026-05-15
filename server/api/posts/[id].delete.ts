// DELETE /api/posts/:id — 软删除文章
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`post-delete:${ip}`, 10, 60)
  const id = event.context?.params?.id as string
  const db = getDB(event)

  const post = await db.prepare('SELECT id FROM posts WHERE id = ? AND deleted_at IS NULL').bind(id).first()
  if (!post) throw createError({ statusCode: 404, message: '文章不存在' })

  await db.prepare("UPDATE posts SET deleted_at = datetime('now') WHERE id = ?").bind(id).run()
  return { success: true }
})
