import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

interface HubItem {
  to: string
  tag: string
  title: string
  desc: string
}

const ITEMS: HubItem[] = [
  {
    to: '/',
    tag: 'A안',
    title: '랜딩페이지 A안',
    desc: '데이터 통계와 지역 현황 중심의 정보형 구성.',
  },
  {
    to: '/v2',
    tag: 'B안',
    title: '랜딩페이지 B안',
    desc: '데이터 흐름과 캐릭터를 강조한 비주얼형 구성.',
  },
]

/** 랜딩페이지 A안·B안을 선택해 들어가는 허브 화면 (간담회 시안 비교용) */
export function HubPage() {
  return (
    <Container className="flex min-h-screen items-center py-16">
      <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'group flex flex-col rounded-2xl border border-slate-200 bg-white p-7',
              'transition-colors hover:border-cobalt-300 hover:bg-cobalt-50/40',
            )}
          >
            <span className="inline-flex w-fit rounded-lg bg-cobalt-50 px-3 py-1 text-sm font-bold text-cobalt-700">
              {item.tag}
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-2 flex-1 text-base text-slate-500">{item.desc}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-cobalt-700">
              바로 보기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </Container>
  )
}
