// POST /api/visit — 记录访问（公开，速率限制）
import { checkRateLimit } from '~~/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
  const ip = event.headers.get('x-forwarded-for') || event.headers.get('x-real-ip') || ''
  if (ip) checkRateLimit(`visit:${ip}`, 30, 60)

  const db = getDB(event)
  const ua = event.headers.get('user-agent') || ''
  const body = await readBody(event).catch(() => ({})) as { url?: string; referer?: string }
  const visitedUrl = body.url || ''
  const referer = body.referer || event.headers.get('referer') || ''
  const cfCountry = event.headers.get('cf-ipcountry') || ''

  await db.prepare(
    'INSERT INTO visit_logs (ip, ip_region, visited_url, referer, user_agent) VALUES (?, ?, ?, ?, ?)'
  ).bind(ip, cfCountry, visitedUrl, referer, ua).run()

  return { success: true }
})
