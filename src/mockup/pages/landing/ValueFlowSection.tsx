import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { Mark } from '@/mockup/components/ui/Mark'
import { SectionHeading } from './StatsSection'
import { generateExamples } from '@/mockup/mocks/landing'

/**
 * 서비스 소개 배너 (기획 v2 섹션 6) — 포스터형 색면 카드 3종.
 * 카드 제목·설명·CTA 문구는 기획 v2 메인페이지 요청서 표 그대로 사용.
 * 비주얼: 01 레이더 링(탐색) / 02 도트 증식(라벨링 프레임) / 03 다크 글로우 오브(증강·생성).
 */
export function ValueFlowSection() {
  return (
    <section id="flow" className="py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="SERVICES"
            title={
              <>
                검색부터 증강까지, <Mark>핵심 기능 3가지</Mark>
              </>
            }
            desc="학습데이터 검색·저작도구·AI 데이터 증강을 한눈에 살펴보세요."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* 01 학습데이터 검색 — 라이트 그라데이션 + 레이더 링 */}
          <Reveal className="flex">
            <article className="card-soft relative flex min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-cobalt-50 via-white to-cobalt-100 p-8">
              {/* 레이더 링 + 미니 검색 칩 (탐색 메타포) */}
              <div aria-hidden className="absolute -right-14 -top-14">
                <div className="radar-pulse grid size-60 place-items-center rounded-full border border-cobalt-200">
                  <div className="grid size-44 place-items-center rounded-full border border-cobalt-200">
                    <div className="size-28 rounded-full border border-cobalt-300" />
                  </div>
                </div>
                <span className="absolute left-8 top-32 size-3 rounded-full" style={{ backgroundColor: 'var(--color-event-wildfire)' }} />
                <span className="absolute left-40 top-40 size-3 rounded-full" style={{ backgroundColor: 'var(--color-event-fire)' }} />
              </div>
              <div aria-hidden className="absolute right-6 top-10 flex flex-col items-end gap-2.5">
                <span className="bob flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-lg shadow-cobalt-900/10">
                  <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--color-event-wildfire)' }} />
                  산불 데이터
                </span>
                <span
                  className="bob mr-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 shadow-lg shadow-cobalt-900/10"
                  style={{ animationDelay: '-1.2s' }}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: 'var(--color-event-flood)' }} />
                  침수 데이터
                </span>
              </div>
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-600">01 SEARCH</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-slate-900">학습데이터 검색</h3>
              <p className="relative mt-3 break-keep text-base leading-relaxed text-slate-600">
                재난·안전 CCTV 영상 기반 AI 학습데이터를 다양한 조건으로 검색하고 다운로드하세요.
              </p>
              <Link
                to="/search"
                className="relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-cobalt-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-700"
              >
                데이터 검색하기
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </Reveal>

          {/* 02 저작도구 — 코발트 색면 + 도트 증식(라벨링 프레임 메타포) */}
          <Reveal delay={0.08} className="flex">
            <article className="card-soft relative flex min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-cobalt-500 via-cobalt-600 to-cobalt-800 p-8 text-white">
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
                      delay: i < 8 ? 0.1 : 0.4 + (i - 8) * 0.035,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-200">02 AUTHORING</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-white">저작도구</h3>
              <p className="relative mt-3 break-keep text-base leading-relaxed text-cobalt-100">
                업로드한 영상에 직접 마킹·라벨링하여 나만의 학습데이터를 만들어 보세요.
              </p>
              <Link
                to="/workspace/authoring"
                className="relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-cobalt-700 transition-colors hover:bg-cobalt-50"
              >
                저작도구 시작하기
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </Reveal>

          {/* 03 AI 데이터 증강 — 다크 + 글로우 오브 + 프롬프트 칩 */}
          <Reveal delay={0.16} className="flex">
            <article className="card-soft relative flex min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-950 p-8 text-white">
              <div
                aria-hidden
                className="orb-drift absolute -right-12 -top-16 size-64 rounded-full opacity-90 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #6e84f1 0%, #2e45dc 45%, transparent 72%)',
                }}
              />
              <Sparkles aria-hidden className="absolute right-10 top-10 size-6 text-cobalt-200" />
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-300">03 AUGMENT</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-white">AI 데이터 증강</h3>
              <p className="relative mt-3 break-keep text-base leading-relaxed text-slate-400">
                AI 기술로 학습데이터를 증강하고 생성형 AI로 새로운 영상을 만들어 보세요.
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
              <Link
                to="/workspace/augment"
                className="relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200"
              >
                AI 증강 알아보기
                <ArrowRight className="size-4" />
              </Link>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
