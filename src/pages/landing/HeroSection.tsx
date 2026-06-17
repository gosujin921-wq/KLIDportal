import { ChevronDown, Compass, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { formatNumber } from '@/lib/format'
import { portalStats } from '@/mocks/landing'
import { HeroCubes } from './HeroCubes'

export function HeroSection() {
  return (
    <section className="hero-gradient relative flex min-h-[680px] items-center overflow-hidden">
      {/* 배경 장식: 도트 그리드 + 드리프트 글로우 (큐브 뒤 레이어) */}
      <div aria-hidden className="absolute inset-0">
        <div className="hero-dots absolute inset-0" />
        <div className="hero-blob-a absolute -top-24 right-[6%] size-[440px] rounded-full blur-2xl" />
        <div className="hero-blob-b absolute -bottom-32 left-[16%] size-[400px] rounded-full blur-2xl" />
      </div>

      {/* 풀블리드 3D 큐브 (히어로 전체) */}
      <HeroCubes />

      {/* 텍스트 오버레이 */}
      <Container className="relative z-10">
        <Reveal className="max-w-xl py-20">
          {/* 라이브 스탯 칩: 사이트명 반복 대신 "지금 증식 중" 정보 전달 */}
          <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cobalt-200 bg-white px-4 py-1.5 text-xs font-semibold text-cobalt-700 shadow-sm">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cobalt-400 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-cobalt-500" />
            </span>
            학습 데이터셋 {formatNumber(portalStats.datasetCount)}세트 구축·제공 중
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 lg:text-[3.4rem] lg:leading-[1.18]">
            AI 학습데이터를
            <br />
            <span className="text-gradient-cobalt">더 크게 확장하세요</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
            원본 영상·이미지 데이터가 AI 증강과 생성 기술을 통해 활용 가능한 학습데이터로
            확장됩니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg">
              <Compass className="size-5" />
              데이터 탐색하기
            </Button>
            <Button variant="secondary" size="lg">
              <Sparkles className="size-5" />
              AI 데이터 생성하기
            </Button>
          </div>

          {/* 운영 주체 신뢰 라인 */}
          <p className="mt-12 text-sm text-slate-500">
            행정안전부 · 한국지역정보개발원(KLID) 운영
          </p>
        </Reveal>
      </Container>

      {/* 스크롤 유도 (bob 키프레임이 transform을 쓰므로 센터링은 부모에서) */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#flow"
          aria-label="아래로 스크롤"
          className="bob grid size-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm transition-colors hover:text-cobalt-600"
        >
          <ChevronDown className="size-5" />
        </a>
      </div>
    </section>
  )
}
