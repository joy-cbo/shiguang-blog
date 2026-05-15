// 附件列表
import { requireAuth } from '~~/server/utils/auth'
export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = getDB(event)
  const rows = await db.prepare('SELECT * FROM attachments ORDER BY created_at DESC LIMIT 100').all()
  return { attachments: (rows as any).results || [] }
})
