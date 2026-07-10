import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/search', label: '데이터 검색' },
  { to: '/authoring', label: '저작 도구' },
  { to: '/genai', label: '생성형 AI' },
  { to: '/workspace', label: '워크스페이스' },
]

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <NavLink to="/" aria-label="영상학습 데이터포털 홈">
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
          <Button variant="ghost" size="sm">
            로그인
          </Button>
          <Button size="sm">회원가입</Button>
        </div>
      </Container>
    </header>
  )
}
