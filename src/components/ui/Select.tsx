import { type SelectHTMLAttributes, type ReactNode, forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS 선택(드롭다운) 스펙 이식. options 배열 + label/hint/error.
 * KRDS 원본 sm 14px / md 16px / lg 18px 폰트는 프로젝트 토큰(text-sm·base·lg)으로 매핑.
 * 화살표 글리프(▾)는 lucide ChevronDown 으로 치환.
 */
type Size = 'sm' | 'md' | 'lg'

interface SelectOption {
  value: string | number
  label: ReactNode
  disabled?: boolean
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: ReactNode
  options?: SelectOption[]
  placeholder?: string
  size?: Size
  error?: ReactNode
  hint?: ReactNode
  required?: boolean
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 pl-2.5 text-sm',
  md: 'h-10 pl-3 text-base',
  lg: 'h-12 pl-3.5 text-lg',
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      id,
      options = [],
      placeholder = '선택하세요',
      size = 'md',
      error,
      hint,
      required = false,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const reactId = useId()
    const selectId = id ?? reactId

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label
            className="text-sm font-medium leading-normal text-slate-900"
            htmlFor={selectId}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full cursor-pointer appearance-none rounded-md border border-slate-300 bg-white pr-9 text-slate-900 outline-none transition-[border-color,box-shadow]',
              'hover:not-disabled:border-slate-500',
              'focus-visible:outline-none focus:border-cobalt-600 focus:shadow-[0_0_0_3px_rgba(46,69,220,0.25)]',
              'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
              sizeClass[size],
              error &&
                'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(220,53,69,0.25)]',
              className,
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-600"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="m-0 text-xs leading-normal text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${selectId}-hint`}
            className="m-0 text-xs leading-normal text-slate-600"
          >
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'
