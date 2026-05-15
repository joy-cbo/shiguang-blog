// 日期格式化 composable
export function useFormat() {
  function formatDate(date: string | Date, fmt = 'yyyy-MM-dd'): string {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    const map: Record<string, string> = {
      yyyy: String(d.getFullYear()),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      dd: String(d.getDate()).padStart(2, '0'),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
    }
    return fmt.replace(/yyyy|MM|dd|HH|mm/g, m => map[m])
  }

  function stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '') || ''
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}天前`
    return formatDate(date)
  }

  return { formatDate, stripHtml, timeAgo }
}
