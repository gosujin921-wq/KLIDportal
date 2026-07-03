import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LandingPageV2 } from '@/pages/landing-v2/LandingPageV2'
import { LandingPageKRDS } from '@/pages/landing-krds/LandingPageKRDS'
import { ComponentsPage } from '@/pages/components/ComponentsPage'
import { HubPage } from '@/pages/HubPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { PortalApp } from '@/krds/PortalApp'

export default function App() {
  return (
    <BrowserRouter>
      {/* 시스템 reduced-motion 설정을 모든 motion 컴포넌트에 전역 반영 */}
      <MotionConfig reducedMotion="user">
        <Routes>
          {/* 허브는 헤더·푸터 없이 단독 렌더링 */}
          <Route path="/hub" element={<HubPage />} />
          {/* KRDS/KLID 정부 민원 포털 — 자체 셸 단독 서페이스 */}
          <Route path="/portal/*" element={<PortalApp />} />
          <Route
            path="*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LandingPageV2 />} />
                  <Route path="/krds" element={<LandingPageKRDS />} />
                  <Route path="/demo-v2" element={<LandingPage />} />
                  <Route path="/components" element={<ComponentsPage />} />
                  <Route path="/search" element={<PlaceholderPage title="데이터 검색" />} />
                  <Route path="/authoring" element={<PlaceholderPage title="저작 도구" />} />
                  <Route path="/genai" element={<PlaceholderPage title="생성형 AI" />} />
                  <Route path="/workspace" element={<PlaceholderPage title="워크스페이스" />} />
                  <Route path="*" element={<PlaceholderPage title="페이지를 찾을 수 없습니다" />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </MotionConfig>
    </BrowserRouter>
  )
}
