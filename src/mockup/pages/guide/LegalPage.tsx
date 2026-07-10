import { Container } from '@/mockup/components/ui/Container'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { DocumentPage } from './DocumentPage'

/** 이용약관·개인정보처리방침 독립 페이지 (기획 v2: 푸터 전용 접근, DFEAT-048) */
export function LegalPage({ kind }: { kind: 'terms' | 'privacy' }) {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: kind === 'terms' ? '이용약관' : '개인정보처리방침' }]} />
      <div className="mt-6">
        <DocumentPage kind={kind} />
      </div>
    </Container>
  )
}
