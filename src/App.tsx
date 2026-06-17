import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LandingPageV2 } from '@/pages/landing-v2/LandingPageV2'
import { HubPage } from '@/pages/HubPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* 시스템 reduced-motion 설정을 모든 motion 컴포넌트에 전역 반영 */}
      <MotionConfig reducedMotion="user">
        <Routes>
          {/* 허브는 헤더·푸터 없이 단독 렌더링 */}
          <Route path="/hub" element={<HubPage />} />
          <Route
            path="*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/v2" element={<LandingPageV2 />} />
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
