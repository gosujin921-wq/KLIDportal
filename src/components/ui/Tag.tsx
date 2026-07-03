import { type HTMLAttributes, type MouseEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS Tag 스펙 이식. 옅은 배경 + 동색 보더·텍스트. closable 옵션.
 * KRDS 원본 sm 11px / md 12px 는 프로젝트 13px 하한에 맞춰 상향.
 * 배경은 솔리드 표면 틴트만 사용(opacity 배경 토큰 미사용 — 컨벤션).
 */
type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type Size = 'sm' | 'md' | 'lg'

interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  variant?: Variant
  size?: Size
  closable?: boolean
  onClose?: (e: MouseEvent) => void
  onClick?: (e: MouseEvent) => void
  disabled?: boolean
}

const variantClass: Record<Variant, string> = {
  default: 'bg-slate-100 border-slate-300 text-slate-900',
  primary: 'bg-cobalt-50 border-cobalt-600 text-cobalt-700',
  success: 'bg-green-50 border-success text-success',
  warning: 'bg-amber-50 border-warning text-amber-700',
  danger: 'bg-red-50 border-danger text-danger',
  info: 'bg-cobalt-50 border-info text-info',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-6 px-2 text-xs gap-1',
  md: 'h-7 px-2.5 text-xs gap-1',
  lg: 'h-8 px-3 text-sm gap-1.5',
}

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  closable = false,
  onClose,
  onClick,
  disabled = false,
  className,
  ...props
}: TagProps) {
  const clickable = !!onClick
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border leading-none whitespace-nowrap',
        variantClass[variant],
        sizeClass[size],
        clickable && 'cursor-pointer select-none hover:brightness-95',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
      {closable && (
        <button
          type="button"
          className="-mr-0.5 inline-flex items-center justify-center opacity-60 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) onClose?.(e)
          }}
          disabled={disabled}
          aria-label="태그 삭제"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  )
}
