import { HeroSection } from './HeroSection'
import { EventMarquee } from './EventMarquee'
import { ValueFlowSection } from './ValueFlowSection'
import { WowSection } from './WowSection'
import { StatsSection } from './StatsSection'
import { RegionSection } from './RegionSection'
import { NoticeSection } from './NoticeSection'
import { CtaSection } from './CtaSection'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <EventMarquee />
      <ValueFlowSection />
      <WowSection />
      <StatsSection />
      <RegionSection />
      <NoticeSection />
      <CtaSection />
    </>
  )
}
