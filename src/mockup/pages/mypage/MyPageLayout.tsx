import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, UserCog } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { demoUser } from '@/mockup/mocks/workspace'
import { cn } from '@/lib/cn'

// 기획 v2: 마이페이지 3메뉴 (대시보드·이용 내역·회원 정보). 즐겨찾기는 워크스페이스로 이동
const MENUS = [
  { to: '/mypage', label: '대시보드', icon: LayoutDashboard, end: true },
  { to: '/mypage/history', label: '이용 내역 조회', icon: ClipboardList },
  { to: '/mypage/account', label: '회원 정보 관리', icon: UserCog },
]

/** 마이페이지 공통 레이아웃 (좌측 LNB) */
export function MyPageLayout() {
  return (
    <Container className="py-10">
      <div className="flex items-start gap-8">
        <aside className="sticky top-24 hidden w-60 shrink-0 lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-cobalt-50 text-base font-bold text-cobalt-700">
                {demoUser.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-900">{demoUser.name}</p>
                <p className="truncate text-sm text-slate-500">{demoUser.email}</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 rounded-2xl border border-slate-200 bg-white p-2.5">
            <p className="px-3 pt-1.5 pb-2 text-xs font-bold tracking-wider text-slate-400">
              마이페이지
            </p>
            <ul className="space-y-0.5">
              {MENUS.map((m) => (
                <li key={m.to}>
                  <NavLink
                    to={m.to}
                    end={m.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-cobalt-50 font-semibold text-cobalt-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )
                    }
                  >
                    <m.icon className="size-4.5" />
                    {m.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </Container>
  )
}
