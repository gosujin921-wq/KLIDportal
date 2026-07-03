import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS Loading 스펙 이식. 보더 스피너 → lucide Loader2 + animate-spin.
 * size(sm/md/lg) · color(primary/white/gray) · overlay 변형 유지.
 * 레이블 폰트 13px 하한(KRDS xs=12px 미사용).
 */
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'white' | 'gray'

interface LoadingProps {
  size?: Size
  label?: string
  overlay?: boolean
  color?: Color
  className?: string
}

const spinnerSize: Record<Size, string> = {
  sm: 'size-5',
  md: 'size-8',
  lg: 'size-12',
}

const spinnerColor: Record<Color, string> = {
  primary: 'text-cobalt-600',
  white: 'text-white',
  gray: 'text-slate-600',
}

const labelColor: Record<Color, string> = {
  primary: 'text-slate-600',
  white: 'text-white',
  gray: 'text-slate-600',
}

export function Loading({
  size = 'md',
  label = '로딩 중...',
  overlay = false,
  color = 'primary',
  className,
}: LoadingProps) {
  const effectiveColor: Color = overlay ? 'white' : color

  const spinner = (
    <div
      className={cn('inline-flex flex-col items-center gap-2', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn('animate-spin', spinnerSize[size], spinnerColor[effectiveColor])}
        aria-hidden="true"
      />
      {label && (
        <span className={cn('text-sm', size === 'sm' && 'text-xs', labelColor[effectiveColor])}>
          {label}
        </span>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50"
        aria-modal="true"
      >
        {spinner}
      </div>
    )
  }

  return spinner
}
