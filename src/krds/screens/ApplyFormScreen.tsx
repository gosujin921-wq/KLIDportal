// KLID portal — 민원 신청 form (주민등록등본 발급). 원본 ApplyFormScreen.jsx 충실 이식.
import { useState } from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import { Card, CardHeader } from '../components/Card'
import { TextField } from '../components/TextField'
import { Select } from '../components/Select'
import { Radio } from '../components/Radio'
import { Checkbox } from '../components/Checkbox'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { Badge } from '../components/Badge'

type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void

export function ApplyFormScreen({ onNavigate }: { onNavigate: Nav }) {
  const [purpose, setPurpose] = useState('public')
  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const steps = ['신청서 작성', '본인인증', '신청완료']

  return (
    <main style={{ background: 'var(--krds-color-surface-subtle)', minHeight: 600 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <Breadcrumb items={[{ label: '민원서비스', href: '#' }, { label: '주민등록', href: '#' }, { label: '주민등록표 등본 발급' }]} />
      </div>
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ font: 'var(--krds-heading-large)', margin: 0 }}>주민등록표 등본 발급</h1>
          <Badge tone="success" variant="soft">수수료 무료</Badge>
        </div>
        <p style={{ font: 'var(--krds-body-medium)', color: 'var(--krds-color-text-subtle)', margin: '0 0 24px' }}>온라인으로 신청하면 즉시 발급되며, PDF로 내려받거나 인쇄할 수 있습니다.</p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: i === 0 ? 'var(--krds-color-primary-50)' : '#fff', border: '1px solid ' + (i === 0 ? 'var(--krds-color-primary-50)' : 'var(--krds-color-border-default)'), borderRadius: 'var(--krds-radius-medium)' }}>
              {/* 원본 12px → 프로젝트 13px 하한 */}
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? 'rgba(255,255,255,0.25)' : 'var(--krds-color-surface-subtle)', color: i === 0 ? '#fff' : 'var(--krds-color-text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 13px/1 var(--krds-font-mono)' }}>{i + 1}</span>
              <span style={{ font: 'var(--krds-title-medium)', color: i === 0 ? '#fff' : 'var(--krds-color-text-subtle)' }}>{s}</span>
            </div>
          ))}
        </div>

        {submitted ? (
          <Card padding="large" style={{ textAlign: 'center', padding: 48 }}>
            <span className="material-symbols-rounded" style={{ fontSize: 64, color: 'var(--krds-color-success-50)', lineHeight: 0 }}>check_circle</span>
            <h2 style={{ font: 'var(--krds-heading-small)', margin: '16px 0 8px' }}>신청이 정상적으로 접수되었습니다.</h2>
            <p style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-subtle)', margin: '0 0 24px' }}>접수번호 2026-민원-0006241 · 신청내역에서 발급 상태를 확인할 수 있습니다.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => setSubmitted(false)}>다시 신청</Button>
              <Button variant="primary" iconRight="download" onClick={() => onNavigate('home')}>등본 내려받기</Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card padding="large">
              <CardHeader title="신청인 정보" icon="person" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <TextField label="성명" required placeholder="홍길동" defaultValue="홍길동" />
                <TextField label="주민등록번호" required placeholder="앞 6자리 - 뒤 7자리" defaultValue="900101-1******" />
                <Select label="시·도" required placeholder="선택" options={['서울특별시', '부산광역시', '인천광역시', '대구광역시']} />
                <Select label="시·군·구" required placeholder="선택" options={['중구', '종로구', '강남구', '마포구']} />
              </div>
            </Card>

            <Card padding="large">
              <CardHeader title="발급 정보" icon="description" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <p style={{ font: 'var(--krds-label-medium)', margin: '0 0 10px' }}>용도 <span style={{ color: 'var(--krds-color-text-danger)' }}>*</span></p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    <Radio name="purpose" value="public" label="관공서 제출" checked={purpose === 'public'} onChange={() => setPurpose('public')} />
                    <Radio name="purpose" value="bank" label="금융기관 제출" checked={purpose === 'bank'} onChange={() => setPurpose('bank')} />
                    <Radio name="purpose" value="etc" label="기타" checked={purpose === 'etc'} onChange={() => setPurpose('etc')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Select label="통수" required placeholder="선택" options={['1통', '2통', '3통']} />
                  <Select label="수령방법" required placeholder="선택" options={['온라인 발급(PDF)', '방문 수령']} />
                </div>
                <Checkbox label="주민등록번호 뒷자리를 표시합니다." />
              </div>
            </Card>

            <Card padding="large">
              <CardHeader title="개인정보 수집·이용 동의" icon="lock" />
              <Alert tone="information" title="본 민원 처리를 위해 아래 항목의 개인정보를 수집·이용합니다." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                <Checkbox label="(필수) 개인정보 수집·이용에 동의합니다." checked={agree1} onChange={(e) => setAgree1(e.target.checked)} />
                <Checkbox label="(필수) 행정정보 공동이용에 동의합니다." checked={agree2} onChange={(e) => setAgree2(e.target.checked)} />
              </div>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
              <Button variant="secondary" size="xlarge" onClick={() => onNavigate('home')}>취소</Button>
              <Button type="submit" variant="primary" size="xlarge" disabled={!agree1 || !agree2} iconRight="arrow_forward">본인인증 후 신청</Button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
