import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** 콘텐츠 최대폭 컨테이너 (1200px) */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-6', className)}>{children}</div>
}
