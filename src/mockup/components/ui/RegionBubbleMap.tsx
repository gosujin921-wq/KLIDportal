import { memo, useCallback, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { KOREA_VIEWBOX, KOREA_PROVINCES } from './koreaGeo'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

type RegionDatum = { name: string; count: number }
type Bubble = { name: string; code: string; c: number; x: number; y: number; r: number; s: number }

/** 데이터량 → 코발트 5단계 (밀도 지도와 동일 스케일: 적음 → 많음). */
const STEPS = [
  'var(--color-cobalt-100)',
  'var(--color-cobalt-200)',
  'var(--color-cobalt-500)',
  'var(--color-cobalt-600)',
  'var(--color-cobalt-800)',
]
/** 각 단계 위 텍스트 색. 밝은 단계(0·1)는 어두운 글자로 대비 확보. */
const STEP_TEXT = [
  'var(--color-cobalt-900)',
  'var(--color-cobalt-900)',
  '#ffffff',
  '#ffffff',
  '#ffffff',
]

function stepIndex(ratio: number): number {
  if (ratio > 0.8) return 4
  if (ratio > 0.55) return 3
  if (ratio > 0.35) return 2
  if (ratio > 0.2) return 1
  return 0
}

/** 버블 겹침 회피 보정(수도권·중부). viewBox 760×711 절대좌표. 없으면 면적 중심(cx,cy) 사용. */
const NUDGE: Record<string, [number, number]> = {
  경기: [287, 205],
  서울: [247, 128],
  인천: [196, 156],
  세종: [268, 252],
  대전: [292, 292],
  충남: [228, 285],
  충북: [340, 235],
  광주: [224, 432],
  전남: [246, 486],
}
const R_MIN = 21
const R_MAX = 44
const NAME_FONT = 12 // 지역명 라벨(버블 표시 폭 기준 렌더값)
const LABEL_GAP = 2 // 숫자 아래끝과 라벨 위끝 사이 상수 간격(모든 버블 동일)

function numFont(r: number): number {
  return Math.max(18, r * 0.52)
}

/** 버블 그래픽(원 + 숫자 + 지역명). 상호작용 핸들러는 호출부에서 감싼다. */
function bubbleGraphic(b: Bubble, isActive: boolean) {
  const nf = numFont(b.r)
  // 숫자·라벨 블록을 버블 중심에 배치하되, 둘 사이 간격은 LABEL_GAP 로 고정
  const numY = b.y - (NAME_FONT * 0.5 + LABEL_GAP / 2)
  const nameY = b.y + (nf * 0.5 + LABEL_GAP / 2)
  const textColor = STEP_TEXT[b.s]
  return (
    <>
      <circle
        cx={b.x}
        cy={b.y}
        r={b.r}
        fill={STEPS[b.s]}
        fillOpacity={isActive ? 1 : 0.95}
        stroke="#ffffff"
        strokeOpacity={isActive ? 1 : 0.7}
        strokeWidth={isActive ? 2.5 : 1.6}
        filter="url(#region-bubble-shadow)"
      />
      <text
        x={b.x}
        y={numY}
        fontSize={nf}
        fontWeight={800}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none tabular-nums"
      >
        {b.c}
      </text>
      <text
        x={b.x}
        y={nameY}
        fontSize={NAME_FONT}
        fontWeight={600}
        fill={textColor}
        fillOpacity={0.92}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none"
      >
        {b.name}
      </text>
    </>
  )
}

/**
 * 개별 버블: 원(circle)만 은은히 부유(translate x·y)하고, 중심의 숫자·지역명은 고정.
 * 뷰 진입 시 반지름 팝인. x·y 주기를 다르게 줘 궤적이 겹치지 않아 유기적(부표처럼 까딱).
 * translate 는 회전축이 없어 흔들림이 없고, memo 로 커서 툴팁 리렌더에도 영향받지 않는다.
 */
const BubbleNode = memo(function BubbleNode({
  b,
  index,
  show,
  reduce,
  isActive,
  onEnter,
}: {
  b: Bubble
  index: number
  show: boolean
  reduce: boolean | null
  isActive: boolean
  onEnter: (name: string) => void
}) {
  const nf = numFont(b.r)
  const numY = b.y - (NAME_FONT * 0.5 + LABEL_GAP / 2)
  const nameY = b.y + (nf * 0.5 + LABEL_GAP / 2)
  const textColor = STEP_TEXT[b.s]

  const enterDelay = reduce ? 0 : Math.min(index * 0.04, 0.5)

  // 부유: 순수 CSS translate3d 오빗(컴포지터 최적화). 인덱스로 진폭·주기·위상·방향을 흩어 유기적.
  const ax = 3 + (index % 3) * 0.6
  const ay = 4 + (index % 2) * 0.8
  const dur = 7 + (index % 4) * 1.1
  const startPhase = (index % 7) * 0.9

  return (
    <g
      className="region-bubble cursor-pointer"
      onMouseEnter={() => onEnter(b.name)}
      style={
        reduce
          ? { willChange: 'transform' }
          : ({
              willChange: 'transform',
              '--fx': `${ax}px`,
              '--fy': `${ay}px`,
              animationName: 'region-bubble-float',
              animationDuration: `${dur}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDirection: index % 2 ? 'reverse' : 'normal',
              animationDelay: `${-startPhase}s`,
              animationPlayState: isActive ? 'paused' : 'running',
            } as CSSProperties)
      }
    >
      <motion.circle
        cx={b.x}
        cy={b.y}
        fill={STEPS[b.s]}
        fillOpacity={0.95}
        stroke="#ffffff"
        strokeOpacity={0.7}
        strokeWidth={1.6}
        initial={reduce ? false : { r: 0 }}
        animate={{ r: show ? b.r : 0 }}
        transition={{ duration: 0.5, delay: enterDelay, ease: [0.34, 1.35, 0.64, 1] }}
      />
      <motion.text
        x={b.x}
        y={numY}
        fontSize={nf}
        fontWeight={800}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none tabular-nums"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: enterDelay + 0.18 }}
      >
        {b.c}
      </motion.text>
      <motion.text
        x={b.x}
        y={nameY}
        fontSize={NAME_FONT}
        fontWeight={600}
        fill={textColor}
        fillOpacity={0.92}
        textAnchor="middle"
        dominantBaseline="central"
        className="pointer-events-none select-none"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.3, delay: enterDelay + 0.18 }}
      >
        {b.name}
      </motion.text>
      <title>{`${b.name} ${formatNumber(b.c)}건`}</title>
    </g>
  )
})

/**
 * 시·도별 데이터셋 보유 현황 버블 지도(회색 실루엣 + 값 크기 버블) + 순위 리스트.
 * 버블 면적이 데이터셋 수에 비례(√ 스케일). 버블과 리스트 행이 hover 로 연동된다.
 */
export function RegionBubbleMap({ data }: { data: RegionDatum[] }) {
  const [active, setActive] = useState<string | null>(null)
  const [overMap, setOverMap] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  // 뷰 진입 시 버블·순위막대가 등장(스크롤 전 재생 방지). reduced-motion이면 즉시 최종 상태.
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, margin: '-60px 0px' })
  const reduce = useReducedMotion()
  const show = reduce || inView
  const handleEnter = useCallback((name: string) => setActive(name), [])

  const { countOf, max, ranked, bubbles } = useMemo(() => {
    const countOf = new Map(data.map((d) => [d.name, d.count]))
    const counts = data.map((d) => d.count)
    const min = Math.min(...counts)
    const max = Math.max(...counts)
    const ranked = [...data].sort((a, b) => b.count - a.count)
    const radius = (c: number) =>
      max === min
        ? (R_MIN + R_MAX) / 2
        : R_MIN + (R_MAX - R_MIN) * ((Math.sqrt(c) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min)))
    const bubbles: Bubble[] = KOREA_PROVINCES.map((p) => {
      const c = countOf.get(p.name) ?? 0
      const [x, y] = NUDGE[p.name] ?? [p.cx, p.cy]
      return { name: p.name, code: p.code, c, x, y, r: radius(c), s: stepIndex(max ? c / max : 0) }
    }).sort((a, b) => b.r - a.r) // 큰 버블 먼저(뒤에) 그려 작은 버블이 위로
    return { countOf, max, ranked, bubbles }
  }, [data])

  const activeCount = active ? (countOf.get(active) ?? 0) : 0
  const activeBubble = active ? bubbles.find((b) => b.name === active) : undefined

  return (
    <div
      ref={rootRef}
      className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-center"
    >
      {/* 버블 지도 */}
      <div
        className="relative"
        style={{ isolation: 'isolate' }}
        onMouseLeave={() => {
          setActive(null)
          setOverMap(false)
        }}
      >
        <svg
          viewBox={KOREA_VIEWBOX}
          className="mx-auto block h-auto w-full max-w-[680px]"
          role="img"
          aria-label="시·도별 데이터셋 보유 현황 버블 지도"
          onMouseEnter={() => setOverMap(true)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
          }}
        >
          <defs>
            <filter id="region-bubble-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#1a2352" floodOpacity={0.3} />
            </filter>
          </defs>

          {/* 회색 실루엣 베이스 */}
          {KOREA_PROVINCES.map((p) => (
            <path
              key={p.code}
              d={p.d}
              fillRule="evenodd"
              fill={active === p.name ? '#dbe1ea' : '#eaeef3'}
              stroke="#d5dbe4"
              strokeWidth={0.8}
              strokeLinejoin="round"
              className="transition-[fill] duration-150"
            />
          ))}

          {/* 값 크기 버블: 원만 은은히 부유(중심 텍스트는 고정). 뷰 진입 시 팝인. */}
          {bubbles.map((b, i) => (
            <BubbleNode
              key={b.code}
              b={b}
              index={i}
              show={show}
              reduce={reduce}
              isActive={active === b.name}
              onEnter={handleEnter}
            />
          ))}

          {/* 활성 버블: 선택 링 + 위로 다시 그려 인접 버블에 가려지지 않게 */}
          {activeBubble && (
            <g pointerEvents="none">
              <circle
                cx={activeBubble.x}
                cy={activeBubble.y}
                r={activeBubble.r + 2.5}
                fill="none"
                stroke="var(--color-cobalt-700)"
                strokeWidth={2}
              />
              {bubbleGraphic(activeBubble, true)}
            </g>
          )}
        </svg>

        {/* 커서 툴팁 (지도 위에서만) */}
        {active && overMap && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-[13px] whitespace-nowrap text-white shadow-lg"
            style={{ left: pos.x, top: pos.y - 10 }}
          >
            {active} <span className="font-bold tabular-nums">{formatNumber(activeCount)}</span>건
          </div>
        )}

        {/* 범례: 적음 → 많음 (밀도 지도와 동일 색) */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
          <span>적음</span>
          {STEPS.map((c) => (
            <span key={c} className="h-3 w-5 rounded" style={{ backgroundColor: c }} />
          ))}
          <span>많음</span>
        </div>
      </div>

      {/* 순위 리스트 (17개 시·도) */}
      <ol className="flex flex-col gap-0.5">
        {ranked.map((r, idx) => {
          const isActive = active === r.name
          return (
            <li key={r.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(r.name)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors',
                  isActive ? 'bg-cobalt-50' : 'hover:bg-slate-50',
                )}
              >
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded text-[13px] font-bold tabular-nums',
                    idx < 3 ? 'bg-cobalt-600 text-white' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {idx + 1}
                </span>
                <span className="w-8 shrink-0 text-sm font-semibold text-slate-700">{r.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.span
                    className="block h-full rounded-full bg-cobalt-500"
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: show ? `${(r.count / max) * 100}%` : 0 }}
                    transition={{
                      duration: 0.7,
                      delay: reduce ? 0 : Math.min(idx * 0.03, 0.5),
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right text-sm font-bold text-slate-800 tabular-nums">
                  {formatNumber(r.count)}
                  <span className="ml-0.5 text-[13px] font-medium text-slate-400">건</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
