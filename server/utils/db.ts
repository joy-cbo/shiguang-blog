// D1 数据库工具 — Cloudflare Pages 环境
// getDB 会被 Nuxt/Nitro 自动导入为全局函数

import { createError } from 'h3'

export function getDB(event: any): D1Database {
  const db = (event.context?.cloudflare?.env?.DB || (globalThis as any).__D1__) as D1Database
  if (!db) {
    throw createError({ statusCode: 500, message: '数据库未连接，请检查 D1 绑定' })
  }
  return db
}
