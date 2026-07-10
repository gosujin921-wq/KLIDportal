import { HeroSectionV2 } from './HeroSectionV2'
import { ValueFlowSection } from './ValueFlowSection'
import { WowSection } from './WowSection'
import { StatsSection } from './StatsSection'
import { EventShowcaseSection } from './EventShowcaseSection'
import { PopularSection } from './PopularSection'
import { NoticeSection } from './NoticeSection'
import { PopupNoticeModal } from './PopupNoticeModal'

/**
 * 랜딩 정본 (구 landing-v2).
 * 모든 섹션을 pages/landing 안에 복사해 보유 — 자유롭게 수정 가능.
 * 기획 v2: 지역별 지도는 메인에서 제외(소식&참여 > 데이터 현황 전용), 팝업 공지 모달 추가.
 */
export function LandingPage() {
  return (
    <>
      <HeroSectionV2 />
      <ValueFlowSection />
      <WowSection />
      <StatsSection />
      <EventShowcaseSection />
      <PopularSection />
      <NoticeSection />
      <PopupNoticeModal />
    </>
  )
}
