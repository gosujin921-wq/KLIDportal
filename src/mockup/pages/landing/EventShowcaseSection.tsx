import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { SectionHeading } from './StatsSection'
import { Mark } from '@/mockup/components/ui/Mark'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { eventStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'

const COUNT_MAP = Object.fromEntries(eventStats.map((e) => [e.key, e.count]))

/** 이벤트 유형별 쇼케이스: 8종 카드 → 해당 유형 필터 검색으로 진입 */
export function EventShowcaseSection() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="BY EVENT TYPE"
            title={
              <>
                <Mark>재난·안전 8개 유형</Mark>으로 골라 보세요
              </>
            }
            desc="유형을 선택하면 해당 학습데이터 검색 결과로 이동합니다."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {EVENT_TYPES_MAIN.map((t, i) => {
            const datasets = COUNT_MAP[t.key] ?? 0
            const clips = datasets * 28 // 데이터셋당 평균 영상 클립(목업 근사)
            return (
              <Reveal key={t.key} delay={i * 0.05}>
                <Link
                  to={`/search?type=${t.key}`}
                  className="card-glow group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-cobalt-200"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl ${t.bgClass}`}
                    >
                      <t.icon className={`size-5.5 ${t.textClass}`} />
                    </span>
                    <ArrowUpRight className="size-4.5 text-slate-300 transition-colors group-hover:text-cobalt-500" />
                  </div>
                  <p className="mt-4 text-lg font-bold text-slate-900">{t.label}</p>
                  <p className="mt-1 text-sm text-slate-500 tabular-nums">
                    데이터셋 {formatNumber(datasets)} · 영상 {formatNumber(clips)}
                  </p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
