import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Pencil, HeartOff } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { Modal } from '@/mockup/components/ui/Modal'
import { EventBadge } from '@/mockup/components/ui/badges'
import { POPULAR_DATASETS, type Dataset } from '@/mockup/mocks/datasets'
import { savedSearches, savedSummary, savedQuery, savedCount } from '@/mockup/mocks/mypage'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

type TabKey = 'datasets' | 'searches'

/** 조회수 mock (결정적) */
const views = (d: Dataset) => d.downloads * 3 + d.videoCount

/**
 * 워크스페이스 즐겨찾기 (기획 v2: 마이페이지→워크스페이스 이동, DFEAT-005).
 * 탭1 데이터: 리스트(번호·데이터유형·데이터명·구분·조회수) + 해제 시 컨펌 모달.
 * 탭2 검색 조건: 저장한 검색 조건 관리(자체 제안 유지). 퀵선택은 검색 화면에서.
 */
export function WsFavoritesPage() {
  const [tab, setTab] = useState<TabKey>('datasets')
  const [items, setItems] = useState(POPULAR_DATASETS.slice(0, 5))
  const [removeTarget, setRemoveTarget] = useState<Dataset | null>(null)

  return (
    <>
      <Breadcrumb items={[{ label: '워크스페이스', to: '/workspace' }, { label: '즐겨찾기' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">즐겨찾기</h1>
      <p className="mt-1.5 text-base text-slate-500">
        관심 데이터셋과 자주 쓰는 검색 조건을 모아 두고 바로 이용하세요.
      </p>

      {/* 탭 */}
      <div className="mt-6 border-b border-slate-200">
        <nav className="flex gap-1">
          {(
            [
              ['datasets', `데이터 (${items.length})`],
              ['searches', `검색 조건 (${savedSearches.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                '-mb-px border-b-2 px-4 py-3 text-base font-semibold transition-colors',
                tab === key
                  ? 'border-cobalt-600 text-cobalt-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'datasets' ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="w-16 px-5 py-3 font-medium">번호</th>
                <th className="w-32 px-3 py-3 font-medium">데이터유형</th>
                <th className="px-3 py-3 font-medium">데이터명</th>
                <th className="w-28 px-3 py-3 font-medium">구분</th>
                <th className="w-24 px-3 py-3 text-right font-medium">조회수</th>
                <th className="w-24 px-5 py-3 text-right font-medium">해제</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d, i) => (
                <tr key={d.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 text-sm text-slate-400 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{d.dataKinds.join('·')}</td>
                  <td className="px-3 py-3.5">
                    <Link
                      to={`/search/${d.id}`}
                      className="font-semibold text-slate-800 hover:text-cobalt-700 hover:underline"
                    >
                      {d.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3.5">
                    <EventBadge type={d.type} />
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm text-slate-600 tabular-nums">
                    {formatNumber(views(d))}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      aria-label="즐겨찾기 해제"
                      onClick={() => setRemoveTarget(d)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <HeartOff className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-base text-slate-400">
                    즐겨찾기한 데이터셋이 없습니다.{' '}
                    <Link to="/search" className="font-semibold text-cobalt-600 hover:underline">
                      데이터 검색하기
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {savedSearches.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-slate-900">{s.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {savedSummary(s).map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-sm text-slate-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-slate-400 tabular-nums">
                현재 {formatNumber(savedCount(s))}건
              </span>
              <div className="flex items-center gap-1">
                <Link
                  to={savedQuery(s)}
                  className="inline-flex items-center gap-1 rounded-full bg-cobalt-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-700"
                >
                  <Search className="size-3.5" />
                  검색
                </Link>
                <button
                  type="button"
                  aria-label="이름 변경"
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 즐겨찾기 해제 컨펌 (DFEAT-005) */}
      <Modal
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        title="즐겨찾기 해제"
      >
        <p className="text-base leading-relaxed text-slate-600">
          <strong className="text-slate-900">{removeTarget?.title}</strong>
          <br />
          이 데이터셋을 즐겨찾기에서 해제할까요?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setRemoveTarget(null)}>
            취소
          </Button>
          <Button
            onClick={() => {
              setItems((prev) => prev.filter((d) => d.id !== removeTarget?.id))
              setRemoveTarget(null)
            }}
          >
            해제
          </Button>
        </div>
      </Modal>
    </>
  )
}
