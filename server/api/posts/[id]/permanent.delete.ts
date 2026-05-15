// DELETE /api/posts/:id/permanent — 永久删除文章
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`post-permanent-delete:${ip}`, 5, 60)
  const id = event.context?.params?.id as string
  const db = getDB(event)

  const post = await db.prepare('SELECT id FROM posts WHERE id = ?').bind(id).first()
  if (!post) throw createError({ statusCode: 404, message: '文章不存在' })

  await db.prepare('DELETE FROM post_tags WHERE post_id = ?').bind(id).run()
  await db.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
  return { success: true }
})
