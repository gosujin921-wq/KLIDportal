import { type InputHTMLAttributes, useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS 토글 스위치 스펙 이식. 숨김 checkbox(role="switch") + 슬라이딩 트랙/썸.
 * 라벨 폰트는 KRDS md(16px) → text-base. 크기 sm/md/lg 트랙·썸 px 유지.
 */
type Size = 'sm' | 'md' | 'lg'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  size?: Size
  labelPosition?: 'left' | 'right'
}

const trackSize: Record<Size, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-13',
}

const thumbSize: Record<Size, string> = {
  sm: 'left-[3px] size-3.5',
  md: 'left-[3px] size-[18px]',
  lg: 'left-[3px] size-[22px]',
}

// 썸은 트랙(input 형제)의 자식이라 peer-checked 가 직접 닿지 않음 →
// 트랙에 arbitrary 변형으로 checked 시 자식 transform 적용.
const thumbShift: Record<Size, string> = {
  sm: 'peer-checked:[&>span]:translate-x-4',
  md: 'peer-checked:[&>span]:translate-x-5',
  lg: 'peer-checked:[&>span]:translate-x-6',
}

export function Toggle({
  label,
  id,
  size = 'md',
  labelPosition = 'right',
  disabled = false,
  className,
  ...props
}: ToggleProps) {
  const autoId = useId()
  const toggleId = id ?? autoId

  const labelEl = label && (
    <span className={cn('text-base text-slate-900', disabled && 'text-slate-400')}>
      {label}
    </span>
  )

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      {labelPosition === 'left' && labelEl}
      <input
        id={toggleId}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        disabled={disabled}
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'relative shrink-0 rounded-full bg-slate-400 transition-colors',
          'peer-checked:bg-cobalt-600',
          'peer-disabled:bg-slate-200 peer-disabled:peer-checked:bg-slate-400',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt-600/40 peer-focus-visible:ring-offset-2',
          trackSize[size],
          thumbShift[size],
        )}
      >
        <span
          className={cn(
            'absolute top-[3px] rounded-full bg-white shadow transition-transform',
            thumbSize[size],
          )}
        />
      </span>
      {labelPosition === 'right' && labelEl}
    </label>
  )
}
