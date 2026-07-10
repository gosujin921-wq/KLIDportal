import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Download,
  Users,
  Megaphone,
  HelpCircle,
  MessageSquare,
  Newspaper,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const MENUS = [
  { to: '/admin', label: '대시보드', icon: LayoutDashboard, end: true },
  { to: '/admin/downloads', label: '다운로드 현황 관리', icon: Download },
  { to: '/admin/members', label: '회원 현황 관리', icon: Users },
  { to: '/admin/notices', label: '공지사항 관리', icon: Megaphone },
  { to: '/admin/faq', label: 'FAQ 관리', icon: HelpCircle },
  { to: '/admin/inquiries', label: '문의 관리', icon: MessageSquare },
  { to: '/admin/cases', label: '활용사례 관리', icon: Newspaper },
  { to: '/admin/content', label: '콘텐츠 관리', icon: FileText },
]

/** 관리자 전용 레이아웃 (다크 사이드바 + 라이트 콘텐츠, 포털 GNB와 별도 아이덴티티) */
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 다크 사이드바 */}
      <aside className="band-cobalt sticky top-0 hidden h-screen w-64 shrink-0 flex-col p-4 lg:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-sm font-bold text-white">
            A
          </span>
          <div>
            <p className="text-base font-bold text-white">관리자 콘솔</p>
            <p className="text-xs text-white/60">AI 영상학습 포털</p>
          </div>
        </div>

        <nav className="mt-4 flex-1">
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
                        ? 'bg-white/15 font-semibold text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white',
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

        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4" />
          사용자 포털로 이동
        </Link>
      </aside>

      {/* 콘텐츠 */}
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <p className="text-base font-bold text-slate-900">관리자 콘솔</p>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-slate-500">관리자님</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-cobalt-50 text-sm font-bold text-cobalt-700">
              관
            </span>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
