import { useRef, type ReactNode } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { Mark } from '@/mockup/components/ui/Mark'
import { formatNumber } from '@/lib/format'
import { eventStats, monthlyGrowth, portalStats, regionStats } from '@/mockup/mocks/landing'
import { EVENT_TYPE_MAP } from '@/components/domain/eventTypes'

const maxEvent = Math.max(...eventStats.map((e) => e.count))
const totalDatasets = monthlyGrowth[monthlyGrowth.length - 1].count

/** 빅 넘버 KPI — 단위 기준 통일: 데이터셋(세트) / 영상(건) / 이미지(장) */
const KPIS = [
  { label: '누적 학습 데이터셋', num: totalDatasets, prefix: '', suffix: '세트', gradient: true },
  { label: '누적 영상', num: portalStats.videoCount, prefix: '', suffix: '건', gradient: false },
  { label: '누적 학습 이미지', num: portalStats.imageCount, prefix: '', suffix: '장', gradient: false },
  { label: '참여 시·도', num: regionStats.length, prefix: '', suffix: '곳', gradient: false },
]

export function StatsSection() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="DATA STATUS"
            title={
              <>
                지금 <Mark>이만큼의 학습데이터</Mark>가 쌓여 있습니다
              </>
            }
            desc="재난·안전 이벤트 유형별로 구축된 학습데이터셋 현황입니다."
          />
        </Reveal>

        {/* 빅 넘버 KPI 스트립 */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.08}>
              <p
                className={`text-4xl font-extrabold tracking-tight tabular-nums lg:text-5xl ${
                  k.gradient ? 'text-gradient-cobalt' : 'text-slate-900'
                }`}
              >
                {k.prefix}
                <CountUp value={k.num} format={formatNumber} />
                <span className="text-2xl font-bold lg:text-3xl">{k.suffix}</span>
              </p>
              <p className="mt-2 text-base font-medium text-slate-500">{k.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* 이벤트 유형별 분포 */}
          <Reveal className="card-glow rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-lg font-bold text-slate-900">이벤트 유형별 데이터셋</p>
            <ul className="mt-6 space-y-4">
              {eventStats.map((e) => {
                const t = EVENT_TYPE_MAP[e.key]
                return (
                  <li key={e.key} className="flex items-center gap-3">
                    <span className={`flex w-22 shrink-0 items-center gap-1.5 text-sm font-semibold ${t.textClass}`}>
                      <t.icon className="size-4" />
                      {t.label}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: `var(--color-event-${e.key})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(e.count / maxEvent) * 100}%` }}
                        viewport={{ once: true, margin: '-60px 0px' }}
                        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-700">
                      <CountUp value={e.count} format={formatNumber} />
                    </span>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          {/* 월별 누적 증가 */}
          <Reveal delay={0.12} className="card-glow rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-lg font-bold text-slate-900">월별 누적 데이터셋</p>
            <GrowthChart />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/** 스크롤 진입 시점에 마운트해 라인 드로우 애니메이션이 보이게 하는 차트 */
function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  const reduce = useReducedMotion()

  return (
    <div ref={ref} className="mt-6 h-[200px]">
      {inView && (
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 520, height: 200 }}>
          <AreaChart data={monthlyGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e45dc" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2e45dc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#eef0f4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 13 }}
            />
            <Tooltip
              cursor={{ stroke: '#c4cffb' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 13,
              }}
              formatter={(v) => [formatNumber(Number(v)), '누적']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2e45dc"
              strokeWidth={2.5}
              fill="url(#growthFill)"
              isAnimationActive={!reduce}
              animationDuration={1200}
              dot={{ r: 3, fill: '#2e45dc' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string
  title: ReactNode
  desc?: string
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex items-center rounded-full bg-cobalt-50 px-3.5 py-1.5 text-sm font-bold tracking-wider text-cobalt-700">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-lg text-slate-600">{desc}</p>}
    </div>
  )
}
