/** 숫자·용량 포맷 유틸 */

/** 1240 → "1,240" */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/** 큰 수 축약: 380000 → "38만", 56000 → "5.6만" */
export function formatCompactKo(n: number): string {
  if (n >= 100_000_000) return `${trim(n / 100_000_000)}억`
  if (n >= 10_000) return `${trim(n / 10_000)}만`
  if (n >= 1_000) return `${trim(n / 1_000)}천`
  return formatNumber(n)
}

/** 바이트 → "1.2 GB" */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${trim(v)} ${units[i]}`
}

function trim(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
