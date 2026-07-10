import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/** 스크롤 진입 시 숫자 카운트업. reduced-motion이면 즉시 최종값. */
export function CountUp({
  value,
  duration = 1.4,
  format = (n: number) => String(n),
}: {
  value: number
  duration?: number
  format?: (n: number) => string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / (duration * 1000), 1)
      const e = 1 - Math.pow(1 - p, 3) // ease-out
      setN(Math.round(value * e))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce, duration])

  return <span ref={ref}>{format(n)}</span>
}
