import { Link } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Logo } from '@/mockup/components/Logo'

/* 이용약관·개인정보처리방침은 푸터 전용 접근 (기획 v2, DFEAT-048) */
const FOOTER_LINKS: { label: string; to?: string }[] = [
  { label: '이용약관', to: '/terms' },
  { label: '개인정보처리방침', to: '/privacy' },
  { label: '저작권정책' },
  { label: '오픈소스 라이선스' },
]

export function AppFooter() {
  return (
    <footer className="mt-24 bg-slate-900 text-slate-400">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo inverted markTo="/" />
            <p className="mt-4 text-sm leading-relaxed">
              한국지역정보개발원 · 행정안전부
              <br />
              AI 기반 지방정부 CCTV 관제지원시스템 구축(2차)
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                {l.to ? (
                  <Link to={l.to} className="hover:text-white">
                    {l.label}
                  </Link>
                ) : (
                  <a href="#" className="hover:text-white">
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © 2026 한국지역정보개발원(KLID). All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
