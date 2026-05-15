// D1 数据库工具 — Cloudflare Pages 环境
import { createError } from 'h3'

export function getDB(event: any): D1Database {
  // Cloudflare Pages 环境下 D1 绑定可能在不同位置
  const env = event.context?.cloudflare?.env
  const ctx = event.context?.cloudflare?.ctx
  const cfEnv = (globalThis as any).__env__

  const db = (env?.DB || cfEnv?.DB || ctx?.env?.DB || (globalThis as any).DB) as D1Database

  if (!db) {
    // 调试：打印可用的绑定名
    const available = env ? Object.keys(env).join(', ') : 'none'
    throw createError({ statusCode: 500, message: `数据库未连接，请检查 D1 绑定。可用绑定：[${available}]` })
  }
  return db
}
