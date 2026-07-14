import { useState } from 'react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { EventBadge } from '@/mockup/components/ui/badges'
import { cn } from '@/lib/cn'

type TabKey = 'download' | 'authoring' | 'ai'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'download', label: '다운로드 내역' },
  { key: 'authoring', label: '저작 내역' },
  { key: 'ai', label: 'AI 사용 내역' },
]

const PERIODS = ['최근 1개월', '최근 3개월', '최근 6개월']

const downloadRows = [
  { title: '도심 건물 화재 감지 영상 데이터셋', type: 'fire' as const, applied: '2026.07.06', approved: '2026.07.07', status: '다운로드 완료', due: '2026.07.14' },
  { title: '교차로 교통사고 감지 CCTV 학습데이터', type: 'traffic' as const, applied: '2026.06.29', approved: '2026.06.30', status: '기한 만료', due: '2026.07.07' },
  { title: '하천변 침수 수위 감시 CCTV 학습데이터', type: 'flood' as const, applied: '2026.06.24', approved: '2026.06.25', status: '다운로드 완료', due: '2026.07.02' },
]

const authoringRows = [
  { title: 'CCTV-탄천변-006 침수 라벨링 결과', type: 'flood' as const, finished: '2026.07.04', frames: 52, objects: 96 },
  { title: 'CCTV-우면산-003 산사태 라벨링 결과', type: 'landslide' as const, finished: '2026.06.28', frames: 29, objects: 44 },
  { title: 'CCTV-역삼로-002 교통사고 라벨링 결과', type: 'traffic' as const, finished: '2026.06.19', frames: 44, objects: 187 },
]

const aiRows = [
  { kind: '증강', target: '침수 라벨링 결과 (4배)', type: 'flood' as const, date: '2026.07.09', result: '완료', score: 40 },
  { kind: '증강', target: '교통사고 라벨링 결과 (4배)', type: 'traffic' as const, date: '2026.06.24', result: '완료', score: 40 },
]

/** 이용 내역 조회: 콘텐츠 내부 3탭 */
export function HistoryPage() {
  const [tab, setTab] = useState<TabKey>('download')

  return (
    <>
      <Breadcrumb items={[{ label: '마이페이지', to: '/mypage' }, { label: '이용 내역 조회' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">이용 내역 조회</h1>

      {/* 내부 탭 */}
      <div className="mt-6 border-b border-slate-200">
        <nav className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                '-mb-px border-b-2 px-4 py-3 text-base font-semibold transition-colors',
                tab === t.key
                  ? 'border-cobalt-600 text-cobalt-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 기간 필터 */}
      <div className="mt-5 flex gap-2">
        {PERIODS.map((p, i) => (
          <button
            key={p}
            type="button"
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
              i === 1
                ? 'bg-cobalt-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:text-cobalt-700',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {tab === 'download' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">데이터셋</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">신청일</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">승인일</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">다운로드 기한</th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">상태</th>
              </tr>
            </thead>
            <tbody>
              {downloadRows.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <EventBadge type={r.type} />
                      <span className="font-medium text-slate-800">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">{r.applied}</td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">{r.approved}</td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">{r.due}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        r.status === '다운로드 완료'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'authoring' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">작업명</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">완료일</th>
                <th className="px-3 py-3 text-right font-medium">프레임</th>
                <th className="px-5 py-3 text-right font-medium">객체</th>
              </tr>
            </thead>
            <tbody>
              {authoringRows.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <EventBadge type={r.type} />
                      <span className="font-medium text-slate-800">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">{r.finished}</td>
                  <td className="px-3 py-3.5 text-right text-base text-slate-600 tabular-nums">{r.frames}</td>
                  <td className="px-5 py-3.5 text-right text-base text-slate-600 tabular-nums">{r.objects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'ai' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">구분</th>
                <th className="px-3 py-3 font-medium">대상</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">실행일</th>
                <th className="px-3 py-3 font-medium">결과</th>
                <th className="px-5 py-3 text-right font-medium whitespace-nowrap">기여도</th>
              </tr>
            </thead>
            <tbody>
              {aiRows.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-semibold text-slate-600">
                      {r.kind}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <EventBadge type={r.type} />
                      <span className="font-medium text-slate-800">{r.target}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">{r.date}</td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      {r.result}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-base font-semibold text-cobalt-700 tabular-nums">
                    +{r.score}점
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
