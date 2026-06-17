/**
 * 날짜·시각 공통 유틸. 화면 노출 날짜/시각은 반드시 이 함수만 사용.
 * toLocaleTimeString("ko-KR") 직접 사용 금지(오전/오후 표기 문제).
 */

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

/** 2026.06.12 */
export function formatDate(value: Date | string | number): string {
  const d = toDate(value)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

/** 2026.06.12 14:30 (24시간) */
export function formatDateTime(value: Date | string | number): string {
  const d = toDate(value)
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
