import { Outlet } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { TabNav } from '@/mockup/components/TabNav'

const TABS = [
  { to: '/news', label: '데이터 현황', end: true },
  { to: '/news/notices', label: '공지사항' },
  { to: '/news/faq', label: 'FAQ' },
  { to: '/news/inquiry', label: '문의하기' },
  { to: '/news/cases', label: '활용사례' },
]

/** 소식&참여 공통 레이아웃 (상단 탭) */
export function NewsLayout() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: '소식&참여', to: '/news' }]} />
      <h1 className="mt-4 mb-6 text-3xl font-extrabold tracking-tight text-slate-900">소식&참여</h1>
      <TabNav items={TABS} />
      <div className="mt-8">
        <Outlet />
      </div>
    </Container>
  )
}
