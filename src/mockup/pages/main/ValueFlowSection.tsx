import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Car, Flame, MousePointer2, Waves } from 'lucide-react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { Mark } from '@/mockup/components/ui/Mark'
import { SectionHeading } from './StatsSection'

/**
 * 저작도구 카드 라벨링 캔버스가 순환할 이벤트 유형.
 * 각 사이클마다 피사체 아이콘·이벤트색·라벨을 함께 교체한다(산불 → 침수 → 교통사고 → 반복).
 */
const AUTHORING_CYCLE = [
  { key: 'wildfire', label: '산불', color: 'var(--color-event-wildfire)', Icon: Flame },
  { key: 'flood', label: '침수', color: 'var(--color-event-flood)', Icon: Waves },
  { key: 'traffic', label: '교통사고', color: 'var(--color-event-traffic)', Icon: Car },
] as const

/**
 * 라벨링 캔버스 — 프레임 속 피사체에 바운딩 박스를 그려 마킹하는 저작 메타포.
 * 이벤트 유형을 순환하며 지웠다 다시 그리기를 반복한다. 화면 밖이면 순환을 멈춰 자원을 아낀다.
 */
function LabelingCanvas() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-60px 0px' })
  const [index, setIndex] = useState(0)
  // 뷰 진입마다 증가 → AnimatePresence 키에 넣어 entrance(박스 그려짐)를 스크롤 도착 시 재생.
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView) return
    setIndex(0) // 들어오면 첫 씬부터
    setRun((r) => r + 1) // entrance 다시 재생
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % AUTHORING_CYCLE.length)
    }, 3200)
    return () => clearInterval(id)
  }, [inView])

  const ev = AUTHORING_CYCLE[index]
  const Icon = ev.Icon

  return (
    <div ref={ref} aria-hidden className="absolute right-6 top-8 h-32 w-44">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-cobalt-900/45 ring-1 ring-inset ring-white/15">
        {/* 픽셀 도트 질감 (영상 프레임, 순환 내내 유지) */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '13px 13px',
          }}
        />
        {/* CCTV 스캔 스윕 */}
        <div className="thumb-scan absolute inset-0" />

        {/* 이벤트 순환 씬 — 매 사이클 지웠다 다시 그림 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${run}-${ev.key}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* 피사체 — 프레임에 잡힌 대상. 콘텐츠로 먼저 등장 */}
            <motion.div
              className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                style={{
                  background: `radial-gradient(circle, color-mix(in srgb, ${ev.color} 45%, transparent), transparent 70%)`,
                }}
              />
              <Icon className="relative size-10" strokeWidth={2.25} style={{ color: ev.color }} />
            </motion.div>

            {/* 바운딩 박스 — 좌상단에서 우하단으로 드래그하듯 그려짐(clipPath 대각 확장) */}
            <motion.div
              className="absolute left-[25%] top-[32%] h-[44%] w-[50%] rounded-[3px] border-2 border-white bg-white/5"
              initial={{ clipPath: 'inset(0 100% 100% 0)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 0.55, delay: 0.45, ease: 'easeOut' }}
            >
              {/* 코너 리사이즈 핸들 4개 — 박스가 그려지며 순차 노출 */}
              {['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'].map(
                (pos) => (
                  <span
                    key={pos}
                    className={`absolute ${pos} size-2 rounded-[1px] bg-white ring-1 ring-cobalt-600`}
                  />
                ),
              )}
            </motion.div>

            {/* 이벤트 라벨 태그 — 박스 완성 후 부착 */}
            <span className="absolute left-[25%] top-[29%] -translate-y-full">
              <motion.span
                className="flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[13px] font-semibold leading-none text-cobalt-800 shadow-md shadow-cobalt-950/30"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.0, ease: 'easeOut' }}
              >
                <span className="size-2 rounded-full" style={{ backgroundColor: ev.color }} />
                {ev.label}
              </motion.span>
            </span>

            {/* 마킹 커서 — 박스를 그리며 좌상단에서 우하단으로 드래그 */}
            <motion.span
              className="absolute"
              initial={{ left: '25%', top: '32%', opacity: 0 }}
              animate={{ left: '75%', top: '76%', opacity: 1 }}
              transition={{
                default: { duration: 0.55, delay: 0.45, ease: 'easeOut' },
                opacity: { duration: 0.2, delay: 0.45 },
              }}
            >
              <MousePointer2 className="size-4 fill-white text-cobalt-700 drop-shadow" />
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * AI 데이터 증강 카드의 변형 가지 — 원본 1장에서 갈라져 나올 변형본.
 * mode = 변형 종류(반전·회전·명암). left/top = 우측 변형본 프레임 좌표(뷰박스 208x128 기준).
 */
const AUGMENT_BRANCHES = [
  { key: 'flip', mode: 'flip', left: 132, top: 4 },
  { key: 'rotate', mode: 'rotate', left: 144, top: 55 },
  { key: 'bright', mode: 'bright', left: 132, top: 106 },
]
const AUG_ORIGIN = { x: 76, y: 75 } // 원본 프레임 우측 중앙 = 가지 시작점

