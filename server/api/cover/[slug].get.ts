     1|// GET /api/cover/:slug — 已废弃，封面改为静态文件 /cover/:slug.svg
     2|// 此路由保留做兜底：重定向到静态文件
     3|import { sendRedirect } from 'h3'
     4|
     5|export default defineEventHandler((event) => {
     6|  const slug = event.context.params?.slug as string
     7|  return sendRedirect(event, `/cover/${slug}.svg`, 301)
     8|})
     9|