import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * 커스텀 드롭다운(listbox). 네이티브 select 는 옵션 팝업이 OS 렌더라 룩앤필을 못 입혀서,
 * 트리거 버튼 + 커스텀 팝업으로 직접 구현했다. 사용법은 네이티브와 동일하게 <option> 을 children 으로 넘긴다.
 *
 * - controlled(`value`) / uncontrolled(`defaultValue`) 모두 지원
 * - `<option value="" disabled>선택하세요</option>` 는 placeholder 로 취급(회색 표시)
 * - `className` 은 트리거(시각: 높이·글자·font-mono 등), `wrapperClassName` 은 바깥 박스(레이아웃: mt·w-full)에 적용
 * - 키보드(↑↓·Home·End·Enter·Esc)·바깥 클릭 닫기 지원
 */
interface OptionData {
  value: string
  label: ReactNode
  text: string
  disabled: boolean
}

interface SelectProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  children: ReactNode
  className?: string
  wrapperClassName?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
  /** 팝업 방향. 하단 여백이 좁은 위치(푸터 등)는 'top'으로 위로 연다. 기본 'bottom' */
  placement?: 'top' | 'bottom'
}

function toText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(toText).join('')
  return ''
}

function parseOptions(children: ReactNode): OptionData[] {
  const out: OptionData[] = []
  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child) || child.type !== 'option') return
    const props = child.props as { value?: string | number; children?: ReactNode; disabled?: boolean }
    const label = props.children
    const value = props.value !== undefined ? String(props.value) : toText(label)
    out.push({ value, label, text: toText(label), disabled: Boolean(props.disabled) })
  })
  return out
}

export function Select({
  value,
  defaultValue,
  onChange,
  children,
  className,
  wrapperClassName,
  disabled,
  id,
  'aria-label': ariaLabel,
  placement = 'bottom',
}: SelectProps) {
  const options = parseOptions(children)
  const isControlled = value !== undefined

  const [internal, setInternal] = useState(() => {
    const dv = defaultValue ?? value
    if (dv !== undefined && options.some((o) => o.value === dv)) return dv
    return options[0]?.value ?? ''
  })
  const current = isControlled ? value : internal
  const selected = options.find((o) => o.value === current) ?? options[0]
  const isPlaceholder = !selected || selected.disabled || selected.value === ''

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const baseId = useId()
  const listId = `${baseId}-list`

  const selectable = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // 열릴 때 현재 선택 항목으로 활성 위치 이동, 스크롤 맞춤
  useEffect(() => {
    if (!open) return
    const cur = options.findIndex((o) => o.value === current && !o.disabled)
    setActive(cur >= 0 ? cur : (selectable[0] ?? -1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open || active < 0) return
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const choose = (i: number) => {
    const o = options[i]
    if (!o || o.disabled) return
    if (!isControlled) setInternal(o.value)
    onChange?.(o.value)
    setOpen(false)
  }

  const move = (dir: 1 | -1) => {
    if (selectable.length === 0) return
    const pos = selectable.indexOf(active)
    const nextPos =
      pos === -1
        ? dir === 1
          ? 0
          : selectable.length - 1
        : (pos + dir + selectable.length) % selectable.length
    setActive(selectable[nextPos])
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        move(-1)
        break
      case 'Home':
        e.preventDefault()
        setActive(selectable[0] ?? -1)
        break
      case 'End':
        e.preventDefault()
        setActive(selectable[selectable.length - 1] ?? -1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (active >= 0) choose(active)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative inline-flex', wrapperClassName)}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${baseId}-opt-${active}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={cn(
          'inline-flex h-9 items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white pr-3 pl-3 text-left text-sm text-slate-700 transition-colors',
          'hover:border-slate-400 focus:border-cobalt-400 focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          open && 'border-cobalt-400',
          className,
        )}
      >
        <span className={cn('truncate', isPlaceholder && 'text-slate-400')}>{selected?.label}</span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'absolute left-0 z-30 max-h-64 min-w-full max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg',
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
          )}
        >
          {options.map((o, i) => {
            const isSel = o.value === current && !o.disabled
            const isActive = i === active
            return (
              <li
                key={`${o.value}-${i}`}
                id={`${baseId}-opt-${i}`}
                data-idx={i}
                role="option"
                aria-selected={isSel}
                aria-disabled={o.disabled || undefined}
                title={o.text}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={cn(
                  'flex items-center justify-between gap-2 px-3 py-1.5 text-sm',
                  o.disabled
                    ? 'cursor-not-allowed text-slate-400'
                    : 'cursor-pointer',
                  isSel && 'bg-cobalt-50 font-semibold text-cobalt-700',
                  !isSel && isActive && 'bg-slate-100 text-slate-900',
                  !isSel && !isActive && !o.disabled && 'text-slate-700',
                )}
              >
                <span className="truncate">{o.label}</span>
                {isSel && <Check className="size-4 shrink-0 text-cobalt-600" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
