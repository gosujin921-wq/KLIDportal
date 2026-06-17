import { HeroSectionV2 } from './HeroSectionV2'
import { ValueFlowSection } from '../landing/ValueFlowSection'
import { WowSection } from '../landing/WowSection'
import { StatsSection } from '../landing/StatsSection'
import { RegionSection } from '../landing/RegionSection'
import { NoticeSection } from '../landing/NoticeSection'

/**
 * 랜딩 v2 — 기존 섹션은 그대로 재사용하고 히어로만 새 스토리(모으기→증강)로 교체.
 * 기존 / 와 비교용. 라우트: /v2
 */
export function LandingPageV2() {
  return (
    <>
      <HeroSectionV2 />
      <ValueFlowSection />
      <WowSection />
      <StatsSection />
      <RegionSection />
      <NoticeSection />
    </>
  )
}
