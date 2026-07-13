import { Plus, Pencil, Pin, Search, Image } from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'
import { noticePosts } from '@/mockup/mocks/news'
import { formatDate } from '@/lib/datetime'
import { cn } from '@/lib/cn'

const CATEGORY_STYLE: Record<string, string> = {
  공지: 'bg-cobalt-50 text-cobalt-700',
  안내: 'bg-sky-50 text-sky-700',
  업데이트: 'bg-emerald-50 text-emerald-700',
  점검: 'bg-amber-50 text-amber-700',
}

/** 관리자 공지사항 관리 (CRUD 대표 화면) */
export function AdminNoticesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">공지사항 관리</h1>
          <p className="mt-1.5 text-base text-slate-500">
            공지를 등록·수정하고 상단 고정과 팝업 노출을 관리합니다.
          </p>
        </div>
        <Button>
          <Plus className="size-4.5" />
          새 공지 작성
        </Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="제목으로 검색"
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-10 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-400">
              <th className="w-24 px-5 py-3 font-medium">분류</th>
              <th className="px-3 py-3 font-medium">제목</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">상단고정</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">팝업</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">작성일</th>
              <th className="px-3 py-3 text-right font-medium whitespace-nowrap">조회</th>
              <th className="px-5 py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {noticePosts.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      'inline-block rounded-md px-2 py-0.5 text-sm font-semibold',
                      CATEGORY_STYLE[p.category],
                    )}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="px-3 py-3.5 font-medium text-slate-800">{p.title}</td>
                <td className="px-3 py-3.5">
                  {p.pinned ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-cobalt-50 px-2 py-0.5 text-xs font-semibold text-cobalt-700">
                      <Pin className="size-3" />
                      고정
                    </span>
                  ) : (
                    <span className="text-sm text-slate-300">-</span>
                  )}
                </td>
                <td className="px-3 py-3.5">
                  {/* 팝업 공지 설정 (기획 v2, DFEAT-055) */}
                  {p.popup ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
                      <Image className="size-3" />
                      팝업
                    </span>
                  ) : (
                    <span className="text-sm text-slate-300">-</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                  {formatDate(p.date)}
                </td>
                <td className="px-3 py-3.5 text-right text-sm text-slate-500 tabular-nums">
                  {p.views.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Pencil className="size-3.5" />
                    수정
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
