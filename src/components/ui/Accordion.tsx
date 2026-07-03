import { type ReactNode, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS Accordion 스펙 이식. items 배열 기반 그룹 + 개별 AccordionItem.
 * 각 아이템은 defaultOpen 으로 비제어 open 상태 관리.
 * 글리프 아이콘(▲▼)은 lucide ChevronDown 으로 교체(open 시 180도 회전).
 */
export interface AccordionItemData {
  title: ReactNode
  content: ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

interface AccordionItemProps {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  disabled?: boolean
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div>
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between px-5 py-4 text-left',
          'text-base font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-600/40 focus-visible:ring-inset',
          disabled
            ? 'cursor-not-allowed text-slate-400'
            : open
              ? 'bg-cobalt-50 text-cobalt-600 hover:bg-cobalt-50'
              : 'text-slate-900 hover:bg-slate-50',
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'size-4 flex-shrink-0 text-slate-600 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          className="border-t border-slate-300 bg-white px-5 pb-5 pt-3 text-base leading-normal text-slate-900"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  items?: AccordionItemData[]
  bordered?: boolean
  className?: string
}

export function Accordion({ items = [], bordered = true, className }: AccordionProps) {
  return (
    <div
      className={cn(
        'w-full',
        bordered && 'overflow-hidden rounded-md border border-slate-300 [&>*+*]:border-t [&>*+*]:border-slate-300',
        className,
      )}
    >
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          title={item.title}
          defaultOpen={item.defaultOpen}
          disabled={item.disabled}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
