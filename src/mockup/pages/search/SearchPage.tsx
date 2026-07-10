import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bookmark, Check, RotateCcw, Search, SearchX, Star, X } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { DatasetCard } from '@/mockup/components/DatasetCard'
import { EVENT_TYPES_MAIN, type EventTypeKey } from '@/components/domain/eventTypes'
import {
  DATASETS,
  REGIONS,
  TIME_OF_DAY,
  DATA_SOURCES,
  datasetTimes,
  datasetSource,
  type DataKind,
  type TimeOfDay,
  type DataSource,
} from '@/mockup/mocks/datasets'
import { savedSearches, savedSummary, type SavedSearch } from '@/mockup/mocks/mypage'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

type SortKey = 'latest' | 'downloads' | 'name'
const SORT_LABEL: Record<SortKey, string> = {
  latest: '최신순',
  downloads: '다운로드순',
  name: '이름순',
}
const PAGE_SIZE = 9
const ALL_KINDS: DataKind[] = ['영상', '이미지', '라벨']

/** 학습데이터 검색·목록. ?type= 으로 진입 시 해당 유형 필터 적용 상태로 시작. */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialType = searchParams.get('type') as EventTypeKey | null
  const initialTime = searchParams.get('time') as TimeOfDay | null
  const initialKind = searchParams.get('kind') as DataKind | null

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [appliedQuery, setAppliedQuery] = useState(query)
  const [types, setTypes] = useState<Set<EventTypeKey>>(
    () => new Set(initialType ? [initialType] : []),
  )
  const [region, setRegion] = useState(searchParams.get('region') ?? '전체')
  const [times, setTimes] = useState<Set<TimeOfDay>>(
    () => new Set(initialTime ? [initialTime] : []),
  )
  const [kinds, setKinds] = useState<Set<DataKind>>(
    () => new Set(initialKind ? [initialKind] : []),
  )
  const [sources, setSources] = useState<Set<DataSource>>(new Set())
  const [saved, setSaved] = useState(false)
  const [sort, setSort] = useState<SortKey>('latest')
  const [page, setPage] = useState(1)

  const results = useMemo(() => {
    let list = DATASETS.filter((d) => {
      if (types.size > 0 && !types.has(d.type)) return false
      if (region !== '전체' && d.region !== region) return false
      if (times.size > 0 && !datasetTimes(d.id).some((t) => times.has(t))) return false
      if (kinds.size > 0 && ![...kinds].every((k) => d.dataKinds.includes(k))) return false
      if (sources.size > 0 && !sources.has(datasetSource(d.id))) return false
      if (appliedQuery && !d.title.includes(appliedQuery)) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'downloads') return b.downloads - a.downloads
      if (sort === 'name') return a.title.localeCompare(b.title, 'ko')
      return b.updatedAt.localeCompare(a.updatedAt)
    })
    return list
  }, [types, region, times, kinds, sources, appliedQuery, sort])

  // 조건이 바뀌면 저장 버튼 상태 초기화
  useEffect(() => {
    setSaved(false)
  }, [types, region, times, kinds, sources, appliedQuery])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleType = (key: EventTypeKey) => {
    setTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
    setPage(1)
  }

  const toggleKind = (kind: DataKind) => {
    setKinds((prev) => {
      const next = new Set(prev)
      if (next.has(kind)) {
        next.delete(kind)
      } else {
        next.add(kind)
      }
      return next
    })
    setPage(1)
  }

  const toggleTime = (t: TimeOfDay) => {
    setTimes((prev) => {
      const next = new Set(prev)
      if (next.has(t)) {
        next.delete(t)
      } else {
        next.add(t)
      }
      return next
    })
    setPage(1)
  }

  const toggleSource = (s: DataSource) => {
    setSources((prev) => {
      const next = new Set(prev)
      if (next.has(s)) {
        next.delete(s)
      } else {
        next.add(s)
      }
      return next
    })
    setPage(1)
  }

  const resetAll = () => {
    setTypes(new Set())
    setRegion('전체')
    setTimes(new Set())
    setKinds(new Set())
    setSources(new Set())
    setQuery('')
    setAppliedQuery('')
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  // 내 검색조건 퀵선택: 저장한 조건을 필터에 바로 적용
  const applyCondition = (s: SavedSearch) => {
    setTypes(new Set(s.type ? [s.type] : []))
    setRegion(s.region ?? '전체')
    setTimes(new Set(s.time ? [s.time] : []))
    setKinds(new Set(s.kind ? [s.kind] : []))
    setQuery('')
    setAppliedQuery('')
    setPage(1)
  }

  const hasFilter =
    types.size > 0 ||
    region !== '전체' ||
    times.size > 0 ||
    kinds.size > 0 ||
    sources.size > 0 ||
    appliedQuery !== ''

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: '학습데이터' }]} />

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        학습데이터 검색
      </h1>
      <p className="mt-2 text-base text-slate-500">
        재난·안전 CCTV 영상 기반 AI 학습데이터를 검색하고 다운로드를 신청하세요.
      </p>

      {/* 검색바 */}
      <form
        className="mt-6 flex max-w-2xl items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          setAppliedQuery(query.trim())
          setPage(1)
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="데이터셋명, 키워드로 검색"
            className="h-12 w-full rounded-full border border-slate-300 bg-white pr-4 pl-11 text-base text-slate-900 placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
          />
        </div>
        <Button type="submit" className="h-12 px-6">
          검색
        </Button>
      </form>

      {/* 내 검색조건 퀵선택 (마이페이지에서 관리) */}
      {savedSearches.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
            <Star className="size-3.5 fill-cobalt-500 text-cobalt-500" />
            내 검색조건
          </span>
          {savedSearches.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => applyCondition(s)}
              title={savedSummary(s).join(' · ')}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-cobalt-200 hover:bg-cobalt-50 hover:text-cobalt-700"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* 상단 필터 바: 핵심 조건(이벤트 유형)을 색 칩으로 전면 노출, 보조 조건은 아랫줄 */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        {/* 이벤트 유형 (핵심) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTypes(new Set())
              setPage(1)
            }}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors',
              types.size === 0
                ? 'border-cobalt-300 bg-cobalt-50 text-cobalt-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
            )}
          >
            전체
          </button>
          {EVENT_TYPES_MAIN.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleType(t.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors',
                types.has(t.key)
                  ? 'border-cobalt-300 bg-cobalt-50 text-cobalt-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: `var(--color-event-${t.key})` }}
              />
              {t.label}
            </button>
          ))}
        </div>

        {/* 보조 조건 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold whitespace-nowrap text-slate-500">지역</span>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setPage(1)
              }}
              className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 focus:border-cobalt-400 focus:outline-none"
            >
              <option>전체</option>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <SubFilter
            label="시간대"
            options={TIME_OF_DAY}
            isOn={(t) => times.has(t as TimeOfDay)}
            onToggle={(t) => toggleTime(t as TimeOfDay)}
          />
          <SubFilter
            label="데이터 구성"
            options={ALL_KINDS}
            isOn={(k) => kinds.has(k as DataKind)}
            onToggle={(k) => toggleKind(k as DataKind)}
          />
          {/* 출처 (DFEAT-001): 시스템 제공 데이터셋 대상 */}
          <SubFilter
            label="출처"
            options={DATA_SOURCES}
            isOn={(s) => sources.has(s as DataSource)}
            onToggle={(s) => toggleSource(s as DataSource)}
          />
        </div>
      </div>

      {/* 결과 */}
      <div className="mt-6">
          {/* 적용 필터 칩 */}
          {hasFilter && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {appliedQuery && (
                <FilterChip
                  label={`"${appliedQuery}"`}
                  onRemove={() => {
                    setAppliedQuery('')
                    setQuery('')
                    setPage(1)
                  }}
                />
              )}
              {[...types].map((key) => (
                <FilterChip
                  key={key}
                  label={EVENT_TYPES_MAIN.find((t) => t.key === key)?.label ?? key}
                  onRemove={() => toggleType(key)}
                />
              ))}
              {region !== '전체' && (
                <FilterChip
                  label={region}
                  onRemove={() => {
                    setRegion('전체')
                    setPage(1)
                  }}
                />
              )}
              {[...times].map((t) => (
                <FilterChip key={t} label={t} onRemove={() => toggleTime(t)} />
              ))}
              {[...kinds].map((k) => (
                <FilterChip key={k} label={k} onRemove={() => toggleKind(k)} />
              ))}
              {[...sources].map((s) => (
                <FilterChip key={s} label={s} onRemove={() => toggleSource(s)} />
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="ml-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
              >
                <RotateCcw className="size-3.5" />
                초기화
              </button>
            </div>
          )}

          <div className="mb-5 flex items-center justify-between">
            <p className="text-base text-slate-600">
              전체{' '}
              <strong className="font-bold text-cobalt-700 tabular-nums">
                {formatNumber(results.length)}
              </strong>
              건
            </p>
            <div className="flex items-center gap-2">
              {/* 검색 조건 즐겨찾기 저장 (마이페이지에서 관리) */}
              {hasFilter && (
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  disabled={saved}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cobalt-200 bg-white px-3 text-sm font-semibold text-cobalt-700 transition-colors hover:bg-cobalt-50 disabled:border-slate-200 disabled:text-slate-400"
                >
                  {saved ? (
                    <>
                      <Check className="size-4" />
                      저장됨
                    </>
                  ) : (
                    <>
                      <Bookmark className="size-4" />
                      이 조건 저장
                    </>
                  )}
                </button>
              )}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 focus:border-cobalt-400 focus:outline-none"
                aria-label="정렬"
              >
                {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
                  <option key={k} value={k}>
                    {SORT_LABEL[k]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {pageItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((d) => (
                <DatasetCard key={d.id} dataset={d} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 py-20 text-center">
              <SearchX className="size-10 text-slate-300" />
              <p className="mt-4 text-lg font-bold text-slate-700">검색 결과가 없습니다</p>
              <p className="mt-1.5 text-base text-slate-500">
                검색 조건을 줄이거나 다른 키워드로 검색해 보세요.
              </p>
              <Button variant="secondary" size="sm" className="mt-5" onClick={resetAll}>
                <RotateCcw className="size-4" />
                필터 초기화
              </Button>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav aria-label="페이지" className="mt-10 flex items-center justify-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(
                    'size-9 rounded-lg text-sm font-semibold transition-colors',
                    p === page
                      ? 'bg-cobalt-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}
      </div>
    </Container>
  )
}

/** 보조 조건 그룹 (라벨 + 토글 칩) */
function SubFilter({
  label,
  options,
  isOn,
  onToggle,
}: {
  label: string
  options: readonly string[]
  isOn: (v: string) => boolean
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm font-semibold whitespace-nowrap text-slate-500">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors',
              isOn(o)
                ? 'border-cobalt-300 bg-cobalt-50 text-cobalt-700'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-cobalt-200 bg-cobalt-50 py-1 pr-1.5 pl-3 text-sm font-medium text-cobalt-700">
      {label}
      <button
        type="button"
        aria-label={`${label} 필터 제거`}
        onClick={onRemove}
        className="inline-flex size-5 items-center justify-center rounded-full transition-colors hover:bg-cobalt-100"
      >
        <X className="size-3.5" />
      </button>
    </span>
  )
}
