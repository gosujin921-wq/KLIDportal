import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { SectionHeading } from './StatsSection'
import { Mark } from '@/mockup/components/ui/Mark'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { eventStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'

const COUNT_MAP = Object.fromEntries(eventStats.map((e) => [e.key, e.count]))
const MAX_COUNT = Math.max(...eventStats.map((e) => e.count))

/**
 * 이벤트 유형별 쇼케이스: 8종 카드 → 해당 유형 필터 검색으로 진입.
 * 기획 v2: 유형별 통계 수치의 시각적 표현이 핵심 — 카운트업 + 유형색 게이지.
 */
export function EventShowcaseSection() {
  return (
    <section className="bg-slate-50/70 py-20">
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

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {EVENT_TYPES_MAIN.map((t, i) => {
            const datasets = COUNT_MAP[t.key] ?? 0
            const clips = datasets * 28 // 데이터셋당 평균 영상 클립(목업 근사)
            return (
              <Reveal key={t.key} delay={i * 0.05}>
                <Link
                  to={`/search?type=${t.key}`}
                  className="card-soft flex flex-col rounded-2xl bg-white p-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${t.bgClass}`}
                    >
                      <t.icon className={`size-6 ${t.textClass}`} />
                    </span>
                    <p className="text-lg font-bold text-slate-900">{t.label}</p>
                  </div>

                  {/* 데이터셋 수 (카운트업) */}
                  <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">
                      <CountUp value={datasets} format={formatNumber} />
                    </span>
                    <span className="text-sm font-semibold text-slate-500">데이터셋</span>
                  </p>

                  {/* 유형색 게이지: 최다 유형 대비 비중 */}
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: `var(--color-event-${t.key})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(datasets / MAX_COUNT) * 100}%` }}
                      viewport={{ once: true, margin: '-60px 0px' }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
                    />
                  </div>

                  <p className="mt-2.5 text-sm text-slate-500 tabular-nums">
                    영상 클립 {formatNumber(clips)}건
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
