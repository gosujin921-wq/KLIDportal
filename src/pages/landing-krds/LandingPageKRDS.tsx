import { HeroSectionKRDS } from './HeroSectionKRDS'
import { FeaturesSectionKRDS } from './FeaturesSectionKRDS'
import { StatsSectionKRDS } from './StatsSectionKRDS'
import { NoticeSectionKRDS } from './NoticeSectionKRDS'
import { CtaSectionKRDS } from './CtaSectionKRDS'

/**
 * KRDS 랜딩 — 신규 메인(/).
 * 히어로는 v2 애니메이션(HeroVoxelBuddy)을 재사용하고, 본문은 KRDS 디자인시스템
 * 구조(Button/Badge/Tag 스펙)로 구성. 색은 브랜드 프라이머리(코발트 #2e45dc) 사용.
 */
export function LandingPageKRDS() {
  return (
    <>
      <HeroSectionKRDS />
      <FeaturesSectionKRDS />
      <StatsSectionKRDS />
      <NoticeSectionKRDS />
      <CtaSectionKRDS />
    </>
  )
}
