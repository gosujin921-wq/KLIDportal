import { Outlet } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { TabNav } from '@/mockup/components/TabNav'

/* 기획 v2: 이용약관·개인정보처리방침은 GNB 제거, 푸터 전용 접근 (DFEAT-048) */
const TABS = [
  { to: '/guide', label: '서비스 소개', end: true },
  { to: '/guide/how', label: '이용 가이드' },
]

/** 이용안내 공통 레이아웃 (상단 탭) */
export function GuideLayout() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: '이용안내', to: '/guide' }]} />
      <h1 className="mt-4 mb-6 text-3xl font-extrabold tracking-tight text-slate-900">이용안내</h1>
      <TabNav items={TABS} />
      <div className="mt-8">
        <Outlet />
      </div>
    </Container>
  )
}
