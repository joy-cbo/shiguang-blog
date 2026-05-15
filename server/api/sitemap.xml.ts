// GET /api/sitemap.xml — 自动生成 sitemap
export default defineEventHandler(async (event) => {
  const db = getDB(event)
  const posts = await db.prepare(
    "SELECT slug, updated_at FROM posts WHERE status = 'published' AND deleted_at IS NULL ORDER BY updated_at DESC"
  ).all() as { results?: Array<{ slug: string; updated_at: string }> }

  const pages = await db.prepare('SELECT slug, updated_at FROM pages ORDER BY updated_at DESC')
    .all() as { results?: Array<{ slug: string; updated_at: string }> }

  const host = event.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  xml += `  <url><loc>${protocol}://${host}</loc><priority>1.0</priority></url>\n`

  for (const p of (posts.results || [])) {
    xml += `  <url><loc>${protocol}://${host}/posts/${p.slug}</loc><lastmod>${p.updated_at?.slice(0, 10)}</lastmod><priority>0.8</priority></url>\n`
  }
  for (const p of (pages.results || [])) {
    xml += `  <url><loc>${protocol}://${host}/page/${p.slug}</loc><lastmod>${p.updated_at?.slice(0, 10)}</lastmod><priority>0.6</priority></url>\n`
  }

  xml += '</urlset>'

  event.node.res.setHeader('Content-Type', 'application/xml')
  return xml
})
