// GET /api/pages — 独立页面列表（管理端，需认证）
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`pages:${ip}`, 20, 60)
  const db = getDB(event)
  const rows = await db.prepare('SELECT * FROM pages ORDER BY created_at DESC').all()
  return { pages: (rows as any).results || [] }
})
