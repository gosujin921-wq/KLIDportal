import { Search, MapPin, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { eventStats, regionStats, monthlyGrowth } from '@/mocks/landing'
import { EVENT_TYPE_MAP } from '@/domain/eventTypes'
import { formatNumber } from '@/lib/format'

/**
 * 검색 카드 티저 마퀴 — 회의록 7장 "검색 카드" 컨셉.
 * 이벤트 유형 중심으로 미리 구성된 검색 조건 카드를 흐르는 띠로 보여준다. (호버 시 일시정지)
 * 보조 칩 수치는 통계 목업에서 파생 (임의 수치 금지).
 */
const capital = regionStats
  .filter((r) => ['서울', '경기', '인천'].includes(r.name))
  .reduce((s, r) => s + r.count, 0)
const recent6m = monthlyGrowth[monthlyGrowth.length - 1].count - monthlyGrowth[0].count

const CARDS: { label: string; count: number; colorVar: string; icon: LucideIcon }[] = [
  ...eventStats.map((e) => ({
    label: `${EVENT_TYPE_MAP[e.key].label} 데이터`,
    count: e.count,
    colorVar: `var(--color-event-${e.key})`,
    icon: EVENT_TYPE_MAP[e.key].icon,
  })),
  { label: '수도권', count: capital, colorVar: 'var(--color-cobalt-500)', icon: MapPin },
  { label: '최근 6개월 신규', count: recent6m, colorVar: 'var(--color-cobalt-500)', icon: TrendingUp },
]

export function EventMarquee() {
  return (
    <section aria-label="검색 카드 바로가기" className="border-y border-slate-100 bg-white py-5">
      <div className="marquee relative overflow-hidden">
        {/* 좌우 페이드 */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="marquee-track flex w-max gap-3">
          {[0, 1].map((dup) => (
            <div key={dup} aria-hidden={dup === 1} className="flex gap-3 pr-3">
              {CARDS.map((c) => (
                <a
                  key={`${dup}-${c.label}`}
                  href="#"
                  className="group flex shrink-0 items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-2.5 pr-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cobalt-300 hover:shadow-md"
                >
                  {/* 유형색 아이콘 타일 (레퍼런스 컬러 아이콘 스타일) */}
                  <span
                    className="grid size-7 place-items-center rounded-lg text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: c.colorVar }}
                  >
                    <c.icon className="size-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{c.label}</span>
                  <span className="text-sm tabular-nums text-slate-400">{formatNumber(c.count)}</span>
                  <Search className="size-3.5 text-slate-300 transition-colors group-hover:text-cobalt-500" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
