import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  PenTool,
  Layers,
  Heart,
  CircleHelp,
  UserRound,
} from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { DATASET_ICON } from '@/mockup/domain/dataset'
import { demoUser } from '@/mockup/mocks/workspace'
import { useDemoAuth } from '@/mockup/demoAuth'
import { LockedOverlay } from './LockedOverlay'
import { cn } from '@/lib/cn'

/* 기획 v2: 생성형 AI는 데이터 증강에 통합, 데이터 즐겨찾기가 워크스페이스로 이동 */
const MENUS = [
  { to: '/workspace', label: '대시보드', icon: LayoutDashboard, end: true },
  { to: '/workspace/upload', label: '업로드 영상', icon: Upload },
  { to: '/workspace/authoring', label: '저작도구', icon: PenTool },
  { to: '/workspace/datasets', label: '내 학습데이터', icon: DATASET_ICON },
  { to: '/workspace/augment', label: '데이터 증강', icon: Layers },
  { to: '/workspace/favorites', label: '즐겨찾기', icon: Heart },
]

/** 워크스페이스 공통 레이아웃 (좌측 LNB) */
export function WorkspaceLayout() {
  const { loggedIn } = useDemoAuth()
  return (
    <Container className="py-10">
      {/* min-h: 콘텐츠가 짧아도 행이 사이드바보다 커서 좌측 LNB가 항상 sticky 고정되게 함 (헤더64+상하 py-10 80 = 9rem 제외) */}
      <div className="flex min-h-[calc(100vh-9rem)] items-start gap-8">
        {/* top: 헤더 h-16(64px) + 컨테이너 py-10(40px) = 104px. 자연 위치와 맞춰 스크롤 초반 상단 여백이 변하지 않게 함 */}
        <aside
          className={cn(
            'sticky top-[104px] hidden w-60 shrink-0 lg:block',
            // 비로그인 시 셸 전체를 잠긴 미리보기로: 딤 처리 + 클릭·선택 차단
            !loggedIn && 'pointer-events-none select-none opacity-60',
          )}
          aria-hidden={!loggedIn}
        >
          {/* 사용자 카드 (비로그인 시 게스트) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            {loggedIn ? (
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-cobalt-50 text-base font-bold text-cobalt-700">
                  {demoUser.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900">{demoUser.name}</p>
                  <p className="truncate text-sm text-slate-500">{demoUser.org}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <UserRound className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-400">게스트</p>
                  <p className="truncate text-sm text-slate-400">로그인이 필요합니다</p>
                </div>
              </div>
            )}
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
            <Link
              to="/guide/how"
              className="mt-2.5 inline-block text-sm font-semibold text-cobalt-700 hover:underline"
            >
              이용 가이드 바로가기
            </Link>
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
