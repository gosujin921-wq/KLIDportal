import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { DemoAuthProvider } from '@/mockup/demoAuth'
import { SavedSearchProvider } from '@/mockup/savedSearches'
import { DemoWorkspaceProvider } from '@/mockup/demoWorkspace'
import { AppLayout } from '@/mockup/components/layout/AppLayout'
import { MainPage } from '@/mockup/pages/main/MainPage'
import { PlaceholderPage } from '@/mockup/pages/PlaceholderPage'
import { StyleGuide } from '@/mockup/pages/StyleGuide'
import { SearchPage } from '@/mockup/pages/search/SearchPage'
import { DatasetDetailPage } from '@/mockup/pages/search/DatasetDetailPage'
import { WorkspaceLayout } from '@/mockup/pages/workspace/WorkspaceLayout'
import { DashboardPage } from '@/mockup/pages/workspace/DashboardPage'
import { UploadPage } from '@/mockup/pages/workspace/UploadPage'
import { AuthoringListPage } from '@/mockup/pages/workspace/AuthoringListPage'
import { AuthoringToolPage } from '@/mockup/pages/workspace/AuthoringToolPage'
import { MyDatasetsPage } from '@/mockup/pages/workspace/MyDatasetsPage'
import { AugmentPage } from '@/mockup/pages/workspace/AugmentPage'
import { WsFavoritesPage } from '@/mockup/pages/workspace/WsFavoritesPage'
import { NewsLayout } from '@/mockup/pages/news/NewsLayout'
import { DataStatusPage } from '@/mockup/pages/news/DataStatusPage'
import { NoticesPage } from '@/mockup/pages/news/NoticesPage'
import { FaqPage } from '@/mockup/pages/news/FaqPage'
import { InquiryPage } from '@/mockup/pages/news/InquiryPage'
import { CasesPage } from '@/mockup/pages/news/CasesPage'
import { GuideLayout } from '@/mockup/pages/guide/GuideLayout'
import { ServiceIntroPage } from '@/mockup/pages/guide/ServiceIntroPage'
import { HowToPage } from '@/mockup/pages/guide/HowToPage'
import { LegalPage } from '@/mockup/pages/guide/LegalPage'
import { LoginPage } from '@/mockup/pages/auth/LoginPage'
import { SignupPage } from '@/mockup/pages/auth/SignupPage'
import { FindAccountPage } from '@/mockup/pages/auth/FindAccountPage'
import { MyPageLayout } from '@/mockup/pages/mypage/MyPageLayout'
import { MyDashboardPage } from '@/mockup/pages/mypage/MyDashboardPage'
import { HistoryPage } from '@/mockup/pages/mypage/HistoryPage'
import { AccountPage } from '@/mockup/pages/mypage/AccountPage'
import { AdminLayout } from '@/mockup/pages/admin/AdminLayout'
import { AdminDashboardPage } from '@/mockup/pages/admin/AdminDashboardPage'
import { AdminNoticesPage } from '@/mockup/pages/admin/AdminNoticesPage'
import { AdminPlaceholderPage } from '@/mockup/pages/admin/AdminPlaceholderPage'

/** 라우트 전환 시 스크롤 최상단 복귀 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** 사용자 포털 (헤더 + 푸터 셸) */
function PortalRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/style" element={<StyleGuide />} />

        {/* 학습데이터 */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/:id" element={<DatasetDetailPage />} />

        {/* 저작도구 라벨링 화면 (풀블리드, 워크스페이스 LNB 밖) */}
        <Route path="/workspace/authoring/:taskId" element={<AuthoringToolPage />} />

        {/* 워크스페이스 (좌측 LNB, 기획 v2: 데이터 증강·즐겨찾기 추가) */}
        <Route path="/workspace" element={<WorkspaceLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="authoring" element={<AuthoringListPage />} />
          <Route path="datasets" element={<MyDatasetsPage />} />
          <Route path="augment" element={<AugmentPage />} />
          <Route path="favorites" element={<WsFavoritesPage />} />
        </Route>

        {/* 구 라우트 이관 */}
        <Route path="/authoring" element={<Navigate to="/workspace/authoring" replace />} />

        {/* 소식&참여 (상단 탭) */}
        <Route path="/news" element={<NewsLayout />}>
          <Route index element={<DataStatusPage />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="inquiry" element={<InquiryPage />} />
          <Route path="cases" element={<CasesPage />} />
        </Route>

        {/* 이용안내 (상단 탭, 기획 v2: 2탭) */}
        <Route path="/guide" element={<GuideLayout />}>
          <Route index element={<ServiceIntroPage />} />
          <Route path="how" element={<HowToPage />} />
        </Route>

        {/* 이용약관·개인정보처리방침 (기획 v2: 푸터 전용 접근) */}
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/guide/terms" element={<Navigate to="/terms" replace />} />
        <Route path="/guide/privacy" element={<Navigate to="/privacy" replace />} />

        {/* 회원 (독립 페이지) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-id" element={<FindAccountPage kind="id" />} />
        <Route path="/find-password" element={<FindAccountPage kind="password" />} />

        {/* 마이페이지 (좌측 LNB, 기획 v2: 대시보드·이용내역·회원정보) */}
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route index element={<MyDashboardPage />} />
          <Route path="favorites" element={<Navigate to="/workspace/favorites" replace />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="account" element={<AccountPage />} />
        </Route>

        <Route path="*" element={<PlaceholderPage title="페이지를 찾을 수 없습니다" />} />
      </Routes>
    </AppLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* 시스템 reduced-motion 설정을 모든 motion 컴포넌트에 전역 반영 */}
      <MotionConfig reducedMotion="user">
        <DemoAuthProvider>
          <SavedSearchProvider>
          <DemoWorkspaceProvider>
          <Routes>
            {/* 관리자 (별도 레이아웃, 포털 셸 밖) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route
                path="downloads"
                element={
                  <AdminPlaceholderPage title="다운로드 현황 관리" desc="다운로드 신청·승인 현황을 관리합니다." withExcel />
                }
              />
              <Route
                path="members"
                element={
                  <AdminPlaceholderPage title="회원 현황 관리" desc="회원 목록을 조회하고 계정을 관리합니다." withExcel />
                }
              />
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route
                path="faq"
                element={<AdminPlaceholderPage title="FAQ 관리" desc="자주 묻는 질문을 등록·수정합니다." />}
              />
              <Route
                path="inquiries"
                element={<AdminPlaceholderPage title="문의 관리" desc="접수된 문의에 답변합니다." />}
              />
              <Route
                path="cases"
                element={<AdminPlaceholderPage title="활용사례 관리" desc="활용사례를 등록·수정합니다." />}
              />
              <Route
                path="content"
                element={
                  <AdminPlaceholderPage title="콘텐츠 관리" desc="이용약관·개인정보처리방침을 편집하고 개정 이력을 관리합니다." />
                }
              />
            </Route>

            {/* 사용자 포털 */}
            <Route path="/*" element={<PortalRoutes />} />
          </Routes>
          </DemoWorkspaceProvider>
          </SavedSearchProvider>
        </DemoAuthProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
