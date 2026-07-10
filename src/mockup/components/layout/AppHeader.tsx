import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, TriangleAlert, UserCircle } from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'
import { Container } from '@/mockup/components/ui/Container'
import { Modal } from '@/mockup/components/ui/Modal'
import { Logo } from '@/mockup/components/Logo'
import { SitemapOverlay } from '@/mockup/components/SitemapOverlay'
import { useDemoAuth } from '@/mockup/demoAuth'
import { cn } from '@/lib/cn'

/** 기획 확정 GNB: 학습데이터 | 워크스페이스 | 소식&참여 | 이용안내 */
const NAV = [
  { to: '/search', label: '학습데이터' },
  { to: '/workspace', label: '워크스페이스' },
  { to: '/news', label: '소식&참여' },
  { to: '/guide', label: '이용안내' },
]

export function AppHeader() {
  const navigate = useNavigate()
  const { loggedIn, logout } = useDemoAuth()
  const [sitemapOpen, setSitemapOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <NavLink to="/" aria-label="AI 영상학습 사용자 포털 홈">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3.5 py-2 text-base font-medium transition-colors',
                  isActive
                    ? 'text-cobalt-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="사이트맵"
            onClick={() => setSitemapOpen(true)}
            className="mr-1 hidden size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          >
            <Menu className="size-5" />
          </button>

          {loggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setLogoutOpen(true)}>
                로그아웃
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/mypage')}>
                <UserCircle className="size-4.5" />
                마이페이지
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                회원가입
              </Button>
            </>
          )}
        </div>
      </Container>

      <SitemapOverlay open={sitemapOpen} onClose={() => setSitemapOpen(false)} />

      {/* 로그아웃 확인 (기획 v2: 진행중 작업 경고 후 세션 종료) */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="로그아웃">
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm leading-relaxed text-amber-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          진행중인 작업이 있습니다: 다운로드 2건 · 저작 1건
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          로그아웃하면 진행중인 다운로드가 중단될 수 있습니다. 로그아웃할까요?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
            머무르기
          </Button>
          <Button
            onClick={() => {
              setLogoutOpen(false)
              logout()
              navigate('/')
            }}
          >
            로그아웃
          </Button>
        </div>
      </Modal>
    </header>
  )
}
