import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Film, Images, Download } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { Mark } from '@/mockup/components/ui/Mark'
import { formatNumber } from '@/lib/format'
import { portalStats } from '@/mockup/mocks/landing'
import { DATASET_ICON, DATASET_ICON_CHIP } from '@/mockup/domain/dataset'

/** 보유 현황 수치 카드 4종 (요청서 §섹션2). 데이터셋만 검색 생성 분포와 정합(1,240), 나머지는 요청서 샘플 */
const KPIS = [
  { label: '학습 데이터셋', num: portalStats.datasetCount, suffix: '건', icon: DATASET_ICON, gradient: true },
  { label: '영상 클립', num: portalStats.clipCount, suffix: '건', icon: Film, gradient: false },
  { label: '라벨링 프레임', num: portalStats.frameCount, suffix: '장', icon: Images, gradient: false },
  { label: '누적 다운로드', num: portalStats.downloadCount, suffix: '회', icon: Download, gradient: false },
]

export function StatsSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading
              eyebrow="DATA STATUS"
              title={
                <>
                  지금 <Mark>이만큼의 학습데이터</Mark>가 쌓여 있습니다
                </>
              }
              desc="재난·안전 학습데이터의 누적 규모입니다. 유형별·지역별·추이 상세는 데이터 현황에서 볼 수 있습니다."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-cobalt-700 transition-colors hover:text-cobalt-800 hover:underline"
            >
              데이터 현황 자세히 보기
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>

        {/* 수치 카드 4종 (아이콘 + 수치 + 라벨) */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {KPIS.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.08}>
              <span className={`flex size-11 items-center justify-center rounded-xl ${DATASET_ICON_CHIP}`}>
                <k.icon className="size-5.5" />
              </span>
              <p
                className={`mt-4 text-4xl font-extrabold tracking-tight tabular-nums lg:text-5xl ${
                  k.gradient ? 'text-gradient-cobalt' : 'text-slate-900'
                }`}
              >
                <CountUp value={k.num} format={formatNumber} />
                <span className="text-2xl font-bold lg:text-3xl">{k.suffix}</span>
              </p>
              <p className="mt-1.5 text-base font-medium text-slate-500">{k.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
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
