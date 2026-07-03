import { Compass, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

export function CtaSectionKRDS() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="band-cobalt band-dots relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              지금 바로 학습데이터를 찾아보세요
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cobalt-100">
              재난·안전 영상 데이터를 검색하고 반출하거나, 직접 가공·생성해 활용해 보세요.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="bg-white text-cobalt-700 hover:bg-cobalt-50 active:bg-cobalt-100"
              >
                <Compass className="size-5" />
                데이터 탐색하기
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-white/40 text-white hover:bg-white/10 active:bg-white/20"
              >
                <Sparkles className="size-5" />
                AI 데이터 생성하기
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
