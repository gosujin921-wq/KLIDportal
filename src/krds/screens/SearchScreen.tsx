// KLID portal — search results. 원본 SearchScreen.jsx 충실 이식.
import { useState } from 'react'
import { Breadcrumb } from '../components/Breadcrumb'
import { Card } from '../components/Card'
import { Tag } from '../components/Tag'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Pagination } from '../components/Pagination'
import { Select } from '../components/Select'
import { KLID_DATA } from '../data'

type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void

export function SearchScreen({ onNavigate }: { onNavigate: Nav }) {
  const D = KLID_DATA
  const [filter, setFilter] = useState('전체')
  const [page, setPage] = useState(1)
  const filters = ['전체', '민원서비스', '정보공개', '알림소식']
  const results = filter === '전체' ? D.searchResults : D.searchResults.filter((r) => r.category === filter)

  return (
    <main style={{ minHeight: 600 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        <Breadcrumb items={[{ label: '통합검색', href: '#' }, { label: '검색결과' }]} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px 80px' }}>
        <h1 style={{ font: 'var(--krds-heading-medium)', margin: '0 0 6px' }}>
          ‘<span style={{ color: 'var(--krds-color-primary-60)' }}>주민등록</span>’ 검색결과
        </h1>
        <p style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-subtle)', margin: '0 0 24px' }}>총 <b style={{ color: 'var(--krds-color-text-default)' }}>{results.length}</b>건의 결과를 찾았습니다.</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <Tag key={f} selected={filter === f} onClick={() => { setFilter(f); setPage(1) }}>{f}</Tag>
            ))}
          </div>
          <div style={{ width: 180 }}>
            <Select placeholder="정확도순" options={['정확도순', '최신순', '이름순']} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map((r, i) => (
            <Card key={i} interactive padding="large" onClick={() => onNavigate('apply')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Badge tone={r.category === '민원서비스' ? 'primary' : r.category === '정보공개' ? 'information' : 'neutral'} variant="soft">{r.category}</Badge>
                {r.fee && <Badge tone="success" variant="soft">{r.fee}</Badge>}
              </div>
              <h3 style={{ font: 'var(--krds-heading-xsmall)', margin: '0 0 6px', color: 'var(--krds-color-text-default)' }}>{r.title}</h3>
              <p style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-subtle)', margin: '0 0 12px', lineHeight: 1.6 }}>{r.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.tags.map((t) => (
                    <span key={t} style={{ font: 'var(--krds-detail-small)', color: 'var(--krds-color-text-subtle)', padding: '3px 8px', background: 'var(--krds-color-surface-subtle)', borderRadius: 'var(--krds-radius-xsmall)' }}>#{t}</span>
                  ))}
                </div>
                <Button variant="secondary" size="small" iconRight="chevron_right" onClick={(e) => { e.stopPropagation(); onNavigate('apply') }}>바로가기</Button>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Pagination page={page} totalPages={8} onChange={setPage} />
        </div>
      </div>
    </main>
  )
}
