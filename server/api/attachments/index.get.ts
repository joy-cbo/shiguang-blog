// 附件列表
import { requireAuth } from '~~/server/utils/auth'
import { checkRateLimit } from '~~/server/utils/rate-limit'
export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const ip = event.headers.get('x-forwarded-for') || ''
  if (ip) checkRateLimit(`attachments:${ip}`, 20, 60)
  const db = getDB(event)
  const rows = await db.prepare('SELECT * FROM attachments ORDER BY created_at DESC LIMIT 100').all()
  return { attachments: (rows as any).results || [] }
})
