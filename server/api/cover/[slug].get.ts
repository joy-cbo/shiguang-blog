// GET /api/cover/:slug — 自动生成文章封面 SVG
export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug as string
  const db = getDB(event)

  const post = await db.prepare(
    'SELECT p.title, p.created_at, u.nickname FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.slug = ? AND p.deleted_at IS NULL'
  ).bind(slug).first() as any

  if (!post) {
    throw createError({ statusCode: 404, message: '文章不存在' })
  }

  const title = post.title || '无标题'
  const date = post.created_at ? post.created_at.slice(0, 10) : ''
  const author = post.nickname || '匿名'

  // 用标题生成一致性颜色
  let hash = 0
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  const hue2 = (hue + 40) % 360

  // 标题折行（每行最多 12 个中文字）
  const lines: string[] = []
  let line = ''
  for (const ch of title) {
    line += ch
    if (line.length >= 14) { lines.push(line); line = '' }
  }
  if (line) lines.push(line)
  const displayLines = lines.slice(0, 4)
  const lineHeight = 38
  const startY = 180 - ((displayLines.length - 1) * lineHeight) / 2

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},60%,45%)"/>
      <stop offset="100%" style="stop-color:hsl(${hue2},55%,35%)"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter>
  </defs>
  <rect width="800" height="420" fill="url(#bg)"/>
  <rect x="30" y="30" width="740" height="360" rx="12" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  ${displayLines.map((l, i) =>
    `<text x="400" y="${startY + i * lineHeight}" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="sans-serif" filter="url(#shadow)">${l}</text>`
  ).join('\n  ')}
  <text x="400" y="290" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="14" font-family="sans-serif">${author} · ${date}</text>
  <text x="400" y="360" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="11" font-family="sans-serif">blog.joy-cbo.com</text>
</svg>`

  event.headers.set('Content-Type', 'image/svg+xml')
  event.headers.set('Cache-Control', 'public, max-age=86400')
  return svg
})
