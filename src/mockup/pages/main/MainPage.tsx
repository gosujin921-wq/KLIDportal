import { HeroSectionV2 } from './HeroSectionV2'
import { StatsSection } from './StatsSection'
import { ValueFlowSection } from './ValueFlowSection'
import { EventShowcaseSection } from './EventShowcaseSection'
import { PopularSection } from './PopularSection'
import { NoticeSection } from './NoticeSection'
import { PopupNoticeModal } from './PopupNoticeModal'

/**
 * 메인(홈) 정본 (구 landing-v2). 워크스페이스·로그인 도입으로 랜딩에서 포털 허브로 전환.
 * 기획 v2 기본 순서에서 서비스 소개 배너(기획 6번)만 상단으로 재배치.
 * [순서 변경 근거 메모] 핵심 기능 안내(검색·저작도구·AI증강)는 간담회 목적상
 * 페이지 하단이 아닌 보유 현황 직후 노출. v2 "디자이너 재배치 제안 가능" 조항 근거.
 */
export function MainPage() {
  return (
    <div className="bg-canvas">
      {/* 1. 빠른 검색 (히어로) */}
      <HeroSectionV2 />
      {/* 2. 보유 현황 (수치 카드) */}
      <StatsSection />
      {/* 3. 서비스 소개 배너 (기획 6번, 상단 재배치) */}
      <ValueFlowSection />
      {/* 4. 이벤트 유형별 쇼케이스 (8종) */}
      <EventShowcaseSection />
      {/* 5. 인기 데이터셋 */}
      <PopularSection />
      {/* 6. 최근 공지사항 */}
      <NoticeSection />
      <PopupNoticeModal />
    </div>
  )
}
