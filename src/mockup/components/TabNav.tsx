import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface TabItem {
  to: string
  label: string
  end?: boolean
}

/** 상단 탭 LNB (소식&참여·이용안내 공용) */
export function TabNav({ items }: { items: TabItem[] }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-1">
        {items.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                '-mb-px border-b-2 px-4 py-3 text-base font-semibold transition-colors',
                isActive
                  ? 'border-cobalt-600 text-cobalt-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800',
              )
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
