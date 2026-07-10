import { Link } from 'react-router-dom'
import { Download, PenTool, Sparkles, ChevronRight } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { EventBadge } from '@/mockup/components/ui/badges'
import { demoUser } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'

const SUMMARY = [
  { label: '다운로드 완료', value: 24, unit: '건', icon: Download, to: '/mypage/history' },
  { label: '저작 완료', value: 8, unit: '건', icon: PenTool, to: '/mypage/history' },
  { label: 'AI 사용·기여도', value: 340, unit: '점', icon: Sparkles, to: '/mypage/history' },
]

const RECENT_DOWNLOADS = [
  { title: '도심 건물 화재 감지 영상 데이터셋', type: 'fire' as const, date: '2026-07-06' },
  { title: '교차로 교통사고 감지 CCTV 학습데이터', type: 'traffic' as const, date: '2026-07-02' },
  { title: '하천변 침수 수위 감시 CCTV 학습데이터', type: 'flood' as const, date: '2026-06-28' },
]

/**
 * 마이페이지 대시보드 (기획 v2, DFEAT-026): 완료된 이용 이력의 cross-domain 요약 허브.
 * 워크스페이스 대시보드(진행중 관리)와 역할 구분. 즐겨찾기는 워크스페이스로 이동(v2).
 */
export function MyDashboardPage() {
  return (
    <>
      <Breadcrumb items={[{ label: '마이페이지', to: '/mypage' }, { label: '대시보드' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">대시보드</h1>
      <p className="mt-1.5 text-base text-slate-500">
        {demoUser.name} 님의 완료된 이용 내역을 한눈에 확인하세요.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SUMMARY.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="card-glow flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cobalt-200"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600">
              <s.icon className="size-5.5" />
            </span>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {s.value}
                <span className="ml-0.5 text-base font-bold text-slate-400">{s.unit}</span>
              </p>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 다운로드 */}
      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">최근 다운로드</h2>
          <Link
            to="/mypage/history"
            className="flex items-center gap-0.5 text-sm font-semibold text-cobalt-600 hover:underline"
          >
            전체보기 <ChevronRight className="size-4" />
          </Link>
        </div>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {RECENT_DOWNLOADS.map((d, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3.5">
              <EventBadge type={d.type} />
              <span className="flex-1 truncate font-medium text-slate-800">{d.title}</span>
              <span className="text-sm text-slate-400 tabular-nums">{formatDate(d.date)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 즐겨찾기 안내 (v2: 워크스페이스로 이동) */}
      <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        데이터·검색 조건 즐겨찾기는{' '}
        <Link to="/workspace/favorites" className="font-semibold text-cobalt-600 hover:underline">
          워크스페이스 &gt; 즐겨찾기
        </Link>
        에서 관리합니다.
      </p>
    </>
  )
}
