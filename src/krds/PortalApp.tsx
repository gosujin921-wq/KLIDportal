import { useNavigate, useLocation } from 'react-router-dom'
import { KlidHeader } from './screens/Header'
import { KlidFooter } from './screens/Footer'
import { HomeScreen } from './screens/HomeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { ApplyFormScreen } from './screens/ApplyFormScreen'
import { LoginScreen } from './screens/LoginScreen'

export type PortalScreen = 'home' | 'search' | 'apply' | 'login'

/**
 * KRDS / KLID 정부 민원 포털 셸 — claude.ai/design "KRDS / KLID Design System" 이식.
 * 자체 Header/Footer + 화면 4종. 코발트 AppLayout 밖, /portal/* 단독 서페이스.
 */
export function PortalApp() {
  const navigate = useNavigate()
  const location = useLocation()
  const sub = location.pathname.replace(/^\/portal\/?/, '').split('/')[0]
  const current: PortalScreen = (['search', 'apply', 'login'].includes(sub) ? sub : 'home') as PortalScreen

  const onNavigate = (screen: PortalScreen) => {
    navigate(screen === 'home' ? '/portal' : `/portal/${screen}`)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--krds-font-sans)',
        color: 'var(--krds-color-text-default)',
        background: 'var(--krds-color-surface-default)',
        letterSpacing: 'var(--krds-letter-spacing-normal)',
      }}
    >
      <KlidHeader onNavigate={onNavigate} current={current} />
      <div style={{ flex: 1 }}>
        {current === 'home' && <HomeScreen onNavigate={onNavigate} />}
        {current === 'search' && <SearchScreen onNavigate={onNavigate} />}
        {current === 'apply' && <ApplyFormScreen onNavigate={onNavigate} />}
        {current === 'login' && <LoginScreen onNavigate={onNavigate} />}
      </div>
      <KlidFooter onNavigate={onNavigate} />
    </div>
  )
}
