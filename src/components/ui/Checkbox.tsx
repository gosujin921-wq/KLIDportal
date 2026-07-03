import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS 체크박스 스펙 이식. checked/indeterminate + label/error.
 * 체크·부분선택 글리프(CSS ::after)는 lucide Check·Minus 로 치환.
 * 네이티브 input 은 시각적으로 숨기고 커스텀 박스를 표시(KRDS 동일 구조).
 */
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  error?: ReactNode
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, id, indeterminate = false, error, disabled, className, ...props },
    ref,
  ) => {
    const reactId = useId()
    const checkboxId = id ?? reactId
    const innerRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <div className="flex flex-col gap-1">
        <label
          className={cn(
            'group inline-flex items-center gap-2 select-none',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          htmlFor={checkboxId}
        >
          <input
            ref={innerRef}
            id={checkboxId}
            type="checkbox"
            className="peer absolute size-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]"
            disabled={disabled}
            aria-invalid={!!error}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              'flex size-5 shrink-0 items-center justify-center rounded border-2 border-slate-300 bg-white text-white transition-[background-color,border-color,box-shadow]',
              'peer-checked:border-cobalt-600 peer-checked:bg-cobalt-600',
              'peer-indeterminate:border-cobalt-600 peer-indeterminate:bg-cobalt-600',
              'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt-600/40 peer-focus-visible:ring-offset-2',
              'peer-disabled:border-slate-300 peer-disabled:bg-slate-100',
              'peer-disabled:peer-checked:border-slate-400 peer-disabled:peer-checked:bg-slate-400',
              'peer-disabled:peer-indeterminate:border-slate-400 peer-disabled:peer-indeterminate:bg-slate-400',
              error && 'border-danger',
              className,
            )}
          >
            {indeterminate ? (
              <Minus className="size-3.5" strokeWidth={3} />
            ) : (
              <Check className="size-3.5" strokeWidth={3} />
            )}
          </span>
          {label && (
            <span
              className={cn(
                'text-base leading-normal text-slate-900',
                disabled && 'text-slate-400',
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="m-0 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Checkbox.displayName = 'Checkbox'
