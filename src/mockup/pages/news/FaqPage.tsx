import { useState } from 'react'
import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { faqCategories, faqItems } from '@/mockup/mocks/news'
import { cn } from '@/lib/cn'

/** FAQ: 카테고리 칩 + 아코디언 */
export function FaqPage() {
  const [category, setCategory] = useState('전체')
  const [openId, setOpenId] = useState<number | null>(faqItems[0]?.id ?? null)

  const filtered = faqItems.filter((f) => category === '전체' || f.category === category)

  return (
    <>
      {/* 카테고리 칩 */}
      <div className="flex flex-wrap gap-2">
        {faqCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              c === category
                ? 'bg-cobalt-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-cobalt-200 hover:text-cobalt-700',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 아코디언 */}
      <ul className="mt-6 space-y-2.5">
        {filtered.map((f) => {
          const open = openId === f.id
          return (
            <li key={f.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : f.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cobalt-50 text-sm font-bold text-cobalt-700">
                  Q
                </span>
                <span className="flex-1 text-base font-semibold text-slate-800">{f.q}</span>
                {f.top && (
                  <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-600">
                    TOP
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'size-5 shrink-0 text-slate-400 transition-transform',
                    open && 'rotate-180',
                  )}
                />
              </button>
              {open && (
                <div className="flex gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-bold text-slate-500">
                    A
                  </span>
                  <p className="text-base leading-relaxed text-slate-600">{f.a}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* 문의 유도 */}
      <div className="mt-8 flex items-center justify-between rounded-2xl border border-cobalt-100 bg-cobalt-50/60 px-6 py-5">
        <div className="flex items-center gap-3">
          <MessageCircleQuestion className="size-6 text-cobalt-600" />
          <div>
            <p className="text-base font-bold text-slate-900">원하는 답변을 찾지 못하셨나요?</p>
            <p className="text-sm text-slate-500">문의하기를 통해 직접 질문해 주세요.</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full bg-cobalt-600 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-cobalt-700"
        >
          문의하기
        </button>
      </div>
    </>
  )
}
