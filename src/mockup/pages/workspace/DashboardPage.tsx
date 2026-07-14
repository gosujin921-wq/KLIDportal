import { Link } from 'react-router-dom'
import { Download, Upload, PenTool, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { uploads, demoUser } from '@/mockup/mocks/workspace'
import { useDemoWorkspace } from '@/mockup/demoWorkspace'
import { formatDate } from '@/lib/datetime'

/** 워크스페이스 대시보드: 진행중 작업 허브 (완료 이력은 마이페이지) */
export function DashboardPage() {
  const { exportRequests, workJobs, downloadExport } = useDemoWorkspace()
  const uploading = uploads.filter((u) => u.status === 'inProgress').length
  const activeJobs = workJobs.filter((j) => j.status === 'inProgress' || j.status === 'waiting')

  const SUMMARY: { label: string; value: number; icon: typeof Download; to?: string }[] = [
    {
      // 이 페이지 아래 표가 곧 상세라 링크 없음 (자기참조 방지)
      label: '진행중 다운로드',
      value: exportRequests.length,
      icon: Download,
    },
    { label: '업로드 처리중', value: uploading, icon: Upload, to: '/workspace/upload' },
    {
      label: '저작·증강 작업',
      value: workJobs.length,
      icon: PenTool,
      to: '/workspace/authoring',
    },
  ]

  return (
    <>
      <Breadcrumb items={[{ label: '워크스페이스', to: '/workspace' }, { label: '대시보드' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">대시보드</h1>
      <p className="mt-1.5 text-base text-slate-500">
        {demoUser.name} 님, 진행중인 작업을 한눈에 확인하세요.
      </p>

      {/* 요약 카드 */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SUMMARY.map((s) => {
          const body = (
            <>
              <span className="flex size-9 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600">
                <s.icon className="size-4.5" />
              </span>
              <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
            </>
          )
          return s.to ? (
            <Link
              key={s.label}
              to={s.to}
              className="card-soft rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cobalt-200"
            >
              {body}
            </Link>
          ) : (
            <div key={s.label} className="card-soft rounded-2xl border border-slate-200 bg-white p-5">
              {body}
            </div>
          )
        })}
      </div>

      {/* 진행중 다운로드 */}
      <section className="mt-9">
        <SectionHeader title="진행중 다운로드" />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">데이터셋</th>
                <th className="px-3 py-3 font-medium">신청일</th>
                <th className="px-3 py-3 font-medium">상태</th>
                <th className="px-3 py-3 font-medium">다운로드 기한</th>
                <th className="px-5 py-3 text-right font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {exportRequests.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <EventBadge type={r.type} />
                      <Link
                        to={`/search/${r.datasetId}`}
                        className="truncate text-base font-semibold text-slate-800 hover:text-cobalt-700 hover:underline"
                      >
                        {r.datasetTitle}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {formatDate(r.requestedAt)}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap tabular-nums">
                    {r.dueLabel ? (
                      <span
                        className={
                          r.status === 'expiring'
                            ? 'font-semibold text-amber-600'
                            : 'text-slate-600'
                        }
                      >
                        {r.dueLabel}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {r.downloaded ? (
                      <span className="inline-flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                          <CheckCircle2 className="size-3.5" />
                          다운로드 완료
                        </span>
                        <Link
                          to="/workspace/augment"
                          className="text-sm font-semibold text-cobalt-600 hover:underline"
                        >
                          증강하기
                        </Link>
                      </span>
                    ) : r.status === 'approved' || r.status === 'expiring' ? (
                      <Button
                        size="sm"
                        className="h-8 px-3.5 text-sm"
                        onClick={() => downloadExport(r.id)}
                      >
                        <Download className="size-3.5" />
                        다운로드
                      </Button>
                    ) : (
                      <span className="text-sm text-slate-300">심사 진행중</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 진행중 작업 */}
      <section className="mt-9">
        <SectionHeader title="진행중 작업" />
        <ul className="space-y-3">
          {activeJobs.map((j) => (
            <li
              key={j.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <span className="w-11 shrink-0 rounded-lg bg-slate-100 py-1 text-center text-xs font-bold text-slate-500">
                {j.kind}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-base font-semibold text-slate-800">{j.title}</p>
                  <EventBadge type={j.type} />
                </div>
                {j.progress !== undefined ? (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cobalt-500"
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-cobalt-700 tabular-nums">
                      {j.progress}%
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-400">
                    {formatDate(j.updatedAt)} 요청 · 처리 대기중
                  </p>
                )}
              </div>
              <StatusBadge status={j.status} />
              {j.kind === '저작' && (
                <Link
                  to="/workspace/authoring"
                  className="flex items-center gap-0.5 text-sm font-semibold whitespace-nowrap text-cobalt-600 hover:underline"
                >
                  이어하기
                  <ChevronRight className="size-4" />
                </Link>
              )}
            </li>
          ))}
          {activeJobs.length === 0 && (
            <li className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 py-14 text-center">
              <RotateCcw className="size-8 text-slate-300" />
              <p className="mt-3 text-base font-bold text-slate-600">진행중인 작업이 없습니다</p>
            </li>
          )}
        </ul>
      </section>
    </>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-lg font-extrabold text-slate-900">{title}</h2>
}
