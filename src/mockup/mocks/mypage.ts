import { EVENT_TYPE_MAP, type EventTypeKey } from '@/mockup/domain/eventTypes'
import {
  DATASETS,
  datasetTimes,
  datasetSource,
  type DataKind,
  type TimeOfDay,
  type DataSource,
} from '@/mockup/mocks/datasets'

/** 마이페이지 목업 데이터 */

/**
 * 검색 조건 즐겨찾기 = 데이터셋(결과물)이 아니라 "검색 조건(query)"을 저장.
 * 검색 화면의 다중 선택(이벤트 유형·시간대·데이터 구성·출처)을 그대로 담는다.
 * 데이터는 계속 들어오므로 결과 건수는 저장 시점 고정이 아니라 조회 시점에 실시간 계산한다.
 */
export interface SavedSearch {
  id: string
  name: string
  types: EventTypeKey[]
  region?: string
  times: TimeOfDay[]
  kinds: DataKind[]
  sources: DataSource[]
  query?: string
}

/** 조건 없이 만든 빈 초안 (필드 채워서 사용) */
export function emptySavedSearch(): Omit<SavedSearch, 'id' | 'name'> {
  return { types: [], region: undefined, times: [], kinds: [], sources: [], query: undefined }
}

/** 초기 시드 (스토어 SavedSearchProvider 가 상태로 관리) */
export const savedSearchSeed: SavedSearch[] = [
  { id: 'ss-1', name: '수도권 화재 야간', types: ['fire'], region: '서울', times: ['야간'], kinds: [], sources: [] },
  { id: 'ss-2', name: '강원 산불 전체', types: ['wildfire'], region: '강원', times: [], kinds: [], sources: [] },
  { id: 'ss-3', name: '교통사고 주간', types: ['traffic'], times: ['주간'], kinds: [], sources: [] },
  { id: 'ss-4', name: '침수 영상 데이터', types: ['flood'], times: [], kinds: ['영상'], sources: [] },
]

/** 조건 요약칩용 라벨 배열 */
export function savedSummary(s: Pick<SavedSearch, 'types' | 'region' | 'times' | 'kinds' | 'sources' | 'query'>): string[] {
  const chips: string[] = []
  s.types.forEach((t) => chips.push(EVENT_TYPE_MAP[t].label))
  if (s.region) chips.push(s.region)
  s.times.forEach((t) => chips.push(t))
  s.kinds.forEach((k) => chips.push(k))
  s.sources.forEach((src) => chips.push(src))
  if (s.query) chips.push(`"${s.query}"`)
  return chips
}

/** 조건 요약을 사람이 읽는 이름으로 (자동 저장 시 기본 이름) */
export function autoSavedName(s: Pick<SavedSearch, 'types' | 'region' | 'times' | 'kinds' | 'sources' | 'query'>): string {
  const chips = savedSummary(s)
  return chips.length > 0 ? chips.join(' · ') : '검색 조건'
}

/** 두 조건이 사실상 같은지 (중복 저장 방지용 시그니처) */
export function savedSignature(s: Pick<SavedSearch, 'types' | 'region' | 'times' | 'kinds' | 'sources' | 'query'>): string {
  const sortJoin = (arr: readonly string[]) => [...arr].sort().join(',')
  return [
    sortJoin(s.types),
    s.region ?? '',
    sortJoin(s.times),
    sortJoin(s.kinds),
    sortJoin(s.sources),
    s.query ?? '',
  ].join('|')
}

/** 검색 화면 진입 URL (마이페이지 → 검색 이동용). 다중 값은 쉼표로 인코딩. */
export function savedQuery(s: SavedSearch): string {
  const p = new URLSearchParams()
  if (s.types.length) p.set('type', s.types.join(','))
  if (s.region) p.set('region', s.region)
  if (s.times.length) p.set('time', s.times.join(','))
  if (s.kinds.length) p.set('kind', s.kinds.join(','))
  if (s.sources.length) p.set('source', s.sources.join(','))
  if (s.query) p.set('q', s.query)
  return `/search?${p.toString()}`
}

/** 현재 데이터 기준 실시간 결과 건수 (저장 시점 고정 아님) */
export function savedCount(s: SavedSearch): number {
  return DATASETS.filter((d) => {
    if (s.types.length && !s.types.includes(d.type)) return false
    if (s.region && d.region !== s.region) return false
    if (s.times.length && !datasetTimes(d.id).some((t) => s.times.includes(t))) return false
    if (s.kinds.length && !s.kinds.every((k) => d.dataKinds.includes(k))) return false
    if (s.sources.length && !s.sources.includes(datasetSource(d.id))) return false
    if (s.query && !d.title.includes(s.query)) return false
    return true
  }).length
}
