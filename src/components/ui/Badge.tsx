import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS Badge 스펙 이식. 변형 6종 + dot + count(maxCount).
 * KRDS 원본 sm 11px / md 12px 는 프로젝트 13px 하한에 맞춰 상향(최소 text-xs=13px).
 */
type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
type Size = 'sm' | 'md' | 'lg'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  size?: Size
  /** 점 배지 (내용 없는 상태 표시) */
  dot?: boolean
  /** 숫자 배지. maxCount 초과 시 "99+" 표기 */
  count?: number
  maxCount?: number
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-cobalt-600 text-white',
  secondary: 'bg-slate-200 text-slate-900',
  success: 'bg-success text-white',
  warning: 'bg-warning text-slate-900',
  danger: 'bg-danger text-white',
  info: 'bg-info text-white',
}

const dotColor: Record<Variant, string> = {
  primary: 'bg-cobalt-600',
  secondary: 'bg-slate-400',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
}

// 폰트 하한 13px 강제(KRDS 11/12px 미사용)
const sizeClass: Record<Size, string> = {
  sm: 'h-5 min-w-[20px] px-2 text-xs',
  md: 'h-[22px] min-w-[22px] px-2.5 text-xs',
  lg: 'h-[26px] min-w-[26px] px-3 text-sm',
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  count,
  maxCount = 99,
  className,
  ...props
}: BadgeProps) {
  if (dot) {
    return (
      <span
        aria-hidden
        className={cn('inline-block size-2 rounded-full', dotColor[variant], className)}
        {...props}
      />
    )
  }

  const content = count !== undefined ? (count > maxCount ? `${maxCount}+` : count) : children

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium leading-none whitespace-nowrap',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {content}
    </span>
  )
}
