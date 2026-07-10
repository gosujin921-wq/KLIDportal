import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { Mark } from '@/components/ui/Mark'
import { SectionHeading } from './StatsSection'
import { generateExamples } from '@/mocks/landing'

/**
 * 핵심 가치 4영역 — 포스터형 비주얼 카드 (레퍼런스: Fleazy·VerdeVista 색면 카드).
 * 카드 자체가 색 블록이고, 그 위에 빅 타이포 + 추상 비주얼이 올라간다.
 */
export function ValueFlowSection() {
  return (
    <section id="flow" className="py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title={
              <>
                탐색에서 활용까지, <Mark>하나의 흐름</Mark>
              </>
            }
            desc="데이터를 찾고 끝나는 것이 아니라, 라벨링·증강·생성으로 확장해 직접 활용합니다."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* 01 Explore — 라이트 그라데이션 + 레이더 링 */}
          <Reveal className="flex">
            <article className="card-glow group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-3xl border border-cobalt-100 bg-gradient-to-br from-cobalt-50 via-white to-cobalt-100 p-8 hover:-translate-y-1.5 hover:-rotate-1">
              {/* 레이더 링 + 미니 검색 카드 칩 (프로덕트 미리보기 메타포) */}
              <div aria-hidden className="absolute -right-16 -top-16">
                <div className="radar-pulse grid size-72 place-items-center rounded-full border border-cobalt-200">
                  <div className="grid size-52 place-items-center rounded-full border border-cobalt-200">
                    <div className="size-32 rounded-full border border-cobalt-300" />
                  </div>
                </div>
                <span className="absolute left-10 top-36 size-3 rounded-full" style={{ backgroundColor: 'var(--color-event-wildfire)' }} />
                <span className="absolute left-48 top-44 size-3 rounded-full" style={{ backgroundColor: 'var(--color-event-fire)' }} />
              </div>
              <div aria-hidden className="absolute right-8 top-12 flex flex-col items-end gap-2.5">
                <span className="bob flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-lg shadow-cobalt-900/10">
                  <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--color-event-wildfire)' }} />
                  산불 데이터
                </span>
                <span
                  className="bob mr-8 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-lg shadow-cobalt-900/10"
                  style={{ animationDelay: '-1.2s' }}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--color-event-flood)' }} />
                  침수 데이터
                </span>
              </div>
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-600">01 EXPLORE · 데이터 검색</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                검색 카드로
                <br />
                빠르고 정확하게
              </h3>
              <p className="relative mt-3 max-w-sm text-base leading-relaxed text-slate-600">
                이벤트 유형·지역 중심의 검색 카드로 영상+이미지 세트를 찾고, 미리보기로 확인한 뒤 반출을 요청합니다.
              </p>
            </article>
          </Reveal>

          {/* 02 Enhance — 코발트 색면 + 도트 증식 */}
          <Reveal delay={0.08} className="flex">
            <article className="card-glow group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-cobalt-500 via-cobalt-600 to-cobalt-800 p-8 text-white hover:-translate-y-1.5 hover:rotate-1">
              {/* 도트 증식 패턴 */}
              <div aria-hidden className="absolute right-8 top-8 grid grid-cols-8 gap-2">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={
                      i < 8
                        ? 'size-2.5 rounded-[2px] bg-white'
                        : 'size-2.5 rounded-[2px] border border-cobalt-200'
                    }
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{
                      duration: 0.3,
                      delay: i < 8 ? 0.1 : 0.4 + (i - 8) * 0.035, // 원본 먼저, 증강이 물결로
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-200">02 ENHANCE · 저작 도구</span>
              <p className="relative text-sm font-semibold text-cobalt-200">주야간·계절·날씨 조건 증강</p>
              <h3 className="relative mt-1 text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                라벨링부터
                <br />
                AI 증강까지
              </h3>
              <p className="relative mt-3 max-w-sm text-base leading-relaxed text-cobalt-100">
                영상을 업로드하면 이미지 컷으로 잘라 라벨링하고, 조건을 반영한 AI 증강으로 데이터를
                확장합니다.
              </p>
            </article>
          </Reveal>

          {/* 03 Generate — 다크 + 글로우 오브 + 프롬프트 칩 */}
          <Reveal delay={0.08} className="flex">
            <article className="card-glow group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-950 p-8 text-white hover:-translate-y-1.5 hover:-rotate-1">
              {/* 생성 오브 (블러 글로우) */}
              <div
                aria-hidden
                className="orb-drift absolute -right-12 -top-16 size-64 rounded-full opacity-90 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #6e84f1 0%, #2e45dc 45%, transparent 72%)',
                }}
              />
              <Sparkles aria-hidden className="absolute right-10 top-10 size-6 text-cobalt-200" />
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-300">03 GENERATE · 생성형 AI</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                없는 상황은
                <br />
                생성형 AI로
              </h3>
              <p className="relative mt-3 max-w-sm text-base leading-relaxed text-slate-400">
                이미지를 업로드해 원하는 조건의 영상을 생성하고, 기한 내 다운로드해 활용합니다.
              </p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {generateExamples.map((ex, i) => (
                  <motion.span
                    key={ex}
                    className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  >
                    {ex}
                  </motion.span>
                ))}
              </div>
            </article>
          </Reveal>

          {/* 04 Utilize — 라이트 + 워크스페이스 차트/상태 */}
          <Reveal delay={0.16} className="flex">
            <article className="card-glow group relative flex min-h-[320px] w-full flex-col justify-end overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1.5 hover:rotate-1">
              {/* 미니 스파크라인 */}
              <svg
                aria-hidden
                viewBox="0 0 280 120"
                className="absolute right-0 top-6 h-32 w-72 text-cobalt-500"
              >
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e45dc" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#2e45dc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,100 L40,84 L80,90 L120,62 L160,70 L200,38 L240,30 L280,10 L280,120 L0,120 Z"
                  fill="url(#sparkFill)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
                <motion.polyline
                  points="0,100 40,84 80,90 120,62 160,70 200,38 240,30 280,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx="240"
                  cy="30"
                  r="5"
                  fill="currentColor"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ duration: 0.35, delay: 1.2 }}
                />
              </svg>
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-600">04 UTILIZE · 워크스페이스</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
                반출부터 기한까지
                <br />
                한눈에 관리
              </h3>
              <p className="relative mt-3 max-w-sm text-base leading-relaxed text-slate-600">
                반출 요청의 처리 상태와 다운로드 기한, 생성·저작 작업 현황을 한곳에서 관리합니다.
              </p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {[
                  { text: '반출 승인', accent: true },
                  { text: '다운로드 D-7', accent: false },
                  { text: '증강 작업 2건', accent: false },
                ].map((chip, i) => (
                  <motion.span
                    key={chip.text}
                    className={
                      chip.accent
                        ? 'rounded-full bg-cobalt-50 px-3 py-1.5 text-sm font-semibold text-cobalt-700'
                        : 'rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600'
                    }
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px 0px' }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                  >
                    {chip.text}
                  </motion.span>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
