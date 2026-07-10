import { createContext, useContext, useState, type ReactNode } from 'react'

/** 데모용 로그인 상태 (실제 인증 없음). 헤더 분기·워크스페이스 잠금 데모에 사용. */
interface DemoAuth {
  loggedIn: boolean
  login: () => void
  logout: () => void
}

const DemoAuthContext = createContext<DemoAuth | null>(null)

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <DemoAuthContext.Provider
      value={{ loggedIn, login: () => setLoggedIn(true), logout: () => setLoggedIn(false) }}
    >
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth(): DemoAuth {
  const ctx = useContext(DemoAuthContext)
  if (!ctx) throw new Error('useDemoAuth must be used within DemoAuthProvider')
  return ctx
}
