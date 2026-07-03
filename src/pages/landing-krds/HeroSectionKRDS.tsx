import { useState } from 'react'
import { Compass, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { HeroVoxelBuddy, type HeroPoseKey } from '../landing-v2/HeroVoxelBuddy'

// 캐릭터 동작별 헤드라인 문구. lead(일반) + emph(KRDS 그라데이션 강조).
// v2 히어로 애니메이션(HeroVoxelBuddy)을 그대로 재사용하고 룩만 KRDS 톤으로.
const HEADLINES: Record<HeroPoseKey, { lead: string; emph: string }> = {
  search: { lead: '데이터를 찾고', emph: '발견해요' },
  float: { lead: 'AI로 데이터를', emph: '증강해요' },
  face: { lead: '새로운 데이터를', emph: '만들어요' },
  dash: { lead: '데이터 가치를', emph: '분석해요' },
  shield: { lead: '안전하고 신뢰할 수 있게', emph: '지원해요' },
}

export function HeroSectionKRDS() {
  // 초기/휴지 구간엔 직전 동작 문구를 유지. 첫 노출은 첫 동작(search).
  const [pose, setPose] = useState<HeroPoseKey>('search')
  const msg = HEADLINES[pose]

  return (
    <section className="hero-gradient relative flex min-h-[680px] items-center overflow-hidden">
      {/* 배경 장식: 도트 그리드 + 드리프트 글로우 (콘텐츠 뒤 레이어) */}
      <div aria-hidden className="absolute inset-0">
        <div className="hero-dots absolute inset-0" />
        <div className="hero-blob-a absolute -top-24 right-[6%] size-[440px] rounded-full blur-2xl" />
        <div className="hero-blob-b absolute -bottom-32 left-[16%] size-[400px] rounded-full blur-2xl" />
      </div>

      {/* 풀블리드 복셀 캐릭터 (v2 애니메이션 재사용). 동작 변화에 좌측 문구 동기화 */}
      <HeroVoxelBuddy onPose={setPose} />

      <style>{`
        .hero-headline { animation: heroHeadlineSwap 0.5s ease-out both; }
        @keyframes heroHeadlineSwap {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-headline { animation: none; }
        }
      `}</style>

      {/* 텍스트 오버레이 (좌측) */}
      <Container className="relative z-10">
        <div className="max-w-xl py-20">
          <Tag variant="primary" size="lg" className="font-semibold tracking-wide">
            AI 영상학습 사용자 포털
          </Tag>
          <h1
            key={pose}
            className="hero-headline mt-5 min-h-[2.5em] text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 lg:text-[3.4rem] lg:leading-[1.18]"
          >
            {msg.lead}
            <br />
            <span className="text-gradient-cobalt">{msg.emph}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
            흩어진 원본 영상·이미지를 한데 모으고, AI 증강과 생성 기술로
            <br />
            활용 가능한 학습데이터로 확장합니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" size="lg">
              <Compass className="size-5" />
              데이터 탐색하기
            </Button>
            <Button variant="secondary" size="lg">
              <Sparkles className="size-5" />
              AI 데이터 생성하기
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
