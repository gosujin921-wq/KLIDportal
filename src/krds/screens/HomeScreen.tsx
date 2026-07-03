// KLID portal — home screen. 원본 HomeScreen.jsx 충실 이식(인라인 스타일·그리드 그대로).
import { useState } from 'react'
import { Card } from '../components/Card'
import { Tabs } from '../components/Tabs'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { KLID_DATA } from '../data'

type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void
type NoticeTab = keyof typeof KLID_DATA.notices

export function HomeScreen({ onNavigate }: { onNavigate: Nav }) {
  const D = KLID_DATA
  const [tab, setTab] = useState<NoticeTab>('공지사항')
  const [q, setQ] = useState('')

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(180deg, var(--krds-color-primary-60), var(--krds-color-primary-50))', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 64px' }}>
          <p style={{ font: 'var(--krds-body-medium)', margin: '0 0 10px', color: 'rgba(255,255,255,0.85)' }}>한국지역정보개발원 통합 민원 포털</p>
          <h1 style={{ font: 'var(--krds-display-small)', margin: '0 0 28px', letterSpacing: '-0.02em' }}>필요한 민원을<br />한 곳에서 빠르고 쉽게</h1>
          <div style={{ display: 'flex', gap: 8, maxWidth: 620, background: '#fff', borderRadius: 'var(--krds-radius-full)', padding: 8, boxShadow: 'var(--krds-shadow-large)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 24, color: 'var(--krds-color-icon-subtle)', alignSelf: 'center', marginLeft: 12 }}>search</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onNavigate('search')} placeholder="예) 주민등록등본, 전입신고, 지방세"
              style={{ flex: 1, border: 'none', outline: 'none', font: 'var(--krds-body-medium)', color: 'var(--krds-color-text-default)', minWidth: 0 }} />
            <Button variant="primary" size="large" onClick={() => onNavigate('search')}>검색</Button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <span style={{ font: 'var(--krds-detail-medium)', color: 'rgba(255,255,255,0.8)', alignSelf: 'center' }}>인기 검색어</span>
            {['주민등록등본', '전입신고', '지방세 납부', '가족관계증명서'].map((k) => (
              <button key={k} onClick={() => onNavigate('search')} style={{ padding: '6px 14px', borderRadius: 'var(--krds-radius-full)', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)', color: '#fff', font: 'var(--krds-detail-medium)', cursor: 'pointer' }}>{k}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick services */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ font: 'var(--krds-heading-medium)', margin: 0 }}>자주 찾는 서비스</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('search') }} style={{ font: 'var(--krds-label-medium)', color: 'var(--krds-color-text-link)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>전체 서비스<span className="material-symbols-rounded" style={{ fontSize: 18, lineHeight: 0 }}>chevron_right</span></a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {D.quickServices.map((s) => (
            <Card key={s.label} interactive padding="large" onClick={() => onNavigate('apply')} style={{ textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 'var(--krds-radius-large)', background: 'var(--krds-color-primary-5)', color: 'var(--krds-color-primary-50)', marginBottom: 14 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 30, lineHeight: 0 }}>{s.icon}</span>
              </span>
              <p style={{ font: 'var(--krds-title-medium)', color: 'var(--krds-color-text-default)', margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-text-subtle)', margin: 0 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Notices + sidebar */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 0', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 32 }}>
        <div>
          <Tabs value={tab} onChange={(id) => setTab(id as NoticeTab)} items={Object.keys(D.notices).map((k) => ({ id: k, label: k }))} />
          <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
            {D.notices[tab].map((n, i) => (
              <li key={i}>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 8px', borderBottom: '1px solid var(--krds-color-border-subtle)', textDecoration: 'none' }}>
                  <Badge tone={n.tag === '채용' ? 'success' : n.tag === '보도' ? 'information' : 'primary'} variant="soft">{n.tag}</Badge>
                  <span style={{ flex: 1, font: 'var(--krds-body-small)', color: 'var(--krds-color-text-default)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
                  {/* 원본 10px → 프로젝트 13px 하한 */}
                  {n.isNew && <span style={{ font: '700 13px/1 var(--krds-font-mono)', color: 'var(--krds-color-danger-50)' }}>NEW</span>}
                  <span style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-text-subtle)', flexShrink: 0 }}>{n.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="large" style={{ background: 'var(--krds-color-secondary-80)', border: 'none', color: '#fff' }}>
            <p style={{ font: 'var(--krds-title-medium)', margin: '0 0 6px', color: '#fff' }}>나의 민원 신청내역</p>
            <p style={{ font: 'var(--krds-detail-medium)', margin: '0 0 16px', color: 'var(--krds-color-gray-20)' }}>로그인하면 신청·발급 내역을<br />한눈에 확인할 수 있습니다.</p>
            <Button variant="secondary" size="medium" fullWidth onClick={() => onNavigate('login')}>로그인</Button>
          </Card>
          <Card padding="large">
            <p style={{ font: 'var(--krds-title-medium)', margin: '0 0 12px' }}>민원 신청 안내</p>
            {([['schedule', '처리기간 영업일 3일 이내'], ['payments', '대부분 수수료 무료'], ['lock', '공동·간편 인증 지원']] as const).map(([ic, t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--krds-color-primary-50)', lineHeight: 0 }}>{ic}</span>
                <span style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-default)' }}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      </section>
    </main>
  )
}
