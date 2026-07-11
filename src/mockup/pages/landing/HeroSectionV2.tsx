import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { HeroVoxelBuddy, type HeroPoseKey } from './HeroVoxelBuddy'

// 캐릭터 동작별 헤드라인 문구. lead(일반) + emph(브랜드 그라데이션 강조).
const HEADLINES: Record<HeroPoseKey, { lead: string; emph: string }> = {
  search: { lead: '데이터를 찾고', emph: '발견해요' },
  float: { lead: 'AI로 데이터를', emph: '증강해요' },
  face: { lead: '새로운 데이터를', emph: '만들어요' },
  dash: { lead: '데이터 가치를', emph: '분석해요' },
  shield: { lead: '안전하고 신뢰할 수 있게', emph: '지원해요' },
}

export function HeroSectionV2() {
  const navigate = useNavigate()
  // 초기/휴지 구간엔 직전 동작 문구를 유지(기본 문구 없음). 첫 노출은 첫 동작(search).
  const [pose, setPose] = useState<HeroPoseKey>('search')
  const [query, setQuery] = useState('')
  const msg = HEADLINES[pose]

  return (
    <section className="hero-gradient relative flex min-h-[680px] items-center overflow-hidden">
      {/* 배경 장식: 도트 그리드 + 드리프트 글로우 (콘텐츠 뒤 레이어) */}
      <div aria-hidden className="absolute inset-0">
        <div className="hero-dots absolute inset-0" />
        <div className="hero-blob-a absolute -top-24 right-[6%] size-[440px] rounded-full blur-2xl" />
        <div className="hero-blob-b absolute -bottom-32 left-[16%] size-[400px] rounded-full blur-2xl" />
      </div>

      {/* 풀블리드 복셀 캐릭터 (정자세→탐색 포즈 모핑). 데스크톱은 우측 배치 */}
      {/* 동작이 바뀔 때마다 좌측 헤드라인 문구를 동기화 */}
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
          <h1
            key={pose}
            className="hero-headline min-h-[2.5em] text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-900 lg:text-[3.4rem] lg:leading-[1.18]"
          >
            {msg.lead}
            <br />
            <span className="text-gradient-cobalt">{msg.emph}</span>
          </h1>
          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-slate-600"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          >
            재난·안전 CCTV 영상 기반 AI 학습데이터를
            <br />
            검색하고 활용하세요.
          </motion.p>

          {/* 검색 진입점 */}
          <motion.form
            className="mt-8 flex max-w-lg items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
            onSubmit={(e) => {
              e.preventDefault()
              navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search')
            }}
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="데이터셋명, 키워드로 검색"
                aria-label="학습데이터 검색"
                className="h-13 w-full rounded-full border border-slate-300 bg-white/90 pr-4 pl-12 text-base text-slate-900 shadow-sm backdrop-blur placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="h-13">
              검색
            </Button>
          </motion.form>

          {/* 이벤트 유형 빠른 필터 칩 (스태거 등장) */}
          <div className="mt-4 flex max-w-lg flex-wrap items-center gap-2">
            {EVENT_TYPES_MAIN.map((t, i) => (
              <motion.button
                key={t.key}
                type="button"
                onClick={() => navigate(`/search?type=${t.key}`)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.36 + i * 0.05, ease: 'easeOut' }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 backdrop-blur transition-colors hover:border-cobalt-200 hover:bg-white hover:text-cobalt-700"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: `var(--color-event-${t.key})` }}
                />
                {t.label}
              </motion.button>
            ))}
            <motion.button
              type="button"
              onClick={() => navigate('/search')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.36 + EVENT_TYPES_MAIN.length * 0.05, ease: 'easeOut' }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-cobalt-700 transition-colors hover:bg-cobalt-50"
            >
              전체보기 →
            </motion.button>
          </div>
        </div>
      </Container>
    </section>
  )
}
