import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS 텍스트 입력 스펙 이식. label/hint/error + 좌우 애드온.
 * KRDS 원본 sm 14px / md 16px / lg 18px 폰트는 프로젝트 토큰(text-sm·base·lg)으로 매핑.
 * 포커스 링·상태색은 코발트(#2e45dc) 기준으로 치환.
 */
type Size = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode
  size?: Size
  error?: ReactNode
  hint?: ReactNode
  required?: boolean
  leftAddon?: ReactNode
  rightAddon?: ReactNode
}

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-3.5 text-lg',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      type = 'text',
      size = 'md',
      error,
      hint,
      required = false,
      leftAddon,
      rightAddon,
      disabled,
      readOnly,
      className,
      ...props
    },
    ref,
  ) => {
    const reactId = useId()
    const inputId = id ?? reactId

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label
            className="text-sm font-medium leading-normal text-slate-900"
            htmlFor={inputId}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="pointer-events-none absolute left-2.5 flex items-center text-sm text-slate-600">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-md border border-slate-300 bg-white text-slate-900 outline-none transition-[border-color,box-shadow]',
              'hover:enabled:read-write:border-slate-500',
              'focus-visible:outline-none focus:border-cobalt-600 focus:shadow-[0_0_0_3px_rgba(46,69,220,0.25)]',
              'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
              'read-only:bg-slate-50',
              sizeClass[size],
              leftAddon && 'pl-8',
              rightAddon && 'pr-8',
              error &&
                'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(220,53,69,0.25)]',
              className,
            )}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightAddon && (
            <span className="pointer-events-none absolute right-2.5 flex items-center text-sm text-slate-600">
              {rightAddon}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="m-0 text-xs leading-normal text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="m-0 text-xs leading-normal text-slate-600"
          >
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
