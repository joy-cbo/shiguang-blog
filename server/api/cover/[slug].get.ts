// GET /api/cover/:slug — 自动生成文章封面 SVG（精美版：多阶渐变+几何装饰+排版优化）
export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug as string
  const db = getDB(event)

  const post = await db.prepare(
    'SELECT p.title, p.created_at, u.nickname, c.name as category_name FROM posts p LEFT JOIN users u ON p.author_id = u.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ? AND p.deleted_at IS NULL'
  ).bind(slug).first() as any

  if (!post) {
    throw createError({ statusCode: 404, message: '文章不存在' })
  }

  const title = post.title || '无标题'
  const date = post.created_at ? post.created_at.slice(0, 10) : ''
  const author = post.nickname || '匿名'
  const category = post.category_name || ''

  // 用标题生成一致性颜色
  let hash = 0
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  // 三阶渐变色（深→中→浅，同色系更有层次）
  const c1 = `hsl(${hue}, 55%, 42%)`
  const c2 = `hsl(${hue}, 50%, 38%)`
  const c3 = `hsl(${(hue + 15) % 360}, 45%, 32%)`

  // 标题自适应折行和字号
  const lines: string[] = []
  let line = ''
  for (const ch of title) {
    line += ch
    if (line.length >= 16) { lines.push(line); line = '' }
  }
  if (line) lines.push(line)
  const displayLines = lines.slice(0, 4)
  // 字号按行数自适应：1行用36，2行用32，3行用28，4行用24
  const fontSize = displayLines.length <= 1 ? 36 : displayLines.length === 2 ? 32 : displayLines.length === 3 ? 28 : 24
  const lineHeight = fontSize * 1.5
  const titleBlockHeight = displayLines.length * lineHeight
  const titleTop = 200 - titleBlockHeight / 2

  // 装饰圆的位置（基于标题 hash 的副值，保证同一篇文章一致）
  const hash2 = ((hash * 31) & 0x7fffffff) % 1000
  const circles = [
    { cx: 680, cy: 80, r: 140, opacity: 0.08 },                                                    // 右上大圆
    { cx: 100, cy: 340, r: 90, opacity: 0.06 },                                                     // 左下中圆
    { cx: 720, cy: 360, r: 60, opacity: 0.10 },                                                     // 右下小圆
    { cx: 40, cy: 60, r: 180, opacity: 0.04 },                                                      // 左上超大圆
    { cx: 350 + (hash2 % 200), cy: 160 + (hash2 % 180), r: 4 + (hash2 % 8), opacity: 0.35 },       // 随机亮点
    { cx: 550 - (hash2 % 150), cy: 300 - (hash2 % 120), r: 3 + (hash2 % 6), opacity: 0.30 },       // 随机亮点
  ]

  // 装饰斜线
  const diagOpacity = 0.05
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="50%" style="stop-color:${c2}"/>
      <stop offset="100%" style="stop-color:${c3}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.25)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0.05)"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/></filter>
    <filter id="softShadow"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.15)"/></filter>
    <!-- 点阵图案 -->
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>

  <!-- 背景 -->
  <rect width="800" height="420" fill="url(#bg)"/>
  <!-- 点阵纹理 -->
  <rect width="800" height="420" fill="url(#dots)"/>

  <!-- 装饰圆 -->
  ${circles.map(c => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="white" opacity="${c.opacity}"/>`).join('\n  ')}

  <!-- 装饰斜线 -->
  <line x1="0" y1="180" x2="800" y2="280" stroke="white" stroke-width="1" opacity="${diagOpacity}"/>
  <line x1="0" y1="220" x2="800" y2="320" stroke="white" stroke-width="0.5" opacity="${diagOpacity * 0.7}"/>

  <!-- 左侧装饰竖条 -->
  <rect x="0" y="0" width="6" height="420" fill="url(#accent)"/>

  <!-- 标题区域背景光晕 -->
  <rect x="48" y="${titleTop - 16}" width="704" height="${titleBlockHeight + 32}" rx="8" fill="rgba(0,0,0,0.12)"/>

  <!-- 标题文字 -->
  ${displayLines.map((l, i) =>
    `<text x="400" y="${titleTop + i * lineHeight + fontSize * 0.333}" text-anchor="middle" fill="white" font-size="${fontSize}" font-weight="700" font-family="'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif" filter="url(#shadow)" letter-spacing="2">${l}</text>`
  ).join('\n  ')}

  <!-- 底部信息区域 -->
  <g transform="translate(0, 310)">
    <!-- 分隔线 -->
    <line x1="200" y1="0" x2="600" y2="0" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <!-- 小菱形装饰点 -->
    <rect x="392" y="-4" width="16" height="8" rx="2" fill="rgba(255,255,255,0.5)" transform="rotate(45, 400, 0)"/>
    <!-- 作者 · 日期 -->
    <text x="400" y="32" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="13" font-family="sans-serif" font-weight="500" letter-spacing="1" filter="url(#softShadow)">${author} · ${date}</text>
    <!-- 站点名 -->
    <text x="400" y="58" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="10" font-family="sans-serif" letter-spacing="3">拾光博客</text>
  </g>

  <!-- 分类标签（左上角） -->
  ${category ? `<g transform="translate(28, 28)">
    <rect x="0" y="0" width="${category.length * 16 + 32}" height="28" rx="14" fill="rgba(255,255,255,0.18)"/>
    <text x="${(category.length * 16 + 32) / 2}" y="19" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="12" font-family="sans-serif" font-weight="500">${category}</text>
  </g>` : ''}

  <!-- 右下角几何装饰环 -->
  <circle cx="760" cy="380" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <circle cx="760" cy="380" r="15" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
</svg>`

  event.headers.set('Content-Type', 'image/svg+xml')
  event.headers.set('Cache-Control', 'public, max-age=86400')
  return svg
})
