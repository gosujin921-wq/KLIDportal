import { useState } from 'react'
import { Pin, Search } from 'lucide-react'
import { noticePosts, type NoticePost } from '@/mockup/mocks/news'
import { formatDate } from '@/lib/datetime'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

const CATEGORY_STYLE: Record<string, string> = {
  공지: 'bg-cobalt-50 text-cobalt-700',
  안내: 'bg-sky-50 text-sky-700',
  업데이트: 'bg-emerald-50 text-emerald-700',
  점검: 'bg-amber-50 text-amber-700',
}

/** 공지사항: 목록 ↔ 상세 (동일 페이지 상태 전환) */
export function NoticesPage() {
  const [selected, setSelected] = useState<NoticePost | null>(null)

  if (selected) {
    const idx = noticePosts.findIndex((p) => p.id === selected.id)
    const prev = noticePosts[idx - 1]
    const next = noticePosts[idx + 1]
    return (
      <article>
        <div className="border-b border-slate-200 pb-5">
          <span
            className={cn(
              'inline-block rounded-md px-2.5 py-0.5 text-sm font-semibold',
              CATEGORY_STYLE[selected.category],
            )}
          >
            {selected.category}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{selected.title}</h2>
          <p className="mt-2 text-sm text-slate-400 tabular-nums">
            {formatDate(selected.date)} · 조회 {formatNumber(selected.views)}
          </p>
        </div>
        <p className="min-h-40 py-7 text-base leading-relaxed text-slate-600">{selected.body}</p>

        <div className="divide-y divide-slate-100 border-t border-slate-200">
          {prev && (
            <button
              type="button"
              onClick={() => setSelected(prev)}
              className="flex w-full items-center gap-4 py-3 text-left hover:bg-slate-50"
            >
              <span className="w-12 shrink-0 text-sm font-semibold text-slate-400">이전</span>
              <span className="truncate text-base text-slate-600">{prev.title}</span>
            </button>
          )}
          {next && (
            <button
              type="button"
              onClick={() => setSelected(next)}
              className="flex w-full items-center gap-4 py-3 text-left hover:bg-slate-50"
            >
              <span className="w-12 shrink-0 text-sm font-semibold text-slate-400">다음</span>
              <span className="truncate text-base text-slate-600">{next.title}</span>
            </button>
          )}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="rounded-full border border-slate-300 px-5 py-2 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            목록으로
          </button>
        </div>
      </article>
    )
  }

  return (
    <>
      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="제목으로 검색"
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-10 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-400">
              <th className="w-24 px-5 py-3 font-medium">분류</th>
              <th className="px-3 py-3 font-medium">제목</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">작성일</th>
              <th className="px-5 py-3 text-right font-medium whitespace-nowrap">조회</th>
            </tr>
          </thead>
          <tbody>
            {noticePosts.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className={cn(
                  'cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50',
                  p.pinned && 'bg-cobalt-50/40',
                )}
              >
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
                <td className="px-3 py-3.5">
                  <span className="flex items-center gap-1.5">
                    {p.pinned && <Pin className="size-3.5 shrink-0 text-cobalt-500" />}
                    <span className="font-medium text-slate-800">{p.title}</span>
                  </span>
                </td>
                <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                  {formatDate(p.date)}
                </td>
                <td className="px-5 py-3.5 text-right text-sm whitespace-nowrap text-slate-500 tabular-nums">
                  {formatNumber(p.views)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
