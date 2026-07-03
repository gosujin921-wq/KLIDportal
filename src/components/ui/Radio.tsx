import { type InputHTMLAttributes, type ChangeEvent, useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS 라디오 버튼 스펙 이식. 숨김 input + 커스텀 원형 표시.
 * 라벨 폰트는 KRDS md(16px) → text-base. 그룹 legend/error 포함.
 */
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
}

export function Radio({ label, id, disabled = false, className, ...props }: RadioProps) {
  const autoId = useId()
  const radioId = id ?? autoId

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'group inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        id={radioId}
        type="radio"
        className="peer sr-only"
        disabled={disabled}
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors',
          'border-slate-300',
          'peer-checked:border-cobalt-600',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt-600/40 peer-focus-visible:ring-offset-2',
          'peer-disabled:border-slate-300 peer-disabled:bg-slate-100',
          // 안쪽 점: 부모(원)가 input 형제이므로 group-has 로 checked 반영
          'after:size-2.5 after:rounded-full after:bg-transparent after:transition-colors',
          'peer-checked:after:bg-cobalt-600',
          'peer-disabled:peer-checked:after:bg-slate-400',
        )}
      />
      {label && (
        <span className={cn('text-base text-slate-900', disabled && 'text-slate-400')}>
          {label}
        </span>
      )}
    </label>
  )
}

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  legend?: string
  name: string
  options?: RadioOption[]
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  direction?: 'vertical' | 'horizontal'
  error?: string
}

/** KRDS 라디오 그룹. options 배열로 라디오 목록 렌더링. */
export function RadioGroup({
  legend,
  name,
  options = [],
  value,
  onChange,
  disabled = false,
  direction = 'vertical',
  error,
}: RadioGroupProps) {
  return (
    <fieldset className="m-0 border-0 p-0">
      {legend && (
        <legend className="mb-2 text-sm font-medium text-slate-900">{legend}</legend>
      )}
      <div
        className={cn(
          'flex gap-3',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        )}
      >
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onChange={onChange}
            disabled={disabled || opt.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
