import { Link } from 'react-router-dom'
import { ClipboardList, Play, History, Search, LoaderCircle, Flame, Undo2, Upload, FolderSearch } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { authoringTasks } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'
import { formatNumber } from '@/lib/format'

/** 저작도구: 작업 목록 (참고 목업의 정보 구조를 포털 룩앤필로 재구성) */
export function AuthoringListPage() {
  const SUMMARY = [
    { label: '전체 작업', value: authoringTasks.length, icon: ClipboardList, tone: 'text-slate-500 bg-slate-100' },
    { label: '진행중', value: authoringTasks.filter((t) => t.status === 'inProgress').length, icon: LoaderCircle, tone: 'text-cobalt-600 bg-cobalt-50' },
    { label: '검수대기', value: authoringTasks.filter((t) => t.status === 'reviewWait').length, icon: Flame, tone: 'text-amber-600 bg-amber-50' },
    { label: '반려', value: authoringTasks.filter((t) => t.status === 'rejected').length, icon: Undo2, tone: 'text-red-500 bg-red-50' },
  ]

  return (
    <>
      <Breadcrumb items={[{ label: '워크스페이스', to: '/workspace' }, { label: '저작도구' }]} />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">저작도구</h1>
          <p className="mt-1.5 text-base text-slate-500">
            업로드한 영상이나 기존 학습데이터셋을 불러와 객체를 직접 라벨링하세요.
          </p>
        </div>
        {/* 작업 시작 진입점: 업로드 영상 / 기존 데이터셋 (DOMAIN-003) */}
        <div className="flex gap-2">
          <Link to="/workspace/upload">
            <Button variant="secondary" size="sm">
              <Upload className="size-4" />
              업로드 영상에서
            </Button>
          </Link>
          <Link to="/search">
            <Button size="sm">
              <FolderSearch className="size-4" />
              기존 데이터셋 불러오기
            </Button>
          </Link>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <span className={`flex size-8 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon className="size-4" />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 검색·필터 */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="영상명으로 검색"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-10 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
          />
        </div>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-cobalt-400 focus:outline-none" aria-label="이벤트 유형">
          <option>이벤트 전체</option>
          {EVENT_TYPES_MAIN.map((t) => (
            <option key={t.key}>{t.label}</option>
          ))}
        </select>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-cobalt-400 focus:outline-none" aria-label="상태">
          <option>상태 전체</option>
          <option>대기</option>
          <option>진행중</option>
          <option>검수대기</option>
          <option>완료</option>
          <option>반려</option>
        </select>
      </div>

      {/* 작업 테이블 */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-400">
              <th className="px-5 py-3 font-medium">영상명</th>
              <th className="px-3 py-3 font-medium">이벤트</th>
              <th className="px-3 py-3 font-medium">상태</th>
              <th className="px-3 py-3 text-right font-medium">프레임</th>
              <th className="px-3 py-3 text-right font-medium">객체</th>
              <th className="px-3 py-3 font-medium">최근 작업일</th>
              <th className="px-5 py-3 text-right font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {authoringTasks.map((t) => (
              <tr key={t.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <p className="text-base font-semibold text-slate-800">{t.videoName}</p>
                  <p className="font-mono text-sm text-slate-400">{t.videoId}</p>
                </td>
                <td className="px-3 py-3.5">
                  <EventBadge type={t.type} />
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-3 py-3.5 text-right text-base text-slate-600 tabular-nums">
                  {t.frames > 0 ? formatNumber(t.frames) : '-'}
                </td>
                <td className="px-3 py-3.5 text-right text-base text-slate-600 tabular-nums">
                  {t.objects > 0 ? formatNumber(t.objects) : '-'}
                </td>
                <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                  {formatDate(t.updatedAt)}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <Link
                    to={`/workspace/authoring/${t.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-cobalt-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-cobalt-700 transition-colors hover:bg-cobalt-50"
                  >
                    <Play className="size-3.5" />
                    작업
                  </Link>
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    <History className="size-3.5" />
                    이력
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
