import { motion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { SectionHeading } from './StatsSection'
import { regionStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * 시·도 타일 그리드 맵 (목업).
 * 실 지오 SVG choropleth는 7월 상세 단계에 교체. 지금은 대략적 지리 배치의 타일맵.
 */
/** 4×5 컴팩트 타일맵: 빈칸 최소화 + 대략적 지리 관계(서해안 좌, 동해안 우) 유지 */
const TILES: Record<string, { c: number; r: number }> = {
  인천: { c: 1, r: 1 },
  서울: { c: 2, r: 1 },
  경기: { c: 3, r: 1 },
  강원: { c: 4, r: 1 },
  충남: { c: 1, r: 2 },
  세종: { c: 2, r: 2 },
  충북: { c: 3, r: 2 },
  경북: { c: 4, r: 2 },
  전북: { c: 1, r: 3 },
  대전: { c: 2, r: 3 },
  대구: { c: 3, r: 3 },
  울산: { c: 4, r: 3 },
  광주: { c: 1, r: 4 },
  전남: { c: 2, r: 4 },
  경남: { c: 3, r: 4 },
  부산: { c: 4, r: 4 },
  제주: { c: 1, r: 5 },
}

const max = Math.max(...regionStats.map((r) => r.count))

/**
 * 데이터량 → 코발트 강도 단계 (choropleth).
 * 옅은 단계는 옅은 배경 + 짙은 텍스트(대비 충분), 진한 단계는 화이트 텍스트.
 * 중간톤(300~400) 배경은 어떤 텍스트와도 대비가 안 나와 사용하지 않음.
 */
function intensity(count: number): string {
  const ratio = count / max
  if (ratio > 0.8) return 'bg-cobalt-800 text-white'
  if (ratio > 0.55) return 'bg-cobalt-600 text-white'
  if (ratio > 0.35) return 'bg-cobalt-500 text-white'
  if (ratio > 0.2) return 'bg-cobalt-200 text-cobalt-900'
  return 'bg-cobalt-100 text-cobalt-800'
}

const top5 = [...regionStats].sort((a, b) => b.count - a.count).slice(0, 5)

export function RegionSection() {
  return (
    <section className="bg-gradient-to-b from-white via-cobalt-50 to-white py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="REGION"
            title="지역별 데이터 분포"
            desc="전국 시·도에서 수집·구축된 학습데이터 보유 현황입니다."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* 타일 맵 */}
          <Reveal className="card-soft rounded-2xl border border-slate-200 bg-white p-7">
            <div
              className="mx-auto grid w-fit gap-2"
              style={{
                gridTemplateColumns: 'repeat(4, 68px)',
                gridTemplateRows: 'repeat(5, 68px)',
              }}
            >
              {regionStats.map((region) => {
                const pos = TILES[region.name]
                if (!pos) return null
                return (
                  <motion.div
                    key={region.name}
                    style={{ gridColumn: pos.c, gridRow: pos.r }}
                    className={cn(
                      'flex flex-col items-center justify-center rounded-lg transition-transform hover:scale-105',
                      intensity(region.count),
                    )}
                    title={`${region.name} ${formatNumber(region.count)}건`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{
                      duration: 0.45,
                      delay: (pos.c + pos.r) * 0.06, // 좌상단부터 우하단으로 웨이브
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  >
                    <span className="text-[13px] font-bold leading-none">{region.name}</span>
                    <span className="mt-1 text-[13px] font-semibold leading-none opacity-90 tabular-nums">
                      {region.count}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* 범례 */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-slate-500">
              <span>적음</span>
              <span className="h-3 w-5 rounded bg-cobalt-100" />
              <span className="h-3 w-5 rounded bg-cobalt-200" />
              <span className="h-3 w-5 rounded bg-cobalt-500" />
              <span className="h-3 w-5 rounded bg-cobalt-600" />
              <span className="h-3 w-5 rounded bg-cobalt-800" />
              <span>많음</span>
            </div>
          </Reveal>

          {/* Top 5 */}
          <Reveal delay={0.12} className="card-soft rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-lg font-bold text-slate-900">데이터 보유 상위 지역</p>
            <ol className="mt-5 space-y-3">
              {top5.map((r, i) => (
                <motion.li
                  key={r.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5',
                    i === 0 && 'bg-gradient-to-r from-cobalt-600 to-cobalt-700 text-white shadow-lg shadow-cobalt-600/25',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded-lg text-sm font-bold',
                      i === 0 ? 'bg-white text-cobalt-700' : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn('w-14 shrink-0 font-semibold', i === 0 ? 'text-white' : 'text-slate-800')}>
                    {r.name}
                  </span>
                  {/* 수량 비례 미니 바 */}
                  <span
                    className={cn(
                      'h-2 flex-1 overflow-hidden rounded-full',
                      i === 0 ? 'bg-white/25' : 'bg-slate-100',
                    )}
                  >
                    <motion.span
                      className={cn('block h-full rounded-full', i === 0 ? 'bg-white' : 'bg-cobalt-400')}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.count / top5[0].count) * 100}%` }}
                      viewport={{ once: true, margin: '-60px 0px' }}
                      transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
                    />
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-bold tabular-nums',
                      i === 0 ? 'text-lg text-white' : 'text-sm text-slate-500',
                    )}
                  >
                    <CountUp value={r.count} format={formatNumber} />건
                  </span>
                </motion.li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
