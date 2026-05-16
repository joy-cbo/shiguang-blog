// GET /api/users — 用户列表
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`users:${ip}`, 20, 60)
  const db = getDB(event)
  const rows = await db.prepare(
    'SELECT id, username, nickname, email, avatar, role, status, created_at FROM users ORDER BY id'
  ).all()

  return { users: (rows as any).results || [] }
})
