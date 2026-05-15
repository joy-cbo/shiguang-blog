// GET /api/social-links — 社交链接（公开）
export default defineEventHandler(async (event) => {
  const db = getDB(event)
  const rows = await db.prepare('SELECT * FROM social_links WHERE visible = 1 ORDER BY sort_order').all()
  return { socialLinks: (rows as any).results || [] }
})
