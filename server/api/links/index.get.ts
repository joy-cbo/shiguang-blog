// GET /api/links — 友链列表（公开）
export default defineEventHandler(async (event) => {
  const db = getDB(event)
  const rows = await db.prepare('SELECT * FROM links ORDER BY sort_order').all()
  return { links: (rows as any).results || [] }
})
