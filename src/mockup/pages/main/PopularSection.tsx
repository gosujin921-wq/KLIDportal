import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { DatasetCard } from '@/mockup/components/DatasetCard'
import { SectionHeading } from './StatsSection'
import { Mark } from '@/mockup/components/ui/Mark'
import { POPULAR_DATASETS } from '@/mockup/mocks/datasets'

/** 인기 데이터셋: 다운로드 상위 데이터셋 노출 → 탐색 유도 */
export function PopularSection() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="POPULAR"
              title={
                <>
                  많이 찾은 <Mark>인기 학습데이터</Mark>
                </>
              }
              desc="다운로드가 많은 데이터셋부터 살펴보세요."
            />
            <Link
              to="/search"
              className="mb-1 hidden shrink-0 items-center gap-1 text-base font-semibold text-cobalt-700 hover:underline sm:inline-flex"
            >
              전체 데이터셋 보기
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {POPULAR_DATASETS.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.06}>
              <DatasetCard dataset={d} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
