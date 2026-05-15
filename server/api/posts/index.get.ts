// GET /api/posts — 文章列表（公开，分页+筛选）
export default defineEventHandler(async (event) => {
  const db = getDB(event)
  const q = getQuery(event)
  const page = Math.max(1, parseInt(q.page as string) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(q.limit as string) || 10))
  const status = (q.status as string) || 'published'
  const category = q.category as string
  const tag = q.tag as string
  const search = q.search as string
  const offset = (page - 1) * limit

  let where: string
  const params: any[] = []

  if (status === 'deleted') {
    where = 'WHERE p.deleted_at IS NOT NULL'
  } else {
    where = 'WHERE p.deleted_at IS NULL'
    if (status !== 'all') { where += ' AND p.status = ?'; params.push(status) }
  }
  if (category) { where += ' AND c.slug = ?'; params.push(category) }
  if (tag) { where += ' AND t.slug = ?'; params.push(tag) }
  if (search) { where += ' AND (p.title LIKE ? OR p.content LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }

  const countRow = await db.prepare(`
    SELECT COUNT(DISTINCT p.id) as cnt FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${where}
  `).bind(...params).first() as { cnt: number } | null

  const total = countRow?.cnt ?? 0

  const rows = await db.prepare(`
    SELECT DISTINCT p.*, c.name as category_name, c.slug as category_slug,
      u.nickname as author_nickname, u.avatar as author_avatar
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_tags pt ON p.id = pt.post_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    ${where}
    ORDER BY p.is_pinned DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(...params, limit, offset).all() as { results?: any[] }

  const posts = rows.results || []

  // 批量查标签（消除 N+1）
  if (posts.length > 0) {
    const ids = posts.map((p: any) => p.id)
    const ph = ids.map(() => '?').join(',')
    const tagRows = await db.prepare(`
      SELECT pt.post_id, t.id, t.name, t.slug FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id IN (${ph})
    `).bind(...ids).all() as { results?: any[] }

    const tagMap: Record<number, any[]> = {}
    for (const r of (tagRows.results || [])) {
      (tagMap[r.post_id] ??= []).push({ id: r.id, name: r.name, slug: r.slug })
    }
    for (const p of posts) p.tags = tagMap[p.id] || []
  }

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
})
