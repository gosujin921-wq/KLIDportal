import { Container } from '@/mockup/components/ui/Container'

/** 아직 목업 미제작 화면용 임시 페이지 */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Container className="py-32 text-center">
      <p className="text-sm font-bold tracking-wider text-cobalt-600">준비 중</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-4 text-base text-slate-500">이 화면의 목업은 다음 단계에서 제작됩니다.</p>
    </Container>
  )
}
