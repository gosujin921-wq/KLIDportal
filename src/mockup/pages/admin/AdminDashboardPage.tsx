import { Users, Download, MessageSquare, UserPlus } from 'lucide-react'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { exportRequests } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'

const STATS = [
  { label: '전체 회원', value: '1,284', icon: Users, sub: '+12 오늘' },
  { label: '오늘 다운로드 신청', value: '37', icon: Download, sub: '심사대기 8' },
  { label: '미답변 문의', value: '5', icon: MessageSquare, sub: '전체 23' },
  { label: '신규 가입', value: '12', icon: UserPlus, sub: '이번 주 84' },
]

const recentInquiries = [
  { title: '다운로드 승인 소요 기간 문의', user: '김연구', date: '2026-07-09', status: 'reviewing' as const },
  { title: '폴리곤 라벨 저장 오류 문의', user: '이개발', date: '2026-07-08', status: 'reviewing' as const },
  { title: '증강 배수별 결과 차이 문의', user: '박데이터', date: '2026-07-07', status: 'done' as const },
]

/** 관리자 대시보드 */
export function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">대시보드</h1>
      <p className="mt-1.5 text-base text-slate-500">포털 운영 현황을 한눈에 확인하세요.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <span className="flex size-8 items-center justify-center rounded-lg bg-cobalt-50 text-cobalt-600">
                <s.icon className="size-4" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* 최근 다운로드 신청 */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <p className="text-base font-bold text-slate-900">최근 다운로드 신청</p>
          </div>
          <ul className="divide-y divide-slate-50">
            {exportRequests.map((r) => (
              <li key={r.id} className="flex items-center gap-2.5 px-5 py-3">
                <EventBadge type={r.type} />
                <span className="flex-1 truncate text-base text-slate-700">{r.datasetTitle}</span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>

        {/* 최근 문의 */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <p className="text-base font-bold text-slate-900">최근 문의</p>
          </div>
          <ul className="divide-y divide-slate-50">
            {recentInquiries.map((q, i) => (
              <li key={i} className="flex items-center gap-2.5 px-5 py-3">
                <span className="flex-1 truncate text-base text-slate-700">{q.title}</span>
                <span className="text-sm text-slate-400">{q.user}</span>
                <span className="text-sm text-slate-400 tabular-nums">{formatDate(q.date)}</span>
                <span
                  className={
                    q.status === 'done'
                      ? 'rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700'
                      : 'rounded-full bg-cobalt-50 px-2.5 py-0.5 text-xs font-semibold text-cobalt-700'
                  }
                >
                  {q.status === 'done' ? '답변완료' : '미답변'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