/**
 * 프레임 속 피사체(증강 대상). 카드02와 같은 납작한 영상 프레임 + 라인 아이콘.
 * mode에 따라 반전·회전·밝기로 변형되어 "같은 데이터의 변형본"을 표현. 입체감 없이 평면 그래픽 유지.
 */
function AugScene({ mode, big }: { mode?: string; big?: boolean }) {
  const bright = mode === 'bright'
  const iconTransform =
    mode === 'flip' ? 'scaleX(-1)' : mode === 'rotate' ? 'rotate(-12deg)' : undefined
  return (
    <div className="absolute inset-0" style={{ background: bright ? '#33469e' : '#171f4a' }}>
      {/* 도트 질감 (영상 프레임) */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
          backgroundSize: '9px 9px',
        }}
      />
      {/* 피사체 — 반전·회전으로 증강 */}
      <div className="absolute inset-0 grid place-items-center" style={{ transform: iconTransform }}>
        <Car className={big ? 'size-7 text-cobalt-100' : 'size-5 text-cobalt-100'} strokeWidth={2} />
      </div>
    </div>
  )
}

/**
 * 증강 트리 — 원본 프레임 1장에서 변형본(반전·회전·밝기)이 가지 치며 갈라져 나오는 증강 메타포.
 * 매 사이클 원본에서 가지가 뻗고 변형본이 하나씩 생성된다. 화면 밖이면 순환을 멈춘다.
 */
function AugmentDeck() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-60px 0px' })
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!inView) return
    setCycle((c) => c + 1) // 들어오면 즉시 트리 재생성(entrance 재생)
    const id = setInterval(() => setCycle((c) => c + 1), 3800)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} aria-hidden className="absolute right-6 top-8 h-[150px] w-52">
      <AnimatePresence mode="wait">
        <motion.div
          key={cycle}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 가지 — 원본에서 각 변형본으로 뻗는 연결선 */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 208 150"
            fill="none"
            preserveAspectRatio="none"
          >
            {AUGMENT_BRANCHES.map((b, i) => {
              const ty = b.top + 20
              const tx = b.left
              return (
                <motion.path
                  key={b.key}
                  d={`M${AUG_ORIGIN.x} ${AUG_ORIGIN.y} C ${AUG_ORIGIN.x + 26} ${AUG_ORIGIN.y}, ${tx - 22} ${ty}, ${tx} ${ty}`}
                  stroke="#9daef7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.55 }}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.28, ease: 'easeOut' }}
                />
              )
            })}
          </svg>

          {/* 원본 프레임 (가지의 시작) */}
          <motion.div
            className="absolute overflow-hidden rounded-md shadow-lg shadow-slate-950/60 ring-1 ring-white/30"
            style={{ left: 2, top: 48, width: 74, height: 54 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <AugScene big />
          </motion.div>

          {/* 변형본 — 원본에서 갈라져 하나씩 생성 */}
          {AUGMENT_BRANCHES.map((b, i) => (
            <motion.div
              key={b.key}
              className="absolute overflow-hidden rounded-md shadow-lg shadow-slate-950/50 ring-1 ring-white/20"
              style={{ left: b.left, top: b.top, width: 56, height: 40, zIndex: 2 }}
              initial={{ opacity: 0, scale: 0.7, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.5 + i * 0.28, ease: 'backOut' }}
            >
              <AugScene mode={b.mode} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * 서비스 소개 배너 (기획 v2 섹션 6) — 포스터형 색면 카드 3종.
 * 카드 제목·설명·CTA 문구는 기획 v2 메인페이지 요청서 표 그대로 사용.
 * 비주얼: 01 레이더 링(탐색) / 02 라벨링 캔버스(피사체 위 바운딩 박스 순환) / 03 증강 트리(원본 1장 → 변형본으로 갈라져 증식).
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

          {/* 02 저작도구 — 코발트 색면 + 라벨링 캔버스(피사체 아이콘 위 바운딩 박스 드로잉) */}
          <Reveal delay={0.08} className="flex">
            <article className="card-soft relative flex min-h-[360px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-cobalt-500 via-cobalt-600 to-cobalt-800 p-8 text-white">
              {/* 라벨링 캔버스 — 이벤트 유형을 순환하며 피사체 위에 바운딩 박스를 반복 드로잉 */}
              <LabelingCanvas />
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

          {/* 03 AI 데이터 증강 — 다크 + 글로우 오브 + 원본→변형본 증강 트리 */}
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
              {/* 증강 트리 — 원본 1장에서 변형본(반전·회전·밝기)이 갈라져 나옴 */}
              <AugmentDeck />
              <span className="absolute left-8 top-7 text-sm font-bold tracking-wider text-cobalt-300">03 AUGMENT</span>
              <h3 className="relative text-2xl font-extrabold tracking-tight text-white">AI 데이터 증강</h3>
              <p className="relative mt-3 break-keep text-base leading-relaxed text-slate-400">
                AI 기술로 시간·계절·날씨 조건을 반영해 학습데이터를 다양하게 확장해 보세요.
              </p>
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
