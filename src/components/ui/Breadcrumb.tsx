import { type MouseEvent, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS Breadcrumb 스펙 이식. items 배열 + maxItems 축약(...) 지원.
 * 구분자 글리프(/)는 lucide ChevronRight 로 교체.
 * 마지막 항목은 aria-current="page".
 */
export interface BreadcrumbItem {
  label: ReactNode
  href?: string
  icon?: ReactNode
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

interface InternalItem extends Partial<BreadcrumbItem> {
  label: ReactNode
  ellipsis?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  maxItems?: number
  className?: string
}

export function Breadcrumb({ items = [], maxItems, className }: BreadcrumbProps) {
  let visibleItems: InternalItem[] = items

  if (maxItems && items.length > maxItems) {
    const start = items.slice(0, 1)
    const end = items.slice(-(maxItems - 1))
    visibleItems = [...start, { label: '...', ellipsis: true }, ...end]
  }

  return (
    <nav className={cn('text-sm', className)} aria-label="경로">
      <ol className="m-0 flex flex-wrap items-center gap-1 p-0">
        {visibleItems.map((item, idx) => {
          const isLast = idx === visibleItems.length - 1
          return (
            <li key={idx} className="inline-flex items-center gap-1">
              {!isLast && !item.ellipsis ? (
                <a
                  href={item.href || '#'}
                  className="inline-flex items-center gap-1 text-cobalt-600 no-underline transition-colors hover:text-cobalt-700 hover:underline"
                  onClick={item.onClick}
                >
                  {item.icon && <span className="inline-flex">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-slate-600',
                    item.ellipsis ? 'font-normal' : 'font-medium',
                  )}
                  aria-current={isLast && !item.ellipsis ? 'page' : undefined}
                >
                  {item.icon && !item.ellipsis && (
                    <span className="inline-flex">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
