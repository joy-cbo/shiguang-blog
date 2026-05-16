// 诊断接口 — 仅管理员可访问
import { requireAuth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const cf = (event.context as any)?.cloudflare
  const env = cf?.env
  const ctx = cf?.ctx
  const globalEnv = (globalThis as any).__env__
  const globalDB = (globalThis as any).DB

  return {
    hasCloudflareContext: !!cf,
    envKeys: env ? Object.keys(env) : [],
    hasGlobalEnv: !!globalEnv,
    globalEnvKeys: globalEnv ? Object.keys(globalEnv) : [],
    hasGlobalDB: !!globalDB,
    ctxEnvKeys: ctx?.env ? Object.keys(ctx.env) : [],
  }
})
