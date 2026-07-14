import { Link } from 'react-router-dom'
import { Search, Download, PenTool, Sparkles, ArrowRight } from 'lucide-react'
import { HeroVoxelBuddy } from '@/mockup/pages/main/HeroVoxelBuddy'

const FLOW = [
  { icon: Search, title: '검색', desc: '이벤트 유형·지역 조건으로\n학습데이터를 찾습니다.' },
  { icon: Download, title: '신청·다운로드', desc: '승인 후 워크스페이스에서\n데이터를 내려받습니다.' },
  { icon: PenTool, title: '제작', desc: '업로드한 영상을\n저작도구로 라벨링합니다.' },
  { icon: Sparkles, title: '데이터 증강', desc: '시간·계절·날씨 조건을 반영해\n학습데이터를 늘립니다.' },
]

const FEATURES = [
  {
    pose: 'search',
    title: '학습데이터 검색',
    desc: '재난·안전 CCTV 영상 기반 AI 학습데이터를\n다양한 조건으로 검색하고 다운로드하세요.',
    to: '/search',
    cta: '데이터 검색하기',
  },
  {
    pose: 'dash',
    title: '저작도구',
    desc: '업로드한 영상에 직접 마킹·라벨링하여\n나만의 학습데이터를 만들어 보세요.',
    to: '/workspace/authoring',
    cta: '저작도구 시작하기',
  },
  {
    pose: 'float',
    title: 'AI 데이터 증강',
    desc: 'AI 기술로 시간·계절·날씨 조건을 반영해\n학습데이터를 다양하게 확장해 보세요.',
    to: '/workspace/augment',
    cta: 'AI 증강 알아보기',
  },
] as const

/** 서비스 소개 */
export function ServiceIntroPage() {
  return (
    <>
      {/* 인트로 */}
      <section className="hero-gradient-center overflow-hidden rounded-3xl border border-slate-200 px-8 py-12 text-center">
        <p className="text-sm font-bold tracking-wider text-cobalt-700">SERVICE</p>
        <h2 className="mx-auto mt-3 max-w-2xl break-keep text-3xl font-extrabold text-slate-900 lg:text-4xl">
          지자체 CCTV 재난·안전 영상으로 만든
          <br />
          <span className="text-gradient-cobalt">AI 학습데이터 포털</span>
        </h2>
        <p className="mx-auto mt-4 max-w-4xl break-keep text-lg leading-relaxed text-pretty text-slate-600">
          흩어진 원본 영상을 한데 모으고, AI 증강 기술로 활용 가능한 학습데이터로 확장해 기업·연구자에게 제공합니다.
        </p>
      </section>

      {/* 핵심 흐름 */}
      <section className="mt-12">
        <h3 className="text-xl font-extrabold text-slate-900">이렇게 이용하세요</h3>
        <div className="relative mt-10">
          {/* 단계 연결선 (데스크톱) */}
          <div
            className="absolute top-12 left-[12.5%] right-[12.5%] hidden border-t-2 border-dashed border-cobalt-300 md:block"
            aria-hidden
          />
          <ol className="relative grid gap-y-10 gap-x-4 sm:grid-cols-2 md:grid-cols-4">
            {FLOW.map((f, i) => (
              <li key={f.title} className="flex flex-col items-center text-center">
                <div className="relative">
                  <span className="card-soft flex size-24 items-center justify-center rounded-full border-[3px] border-cobalt-600 bg-white text-cobalt-600">
                    <f.icon className="size-9" strokeWidth={2.25} />
                  </span>
                  <span className="absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-cobalt-600 text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-5 text-lg font-bold text-slate-900">{f.title}</p>
                <p className="mt-2 max-w-[15rem] whitespace-pre-line break-keep text-sm leading-relaxed text-slate-500">
                  {f.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 기능 카드 */}
      <section className="mt-12">
        <h3 className="text-xl font-extrabold text-slate-900">주요 기능</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-soft flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {/* 기능별 캐릭터 (해당 동작으로 고정) */}
              <div className="relative h-56 border-b border-slate-100 bg-gradient-to-b from-cobalt-50/70 to-white">
                <HeroVoxelBuddy pose={f.pose} center zoom={1.4} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-lg font-bold text-slate-900">{f.title}</p>
                <p className="mt-2 flex-1 whitespace-pre-line break-keep text-base leading-relaxed text-slate-600">
                  {f.desc}
                </p>
                <Link
                  to={f.to}
                  className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-cobalt-700 hover:underline"
                >
                  {f.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
