import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'
import { Mark } from '@/mockup/components/ui/Mark'
import { formatNumber } from '@/lib/format'
import { rfpGoals, augmentConditions, generateExamples } from '@/mockup/mocks/landing'

export function WowSection() {
  return (
    <section className="py-10">
      <Container>
        <div className="band-cobalt relative grid items-center gap-14 overflow-hidden rounded-[2.5rem] px-8 py-16 text-white lg:grid-cols-[1fr_0.9fr] lg:px-14 lg:py-20">
          <div aria-hidden className="band-dots absolute inset-0" />
          {/* 좌: 메시지 + 숫자 */}
          <Reveal className="relative">
            <p className="text-sm font-bold tracking-wider text-cobalt-300">GENERATIVE AI DATA</p>
            <h2 className="mt-3 break-keep text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
              구하기 어려운 재난 영상,
              <br />
              <Mark className="bg-cobalt-500" delay={0.45}>
                <span className="text-cobalt-100">생성형 AI</span>
              </Mark>
              로 만듭니다.
            </h2>
            <p className="mt-4 max-w-md break-keep text-lg text-cobalt-100/80">
              화재·침수 등 실제 재난이 발생한 CCTV 영상은 확보가 어렵습니다. 실영상에 시간·계절·날씨
              조건을 반영해 증강하고, 없는 상황은 생성형 AI로 만들어 학습데이터를 구축합니다.
            </p>

            {/* 사업 구축 목표 (출처: 제안요청서) */}
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              <div>
                <p className="text-sm font-medium text-cobalt-100/70">학습 이미지 구축</p>
                <p className="mt-1 text-5xl font-extrabold leading-none tabular-nums text-white lg:text-6xl">
                  <CountUp value={rfpGoals.trainingImages} format={formatNumber} />
                  <span className="text-3xl font-bold lg:text-4xl">장</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-cobalt-100/70">상황 설명문</p>
                <p className="mt-1 text-5xl font-extrabold leading-none tabular-nums text-cobalt-200 lg:text-6xl">
                  <CountUp value={rfpGoals.captions} format={formatNumber} />
                  <span className="text-3xl font-bold lg:text-4xl">개+</span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-[13px] text-cobalt-100/60">
              구축 목표 수치는 사업 제안요청서 기준입니다.
            </p>
          </Reveal>

          {/* 우: 도트 증식 시각화 + 생성 */}
          <Reveal
            delay={0.12}
            className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 p-8 shadow-[0_24px_48px_-20px_rgba(8,12,50,0.55)] backdrop-blur-sm"
          >
            {/* 조건 반영 증강 (출처: RFP SFR-06/07) */}
            <p className="text-base font-bold text-white">조건 반영 데이터 증강</p>
            <p className="mt-2 break-keep text-sm leading-relaxed text-cobalt-100/80">
              기존 이미지에 시간·계절·날씨 변화를 적용해 학습데이터를 자동 증강합니다. 증강 전후
              라벨은 그대로 보존됩니다.
            </p>

            {/* 증강 프리뷰: 원본 → 조건 변형 3종. 점선 라벨 박스가 같은 자리에 유지됨 = 라벨 무결성 */}
            <div className="mt-5 flex items-center gap-2.5">
              <PreviewFrame caption="원본" gradient="linear-gradient(135deg, #94a3b8, #64748b)" />
              <span aria-hidden className="shrink-0 text-lg font-light text-cobalt-300">
                →
              </span>
              <PreviewFrame caption="야간" gradient="linear-gradient(135deg, #1e293b, #0f172a)" delay={0.15} />
              <PreviewFrame caption="비" gradient="linear-gradient(135deg, #155e75, #1e3a5f)" delay={0.3} />
              <PreviewFrame caption="안개" gradient="linear-gradient(135deg, #cbd5e1, #94a3b8)" delay={0.45} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {augmentConditions.map((c, i) => (
                <motion.span
                  key={c}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                >
                  {c}
                </motion.span>
              ))}
            </div>

            {/* 생성형 AI */}
            <div className="mt-7 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-cobalt-100">
                <Sparkles className="size-4 text-cobalt-300" />
                실영상이 없는 상황은 생성형 AI로
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {generateExamples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/** 증강 프리뷰 미니 프레임: 틴트 배경 + 동일 위치의 점선 라벨 박스(라벨 무결성 은유) */
function PreviewFrame({
  caption,
  gradient,
  delay = 0,
}: {
  caption: string
  gradient: string
  delay?: number
}) {
  return (
    <motion.figure
      className="min-w-0 flex-1"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px 0px' }}
      transition={{ duration: 0.45, delay: 0.15 + delay, ease: 'easeOut' }}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg" style={{ background: gradient }}>
        {/* 라벨 바운딩 박스: 모든 프레임에서 같은 자리 */}
        <span className="absolute left-[30%] top-[28%] h-[46%] w-[38%] rounded-[3px] border border-dashed border-white/80" />
      </div>
      <figcaption className="mt-1.5 text-center text-[13px] text-cobalt-100/70">{caption}</figcaption>
    </motion.figure>
  )
}


