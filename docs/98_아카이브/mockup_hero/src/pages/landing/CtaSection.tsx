import { Compass, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Mark } from '@/components/ui/Mark'

/** 푸터 직전 CTA 밴드. 딥 코발트 그라데이션 + 빅 타이포 (클라우드 포털 레퍼런스 패턴) */
export function CtaSection() {
  return (
    <section className="pb-20">
      <Container>
        <Reveal className="band-cobalt relative mx-auto overflow-hidden rounded-[2.5rem] px-8 py-20 text-center text-white lg:px-14">
          <div aria-hidden className="band-dots absolute inset-0" />
          <h2 className="relative text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
            AI 학습데이터,
            <br className="lg:hidden" /> 이제 직접{' '}
            <Mark className="bg-cobalt-500" delay={0.4}>
              확장
            </Mark>
            해보세요
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-cobalt-100">
            검색부터 증강·생성·반출까지, 하나의 워크스페이스에서 시작할 수 있습니다.
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-cobalt-700 hover:bg-cobalt-50 active:bg-cobalt-100"
            >
              <Compass className="size-5" />
              데이터 탐색하기
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-cobalt-300 text-white hover:bg-cobalt-800 active:bg-cobalt-900"
            >
              <Sparkles className="size-5" />
              AI 데이터 생성하기
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
