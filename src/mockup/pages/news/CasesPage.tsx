import { ArrowUpRight, Building2 } from 'lucide-react'
import { useCases } from '@/mockup/mocks/news'

/** 활용사례: 카드 그리드 */
export function CasesPage() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {useCases.map((c) => (
        <a
          key={c.id}
          href="#"
          className="card-glow group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-cobalt-200"
        >
          {/* 썸네일 */}
          <div className="relative flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-cobalt-50 to-slate-100">
            <span className="rounded-full border border-cobalt-100 bg-white/70 px-3 py-1 text-sm font-semibold text-cobalt-700">
              {c.category}
            </span>
            <ArrowUpRight className="absolute top-3 right-3 size-5 text-slate-300 transition-colors group-hover:text-cobalt-500" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-cobalt-700">
              {c.title}
            </h3>
            <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
              <Building2 className="size-3.5" />
              {c.org}
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{c.summary}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
