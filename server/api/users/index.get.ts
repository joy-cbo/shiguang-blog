// GET /api/users — 用户列表
import { requireAuth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = getDB(event)
  const rows = await db.prepare(
    'SELECT id, username, nickname, email, avatar, role, status, created_at FROM users ORDER BY id'
  ).all()

  return { users: (rows as any).results || [] }
})
