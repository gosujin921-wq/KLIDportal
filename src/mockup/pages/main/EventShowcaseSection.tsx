import { Link } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { SectionHeading } from './StatsSection'
import { Mark } from '@/mockup/components/ui/Mark'
import { EVENT_TYPES_MAIN } from '@/mockup/domain/eventTypes'
import { eventStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'
import { EventBuddyScene } from './EventBuddyScene'

const COUNT_MAP = Object.fromEntries(eventStats.map((e) => [e.key, e.count]))

/**
 * 이벤트 유형별 쇼케이스: 8종 카드 → 해당 유형 필터 검색으로 진입.
 * 요청서 §섹션3: 아이콘 + 유형명 + 데이터셋 N + 영상 클립 N.
 */
export function EventShowcaseSection() {
  return (
    <section className="bg-white py-20">
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
                  className="card-soft flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80"
                >
                  {/* 유형별 캐릭터 미니 장면 썸네일 — 쿨그레이 무대(스포트라이트) 배경 + 하단 구분선 */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden border-b border-slate-200/70"
                    style={{
                      background:
                        'radial-gradient(88% 68% at 50% 76%, #f7f9fd 0%, #e8edf5 56%, #dce3ef 100%)',
                    }}
                  >
                    <EventBuddyScene event={t.key} />
                  </div>

                  <div className="flex items-center gap-3 px-6 pt-5">
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${t.bgClass}`}
                    >
                      <t.icon className={`size-6 ${t.textClass}`} />
                    </span>
                    <p className="text-lg font-bold text-slate-900">{t.label}</p>
                  </div>

                  {/* 데이터셋 수 (카운트업) */}
                  <p className="mt-4 flex items-baseline gap-1.5 px-6">
                    <span className="text-3xl font-extrabold tracking-tight tabular-nums text-slate-900">
                      <CountUp value={datasets} format={formatNumber} />
                    </span>
                    <span className="text-sm font-semibold text-slate-500">데이터셋</span>
                  </p>

                  <p className="mt-1.5 px-6 pb-6 text-sm text-slate-500 tabular-nums">
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
