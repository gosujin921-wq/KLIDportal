// KLID portal — site header (utility bar + masthead + GNB). 원본 Header.jsx 충실 이식.
import { useState } from 'react'
import { IconButton } from '../components/IconButton'
import { KLID_DATA } from '../data'

type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void

export function KlidHeader({ onNavigate, current }: { onNavigate: Nav; current?: string }) {
  const D = KLID_DATA
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--krds-color-border-default)' }}>
      {/* Utility bar */}
      <div style={{ background: 'var(--krds-color-surface-subtle)', borderBottom: '1px solid var(--krds-color-border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20 }}>
          {['회원가입', '고객센터', '사이트맵'].map((t, i) => (
            <a key={t} href="#" style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-text-subtle)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 20 }}>
              {i > 0 && <span style={{ width: 1, height: 12, background: 'var(--krds-color-border-default)', marginLeft: -20 }} />}
              {t}
            </a>
          ))}
          <button onClick={() => onNavigate('login')} style={{ font: 'var(--krds-font-weight-bold) var(--krds-font-size-14)/1 var(--krds-font-sans)', color: 'var(--krds-color-primary-60)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 16, lineHeight: 0 }}>login</span>로그인
          </button>
        </div>
      </div>

      {/* Masthead */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onNavigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--krds-color-primary-50)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 18px/1 var(--krds-font-sans)', letterSpacing: '-0.02em' }}>KLID</span>
          <span style={{ textAlign: 'left', lineHeight: 1.15 }}>
            <b style={{ display: 'block', font: '800 21px/1 var(--krds-font-sans)', letterSpacing: '-0.02em', color: 'var(--krds-color-text-default)' }}>한국지역정보개발원</b>
            {/* 원본 12px → 프로젝트 13px 하한 */}
            <span style={{ font: '13px/1 var(--krds-font-sans)', color: 'var(--krds-color-text-subtle)' }}>지방행정 디지털 민원 포털</span>
          </span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 48, width: 320, border: '2px solid var(--krds-color-primary-50)', borderRadius: 'var(--krds-radius-full)', padding: '0 8px 0 20px' }}>
            <input placeholder="찾으시는 민원을 검색하세요" onKeyDown={(e) => e.key === 'Enter' && onNavigate('search')}
              style={{ flex: 1, border: 'none', outline: 'none', font: 'var(--krds-body-small)', background: 'transparent', minWidth: 0 }} />
            <IconButton icon="search" label="검색" variant="filled" size="small" onClick={() => onNavigate('search')} />
          </div>
        </div>
      </div>

      {/* GNB */}
      <nav style={{ borderTop: '1px solid var(--krds-color-border-subtle)' }} onMouseLeave={() => setOpenMenu(null)}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4 }}>
          {D.gnb.map((m) => {
            const active = openMenu === m.id || current === m.id
            return (
              <div key={m.id} onMouseEnter={() => setOpenMenu(m.id)} style={{ position: 'relative' }}>
                <button onClick={() => onNavigate('search')} style={{ height: 56, padding: '0 24px', border: 'none', background: 'none', cursor: 'pointer', font: 'var(--krds-font-weight-bold) var(--krds-font-size-17)/1 var(--krds-font-sans)', color: active ? 'var(--krds-color-primary-60)' : 'var(--krds-color-text-default)', boxShadow: active ? 'inset 0 -3px 0 0 var(--krds-color-primary-50)' : 'none' }}>
                  {m.label}
                </button>
                {openMenu === m.id && (
                  <div style={{ position: 'absolute', top: 56, left: 0, minWidth: 180, background: '#fff', border: '1px solid var(--krds-color-border-default)', borderRadius: '0 0 var(--krds-radius-medium) var(--krds-radius-medium)', boxShadow: 'var(--krds-shadow-medium)', padding: 8, zIndex: 1020 }}>
                    {m.items.map((it) => (
                      <a key={it} href="#" onClick={(e) => { e.preventDefault(); onNavigate('search') }} style={{ display: 'block', padding: '10px 12px', borderRadius: 6, font: 'var(--krds-body-small)', color: 'var(--krds-color-text-default)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--krds-color-surface-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>{it}</a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
