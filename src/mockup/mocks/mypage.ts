import { EVENT_TYPE_MAP, type EventTypeKey } from '@/components/domain/eventTypes'
import { DATASETS, datasetTimes, type DataKind, type TimeOfDay } from '@/mockup/mocks/datasets'

/** 마이페이지 목업 데이터 */

/**
 * 검색 조건 즐겨찾기 = 데이터셋(결과물)이 아니라 "검색 조건(query)"을 저장.
 * 데이터는 계속 들어오므로 결과 건수는 저장 시점 고정이 아니라 조회 시점에 실시간 계산한다.
 */
export interface SavedSearch {
  id: string
  name: string
  type?: EventTypeKey
  region?: string
  time?: TimeOfDay
  kind?: DataKind
}

export const savedSearches: SavedSearch[] = [
  { id: 'ss-1', name: '수도권 화재 야간', type: 'fire', region: '서울', time: '야간' },
  { id: 'ss-2', name: '강원 산불 전체', type: 'wildfire', region: '강원' },
  { id: 'ss-3', name: '교통사고 주간', type: 'traffic', time: '주간' },
  { id: 'ss-4', name: '침수 영상 데이터', type: 'flood', kind: '영상' },
]

/** 조건 요약칩용 라벨 배열 */
export function savedSummary(s: SavedSearch): string[] {
  const chips: string[] = []
  if (s.type) chips.push(EVENT_TYPE_MAP[s.type].label)
  if (s.region) chips.push(s.region)
  if (s.time) chips.push(s.time)
  if (s.kind) chips.push(s.kind)
  return chips
}

/** 검색 화면 진입 URL (마이페이지 → 검색 이동용) */
export function savedQuery(s: SavedSearch): string {
  const p = new URLSearchParams()
  if (s.type) p.set('type', s.type)
  if (s.region) p.set('region', s.region)
  if (s.time) p.set('time', s.time)
  if (s.kind) p.set('kind', s.kind)
  return `/search?${p.toString()}`
}

/** 현재 데이터 기준 실시간 결과 건수 (저장 시점 고정 아님) */
export function savedCount(s: SavedSearch): number {
  return DATASETS.filter((d) => {
    if (s.type && d.type !== s.type) return false
    if (s.region && d.region !== s.region) return false
    if (s.time && !datasetTimes(d.id).includes(s.time)) return false
    if (s.kind && !d.dataKinds.includes(s.kind)) return false
    return true
  }).length
}
