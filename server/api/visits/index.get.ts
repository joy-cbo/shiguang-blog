// GET /api/visits — 访问列表（管理端）
import { requireAuth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = getDB(event)
  const q = getQuery(event)
  const page = Math.max(1, parseInt(q.page as string) || 1)
  const limit = Math.min(100, parseInt(q.limit as string) || 20)
  const offset = (page - 1) * limit

  const [visitsR, totalR] = await Promise.all([
    db.prepare('SELECT * FROM visit_logs ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(limit, offset).all(),
    db.prepare('SELECT COUNT(*) as cnt FROM visit_logs').first(),
  ])

  return {
    visits: (visitsR as any).results || [],
    total: (totalR as { cnt: number } | null)?.cnt ?? 0,
    page,
    totalPages: Math.ceil(((totalR as { cnt: number } | null)?.cnt ?? 0) / limit),
  }
})
