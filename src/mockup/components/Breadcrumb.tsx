import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

/** 브레드크럼. 마지막(현재 위치)은 비링크. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="현재 위치" className="flex items-center gap-1.5 text-sm text-slate-500">
      <Link to="/" className="transition-colors hover:text-slate-800">
        홈
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 text-slate-300" />
          {c.to ? (
            <Link to={c.to} className="transition-colors hover:text-slate-800">
              {c.label}
            </Link>
          ) : (
            <span className="max-w-60 truncate font-medium text-slate-700">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
