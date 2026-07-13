import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Select } from '@/mockup/components/ui/Select'
import { SitemapOverlay } from '@/mockup/components/SitemapOverlay'

/* 기획 v2 §3-3 푸터: [상단] 기관 로고·소셜 / [중단] 주소·연락처 / [하단] 약관·방침·사이트맵·패밀리사이트 + 카피라이트 */

/* 이용약관·개인정보처리방침은 푸터 전용 접근 (기획 v2, DFEAT-048) */
const POLICY_LINKS = [
  { label: '이용약관', to: '/terms' },
  { label: '개인정보처리방침', to: '/privacy' },
]

/* 패밀리 사이트 — 운영기관·대표 정부 포털 (목업 placeholder) */
const FAMILY_SITES = [
  { label: '행정안전부', url: 'https://www.mois.go.kr' },
  { label: '한국지역정보개발원', url: 'https://www.klid.or.kr' },
  { label: '정부24', url: 'https://www.gov.kr' },
  { label: '공공데이터포털', url: 'https://www.data.go.kr' },
]

/* 소셜 아이콘 — lucide엔 브랜드 아이콘이 없어 인라인 SVG(simple-icons). 목업 placeholder 링크 */
const SOCIALS: { label: string; path: string }[] = [
  {
    label: '유튜브',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: '인스타그램',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
  {
    label: '페이스북',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
]

export function AppFooter() {
  const [sitemapOpen, setSitemapOpen] = useState(false)

  return (
    <footer className="border-t border-slate-300 bg-slate-200 text-slate-500">
      <Container className="py-12">
        {/* [상단] 관련 기관 로고 | 소셜미디어 */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <img src="/KLID.png" alt="한국지역정보개발원(KLID)" className="h-7 w-auto" />
            <span className="h-7 w-px bg-slate-300" aria-hidden />
            <img src="/MOIS.svg" alt="행정안전부" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                type="button"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d={s.path} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* [중단] 주소·연락처 | 정책·사이트맵·패밀리 사이트 */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-sm leading-relaxed">
            <p>
              (03923) 서울특별시 마포구 성암로 301(상암동)
              <span className="mx-2 text-slate-300">|</span>
              TEL 02-2031-9100
              <span className="mx-2 text-slate-300">|</span>
              FAX 02-2031-9360
            </p>
            <p className="mt-1 text-slate-400">AI 기반 지방정부 CCTV 관제지원시스템 구축(2차)</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            {POLICY_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="font-medium hover:text-slate-900">
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setSitemapOpen(true)}
              className="font-medium hover:text-slate-900"
            >
              사이트맵
            </button>
            <Select
              aria-label="패밀리 사이트"
              placement="top"
              value=""
              onChange={(v) => {
                if (v) window.open(v, '_blank', 'noopener,noreferrer')
              }}
              className="min-w-[9.5rem]"
            >
              <option value="" disabled>
                패밀리 사이트
              </option>
              {FAMILY_SITES.map((s) => (
                <option key={s.label} value={s.url}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* [하단] 카피라이트 */}
        <div className="mt-8 text-xs text-slate-400">
          © 2026 한국지역정보개발원(KLID). All rights reserved.
        </div>
      </Container>

      <SitemapOverlay open={sitemapOpen} onClose={() => setSitemapOpen(false)} />
    </footer>
  )
}
