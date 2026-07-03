import { Search, PenTool, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeadingKRDS } from './SectionHeadingKRDS'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  steps: string[]
}

// 포털 핵심 기능. 회의 1차 정리본 기준 흐름.
const FEATURES: Feature[] = [
  {
    icon: Search,
    title: '데이터 검색·반출',
    desc: '이벤트 유형 중심 조건 검색으로 필요한 영상·이미지 세트를 찾고 반출 요청합니다.',
    steps: ['이벤트·지역 조건 검색', '미리보기·상세 확인', '반출 요청·다운로드'],
  },
  {
    icon: PenTool,
    title: '저작 도구',
    desc: '영상을 올려 이미지로 자르고, 라벨링과 증강으로 학습데이터를 직접 만듭니다.',
    steps: ['영상 업로드', '이미지 컷·수동 라벨링', '조건별 증강'],
  },
  {
    icon: Sparkles,
    title: '생성형 AI',
    desc: '이미지를 입력해 시간·날씨 조건을 반영한 영상을 생성하고 내려받습니다.',
    steps: ['이미지 업로드', '영상 생성', '결과 다운로드'],
  },
  {
    icon: LayoutGrid,
    title: '워크스페이스',
    desc: '반출 현황과 처리 상태, 다운로드 기한과 작업 결과물을 한곳에서 관리합니다.',
    steps: ['반출·작업 현황', '다운로드 관리', '유효기간 확인'],
  },
]

export function FeaturesSectionKRDS() {
  return (
    <section className="bg-slate-50 py-20">
      <Container>
        <Reveal>
          <SectionHeadingKRDS
            eyebrow="WHAT YOU CAN DO"
            title="검색부터 제작까지, 한 포털에서"
            desc="데이터를 찾고 반출하거나, 직접 가공하고 생성해 활용 가능한 학습데이터로 확장합니다."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <article className="card-glow flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600">
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-base text-slate-600">{f.desc}</p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                  {f.steps.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <ArrowRight className="size-4 shrink-0 text-cobalt-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
