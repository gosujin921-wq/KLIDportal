import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  PenTool,
  FolderOpen,
  Layers,
  Heart,
  CircleHelp,
} from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { demoUser } from '@/mockup/mocks/workspace'
import { useDemoAuth } from '@/mockup/demoAuth'
import { LockedOverlay } from './LockedOverlay'
import { cn } from '@/lib/cn'

/* 기획 v2: 생성형 AI는 데이터 증강에 통합, 데이터 즐겨찾기가 워크스페이스로 이동 */
const MENUS = [
  { to: '/workspace', label: '대시보드', icon: LayoutDashboard, end: true },
  { to: '/workspace/upload', label: '업로드 영상', icon: Upload },
  { to: '/workspace/authoring', label: '저작도구', icon: PenTool },
  { to: '/workspace/datasets', label: '내 학습데이터', icon: FolderOpen },
  { to: '/workspace/augment', label: '데이터 증강', icon: Layers },
  { to: '/workspace/favorites', label: '즐겨찾기', icon: Heart },
]

/** 워크스페이스 공통 레이아웃 (좌측 LNB) */
export function WorkspaceLayout() {
  const { loggedIn } = useDemoAuth()
  return (
    <Container className="py-10">
      <div className="flex items-start gap-8">
        <aside className="sticky top-24 hidden w-60 shrink-0 lg:block">
          {/* 사용자 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-cobalt-50 text-base font-bold text-cobalt-700">
                {demoUser.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-900">{demoUser.name}</p>
                <p className="truncate text-sm text-slate-500">{demoUser.org}</p>
              </div>
            </div>
          </div>

          {/* LNB */}
          <nav className="mt-4 rounded-2xl border border-slate-200 bg-white p-2.5">
            <p className="px-3 pt-1.5 pb-2 text-xs font-bold tracking-wider text-slate-400">
              워크스페이스
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

          {/* 도움말 */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <CircleHelp className="size-4 text-cobalt-500" />
              도움이 필요하신가요?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              이용 가이드에서 업로드부터 라벨링까지 단계별 안내를 확인하세요.
            </p>
          </div>
        </aside>

        <div className="relative min-w-0 flex-1">
          <div className={cn(!loggedIn && 'pointer-events-none select-none')} aria-hidden={!loggedIn}>
            <Outlet />
          </div>
          {!loggedIn && <LockedOverlay />}
        </div>
      </div>
    </Container>
  )
}
