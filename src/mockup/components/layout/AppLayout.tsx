import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { AppFooter } from './AppFooter'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
