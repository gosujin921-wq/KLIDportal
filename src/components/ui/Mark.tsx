import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

/** 키워드 형광펜 하이라이트. 스크롤 진입 시 왼쪽에서 스와이프되며 칠해진다. */
export function Mark({
  children,
  className = 'bg-cobalt-200',
  delay = 0.25,
}: {
  children: ReactNode
  /** 형광펜 색 (bg-* 클래스) */
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  return (
    <span className="relative inline-block whitespace-nowrap">
      {reduce ? (
        <span className={cn('absolute inset-x-[-0.08em] bottom-[0.02em] h-[0.42em] rounded-sm', className)} />
      ) : (
        <motion.span
          className={cn('absolute inset-x-[-0.08em] bottom-[0.02em] h-[0.42em] rounded-sm', className)}
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-60px 0px' }}
          transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
        />
      )}
      <span className="relative">{children}</span>
    </span>
  )
}
