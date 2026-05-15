// 诊断接口 — 检查环境变量和绑定
export default defineEventHandler(async (event) => {
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
