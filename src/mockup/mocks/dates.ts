import { formatDate } from '@/lib/datetime'

/**
 * 데모 상대 날짜 유틸.
 * 목업의 날짜·D-day는 하드코딩하면 시연 시점에 만료되어 보이므로,
 * 항상 열람 시점(오늘) 기준 오프셋으로 계산한다.
 */

function shift(offsetDays: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** MM.DD */
function monthDay(d: Date): string {
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

/** 오늘-days일의 ISO 날짜 (예: daysAgo(3) → '2026-07-09') */
export function daysAgo(days: number): string {
  const d = shift(-days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 다운로드·보관 기한 라벨 (예: dDay(6) → 'D-6 (07.18까지)') */
export function dDay(days: number): string {
  if (days <= 0) return `D-DAY (${monthDay(shift(0))}까지)`
  return `D-${days} (${monthDay(shift(days))}까지)`
}

/** 만료 라벨 (예: expiredAgo(12) → '만료 (06.30)') */
export function expiredAgo(days: number): string {
  return `만료 (${monthDay(shift(-days))})`
}

/** 연도 포함 보관 기한 라벨 (예: until(89) → '2026.10.09까지') */
export function until(days: number): string {
  return `${formatDate(shift(days))}까지`
}
