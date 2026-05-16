// GET /api/stats — 仪表盘统计（需认证）
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`stats:${ip}`, 20, 60)
  const db = getDB(event)
  const today = new Date().toISOString().slice(0, 10)

  const [postsR, pubR, draftR, catsR, tagsR, pagesR, linksR, attR, usersR, todayV, totalV] = await Promise.all([
    db.prepare('SELECT COUNT(*) as cnt FROM posts WHERE deleted_at IS NULL').first(),
    db.prepare("SELECT COUNT(*) as cnt FROM posts WHERE deleted_at IS NULL AND status = 'published'").first(),
    db.prepare("SELECT COUNT(*) as cnt FROM posts WHERE deleted_at IS NULL AND status = 'draft'").first(),
    db.prepare('SELECT COUNT(*) as cnt FROM categories').first(),
    db.prepare('SELECT COUNT(*) as cnt FROM tags').first(),
    db.prepare('SELECT COUNT(*) as cnt FROM pages').first(),
    db.prepare('SELECT COUNT(*) as cnt FROM links').first(),
    db.prepare('SELECT COUNT(*) as cnt FROM attachments').first(),
    db.prepare('SELECT COUNT(*) as cnt FROM users').first(),
    db.prepare("SELECT COUNT(*) as cnt FROM visit_logs WHERE date(created_at) = ?").bind(today).first(),
    db.prepare('SELECT COUNT(*) as cnt FROM visit_logs').first(),
  ])

  const c = (r: unknown) => (r as { cnt: number } | null)?.cnt ?? 0

  return {
    stats: {
      posts: c(postsR), postsPublished: c(pubR), postsDraft: c(draftR),
      categories: c(catsR), tags: c(tagsR), pages: c(pagesR),
      links: c(linksR), attachments: c(attR), users: c(usersR),
      todayVisits: c(todayV), totalVisits: c(totalV),
    },
  }
})
