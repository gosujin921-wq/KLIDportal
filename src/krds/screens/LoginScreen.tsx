// KLID portal — login (간편인증 / 공동·금융인증서 / 아이디). 원본 LoginScreen.jsx 충실 이식.
import { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { Tabs } from '../components/Tabs'
import { Alert } from '../components/Alert'
import { Checkbox } from '../components/Checkbox'

type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void

export function LoginScreen({ onNavigate }: { onNavigate: Nav }) {
  const [tab, setTab] = useState('simple')
  const providers = [
    { icon: 'smartphone', label: '카카오' }, { icon: 'account_balance', label: 'PASS' },
    { icon: 'credit_card', label: '삼성패스' }, { icon: 'domain', label: 'KB모바일' },
    { icon: 'payments', label: '페이코' }, { icon: 'language', label: '네이버' },
  ]

  return (
    <main style={{ background: 'var(--krds-color-surface-subtle)', minHeight: 600 }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '56px 24px 80px' }}>
        <h1 style={{ font: 'var(--krds-heading-large)', textAlign: 'center', margin: '0 0 8px' }}>로그인</h1>
        <p style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-subtle)', textAlign: 'center', margin: '0 0 32px' }}>안전한 민원 서비스 이용을 위해 본인인증이 필요합니다.</p>

        <Card padding="large">
          <Tabs value={tab} onChange={setTab} items={[{ id: 'simple', label: '간편인증' }, { id: 'cert', label: '공동·금융인증서' }, { id: 'id', label: '아이디 로그인' }]} />
          <div style={{ paddingTop: 24 }}>
            {tab === 'simple' && (
              <div>
                <Alert tone="information" title="간편인증으로 1초 만에 로그인하세요.">별도 설치 없이 통신사·금융 인증으로 본인확인이 가능합니다.</Alert>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
                  {providers.map((p) => (
                    <button key={p.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 8px', background: '#fff', border: '1px solid var(--krds-color-border-default)', borderRadius: 'var(--krds-radius-medium)', cursor: 'pointer' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 26, color: 'var(--krds-color-primary-50)', lineHeight: 0 }}>{p.icon}</span>
                      <span style={{ font: 'var(--krds-label-medium)', color: 'var(--krds-color-text-default)' }}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {tab === 'cert' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 56, color: 'var(--krds-color-primary-50)', lineHeight: 0 }}>verified_user</span>
                <p style={{ font: 'var(--krds-body-medium)', color: 'var(--krds-color-text-default)', margin: '16px 0 24px' }}>등록된 공동·금융인증서로 로그인합니다.</p>
                <Button variant="primary" size="large" fullWidth iconLeft="badge">인증서 선택</Button>
              </div>
            )}
            {tab === 'id' && (
              <form onSubmit={(e) => { e.preventDefault(); onNavigate('home') }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TextField label="아이디" placeholder="아이디를 입력하세요" iconLeft="person" />
                <TextField label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" iconLeft="lock" />
                <Checkbox label="아이디 저장" />
                <Button type="submit" variant="primary" size="xlarge" fullWidth>로그인</Button>
              </form>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
          {['아이디 찾기', '비밀번호 찾기', '회원가입'].map((t, i) => (
            <a key={t} href="#" onClick={(e) => e.preventDefault()} style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-text-subtle)', textDecoration: 'none', display: 'flex', gap: 20 }}>
              {i > 0 && <span style={{ width: 1, height: 12, background: 'var(--krds-color-border-default)', alignSelf: 'center', marginLeft: -20 }} />}{t}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
