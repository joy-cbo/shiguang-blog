// XSS 消毒 composable（前端用）
export function useSanitize() {
  function sanitize(input: string): string {
    if (!input) return ''
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript\s*:/gi, '')
  }
  return { sanitize }
}
