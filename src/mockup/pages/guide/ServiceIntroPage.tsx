import { Link } from 'react-router-dom'
import { Search, Download, PenTool, Sparkles, ArrowRight } from 'lucide-react'

const FLOW = [
  { icon: Search, title: '검색', desc: '이벤트 유형·지역 조건으로 학습데이터를 찾습니다.' },
  { icon: Download, title: '신청·다운로드', desc: '승인 후 워크스페이스에서 데이터를 내려받습니다.' },
  { icon: PenTool, title: '제작', desc: '업로드한 영상을 저작도구로 라벨링합니다.' },
  { icon: Sparkles, title: '증강·생성', desc: 'AI로 데이터를 늘리거나 새 영상을 생성합니다.' },
]

const FEATURES = [
  {
    icon: Search,
    title: '학습데이터 검색',
    desc: '재난·안전 CCTV 영상 기반 AI 학습데이터를 다양한 조건으로 검색하고 다운로드하세요.',
    to: '/search',
    cta: '데이터 검색하기',
  },
  {
    icon: PenTool,
    title: '저작도구',
    desc: '업로드한 영상에 직접 마킹·라벨링하여 나만의 학습데이터를 만들어 보세요.',
    to: '/workspace/authoring',
    cta: '저작도구 시작하기',
  },
  {
    icon: Sparkles,
    title: 'AI 데이터 증강·생성',
    desc: 'AI 기술로 학습데이터를 증강하고 생성형 AI로 새로운 영상을 만들어 보세요.',
    to: '/workspace/genai',
    cta: 'AI 기능 알아보기',
  },
]

/** 서비스 소개 */
export function ServiceIntroPage() {
  return (
    <>
      {/* 인트로 */}
      <section className="hero-gradient overflow-hidden rounded-3xl border border-slate-200 px-8 py-12 text-center">
        <p className="text-sm font-bold tracking-wider text-cobalt-700">SERVICE</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold text-slate-900 lg:text-4xl">
          지자체 CCTV 재난·안전 영상으로 만든
          <br />
          <span className="text-gradient-cobalt">AI 학습데이터 포털</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
          흩어진 원본 영상을 한데 모으고, AI 증강·생성 기술로 활용 가능한 학습데이터로 확장해
          기업·연구자에게 제공합니다.
        </p>
      </section>

      {/* 핵심 흐름 */}
      <section className="mt-12">
        <h3 className="text-xl font-extrabold text-slate-900">이렇게 이용하세요</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {FLOW.map((f, i) => (
            <div key={f.title} className="relative rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600">
                <f.icon className="size-5.5" />
              </span>
              <p className="mt-4 text-lg font-bold text-slate-900">
                <span className="mr-1.5 text-cobalt-500">{i + 1}</span>
                {f.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              {i < FLOW.length - 1 && (
                <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 text-slate-300 md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 기능 카드 */}
      <section className="mt-12">
        <h3 className="text-xl font-extrabold text-slate-900">주요 기능</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-glow flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-cobalt-600 text-white">
                <f.icon className="size-6" />
              </span>
              <p className="mt-4 text-lg font-bold text-slate-900">{f.title}</p>
              <p className="mt-2 flex-1 text-base leading-relaxed text-slate-600">{f.desc}</p>
              <Link
                to={f.to}
                className="mt-4 inline-flex items-center gap-1 text-base font-semibold text-cobalt-700 hover:underline"
              >
                {f.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 운영 기관 */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-7">
        <p className="text-sm font-bold tracking-wider text-slate-400">운영 기관</p>
        <p className="mt-2 text-lg font-bold text-slate-800">
          한국지역정보개발원(KLID) · 행정안전부
        </p>
        <p className="mt-1 text-base text-slate-500">
          AI 기반 지방정부 CCTV 관제지원시스템 구축(2차)
        </p>
      </section>
    </>
  )
}
