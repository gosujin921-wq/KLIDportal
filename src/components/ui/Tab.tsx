import { type ReactNode, useId, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS Tab 스펙 이식. tabs 배열 기반. line/card 변형, sm/md/lg 크기.
 * 제어(activeKey)·비제어(defaultActiveKey) 모두 지원.
 * KRDS 배지 11px 는 프로젝트 13px 하한에 맞춰 상향(text-xs).
 */
type Variant = 'line' | 'card'
type Size = 'sm' | 'md' | 'lg'

export interface TabItem {
  key: string
  label: ReactNode
  content?: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

interface TabProps {
  tabs?: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  variant?: Variant
  size?: Size
  className?: string
}

const sizeClass: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-1.5',
  md: 'text-base px-5 py-2.5',
  lg: 'text-lg px-6 py-3',
}

export function Tab({
  tabs = [],
  defaultActiveKey,
  activeKey,
  onChange,
  variant = 'line',
  size = 'md',
  className,
}: TabProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveKey ?? tabs[0]?.key)
  const current = activeKey ?? internalActive
  const baseId = useId()

  const handleClick = (key: string) => {
    setInternalActive(key)
    onChange?.(key)
  }

  const activeTab = tabs.find((t) => t.key === current)

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        role="tablist"
        className={cn(
          'flex overflow-x-auto',
          variant === 'line' && 'border-b-2 border-slate-300',
          variant === 'card' && 'gap-1 pl-1',
        )}
      >
        {tabs.map((tab) => {
          const active = current === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${baseId}-panel-${tab.key}`}
              id={`${baseId}-tab-${tab.key}`}
              tabIndex={active ? 0 : -1}
              className={cn(
                'inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-600/40 focus-visible:ring-inset',
                sizeClass[size],
                tab.disabled
                  ? 'cursor-not-allowed text-slate-400'
                  : 'cursor-pointer',
                variant === 'line' && '-mb-0.5 border-b-2 border-transparent',
                variant === 'line' &&
                  !tab.disabled &&
                  (active
                    ? 'border-cobalt-600 text-cobalt-600'
                    : 'text-slate-600 hover:text-cobalt-600'),
                variant === 'line' && tab.disabled && 'text-slate-400',
                variant === 'card' &&
                  'rounded-t-md border border-b-0 border-slate-300',
                variant === 'card' &&
                  (active
                    ? 'bg-white text-cobalt-600'
                    : 'bg-slate-50 text-slate-600'),
              )}
              onClick={() => !tab.disabled && handleClick(tab.key)}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="inline-flex">{tab.icon}</span>}
              {tab.label}
              {tab.badge != null && (
                <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1.5 text-xs font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${current}`}
        aria-labelledby={`${baseId}-tab-${current}`}
        className="py-5"
      >
        {activeTab?.content}
      </div>
    </div>
  )
}
