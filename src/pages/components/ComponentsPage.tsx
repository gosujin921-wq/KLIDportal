import { useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tag } from '@/components/ui/Tag'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/Radio'
import { Toggle } from '@/components/ui/Toggle'
import { Alert } from '@/components/ui/Alert'
import { Accordion } from '@/components/ui/Accordion'
import { Tab } from '@/components/ui/Tab'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Loading } from '@/components/ui/Loading'

/**
 * KRDS 컴포넌트 쇼케이스 — 프로젝트로 이식한 전체 컴포넌트를 한 화면에서 확인.
 * 색은 브랜드 프라이머리(코발트), KRDS 구조/스펙. 라우트: /components
 */

function Section({ title, count, children }: { title: string; count: string; children: ReactNode }) {
  return (
    <section className="border-t border-slate-100 py-10 first:border-t-0">
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-400">{count}</span>
      </div>
      <div className="flex flex-wrap items-start gap-x-8 gap-y-6">{children}</div>
    </section>
  )
}

type Row = Record<string, unknown> & { id: number; name: string; region: string; count: number }
const tableData: Row[] = [
  { id: 1, name: '산불 데이터셋', region: '강원', count: 412 },
  { id: 2, name: '침수 데이터셋', region: '경기', count: 356 },
  { id: 3, name: '화재 데이터셋', region: '서울', count: 287 },
]
const tableColumns: TableColumn<Row>[] = [
  { key: 'name', label: '데이터셋' },
  { key: 'region', label: '지역', align: 'center' },
  { key: 'count', label: '건수', align: 'right', render: (v) => (v as number).toLocaleString() },
]

export function ComponentsPage() {
  const [page, setPage] = useState(3)
  const [checked, setChecked] = useState(true)
  const [on, setOn] = useState(true)
  const [radio, setRadio] = useState('video')

  return (
    <div className="bg-white py-12">
      <Container>
        <div className="mb-2">
          <Tag variant="primary" size="lg" className="font-semibold tracking-wide">
            KRDS COMPONENTS
          </Tag>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">컴포넌트 라이브러리</h1>
        <p className="mt-2 text-base text-slate-600">
          KRDS v1.0.0 컴포넌트 15종을 프로젝트 컨벤션(코발트 프라이머리, 13px 하한)으로 이식했습니다.
        </p>

        <div className="mt-8">
          {/* Button */}
          <Section title="Button" count="3 variant · 3 size">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">
              <Search className="size-5" />
              Large
            </Button>
            <Button disabled>Disabled</Button>
          </Section>

          {/* Badge */}
          <Section title="Badge" count="6 variant · dot · count">
            <Badge>Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">완료</Badge>
            <Badge variant="warning">대기</Badge>
            <Badge variant="danger">만료</Badge>
            <Badge variant="info">안내</Badge>
            <Badge count={5} />
            <Badge count={120} maxCount={99} variant="danger" />
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
              <Badge dot variant="success" /> 진행중
            </span>
          </Section>

          {/* Tag */}
          <Section title="Tag" count="6 variant · closable">
            <Tag>기본</Tag>
            <Tag variant="primary">산불</Tag>
            <Tag variant="success">침수</Tag>
            <Tag variant="warning">점검</Tag>
            <Tag variant="danger">화재</Tag>
            <Tag variant="info">안내</Tag>
            <Tag variant="primary" closable onClose={() => {}}>
              필터: 강원
            </Tag>
          </Section>

          {/* Input / Select */}
          <Section title="Input · Select" count="label · hint · error · addon">
            <div className="w-64">
              <Input label="검색어" placeholder="키워드 입력" leftAddon={<Search className="size-4" />} />
            </div>
            <div className="w-64">
              <Input label="이메일" required hint="회사 이메일을 입력하세요." />
            </div>
            <div className="w-64">
              <Input label="비밀번호" type="password" error="8자 이상 입력하세요." defaultValue="123" />
            </div>
            <div className="w-64">
              <Select
                label="이벤트 유형"
                placeholder="선택하세요"
                options={[
                  { value: 'wildfire', label: '산불' },
                  { value: 'flood', label: '침수' },
                  { value: 'fire', label: '화재' },
                ]}
              />
            </div>
          </Section>

          {/* Checkbox / Radio / Toggle */}
          <Section title="Checkbox · Radio · Toggle" count="선택 컨트롤">
            <div className="flex flex-col gap-2">
              <Checkbox label="영상 포함" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
              <Checkbox label="이미지 포함" defaultChecked />
              <Checkbox label="비활성" disabled />
            </div>
            <RadioGroup
              legend="제공 단위"
              name="unit"
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
              options={[
                { value: 'video', label: '영상 + 이미지' },
                { value: 'image', label: '이미지만' },
              ]}
            />
            <div className="flex flex-col gap-3">
              <Toggle label="야간 데이터" checked={on} onChange={(e) => setOn(e.target.checked)} />
              <Toggle label="증강 적용" size="sm" defaultChecked />
            </div>
          </Section>

          {/* Alert */}
          <Section title="Alert" count="4 variant · closable">
            <div className="flex w-full max-w-xl flex-col gap-3">
              <Alert variant="info" title="안내">개인정보가 포함된 영상은 업로드할 수 없습니다.</Alert>
              <Alert variant="success" title="완료">반출 요청이 접수되었습니다.</Alert>
              <Alert variant="warning" title="유효기간 임박">3일 후 다운로드 기한이 만료됩니다.</Alert>
              <Alert variant="danger" title="실패" closable>
                업로드 중 오류가 발생했습니다.
              </Alert>
            </div>
          </Section>

          {/* Accordion / Tab / Breadcrumb */}
          <Section title="Accordion · Tab · Breadcrumb" count="구조 컴포넌트">
            <div className="w-full max-w-xl">
              <Accordion
                items={[
                  { title: '데이터는 어떻게 검색하나요?', content: '이벤트 유형과 지역 조건으로 검색합니다.', defaultOpen: true },
                  { title: '반출 기한은 얼마인가요?', content: '데이터셋별 유효기간이 표시되며 만료 시 삭제됩니다.' },
                ]}
              />
            </div>
            <div className="w-full max-w-xl">
              <Tab
                tabs={[
                  { key: 'search', label: '검색', content: <p className="py-3 text-base text-slate-600">조건 검색 패널</p> },
                  { key: 'export', label: '반출', content: <p className="py-3 text-base text-slate-600">반출 현황 패널</p> },
                  { key: 'make', label: '제작', content: <p className="py-3 text-base text-slate-600">저작·생성 패널</p> },
                ]}
              />
            </div>
            <Breadcrumb
              items={[{ label: '홈', href: '#' }, { label: '데이터 검색', href: '#' }, { label: '검색 결과' }]}
            />
          </Section>

          {/* Table / Pagination */}
          <Section title="Table · Pagination" count="데이터 표시">
            <div className="w-full max-w-2xl">
              <Table columns={tableColumns} data={tableData} striped hoverable />
              <div className="mt-5 flex justify-center">
                <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
              </div>
            </div>
          </Section>

          {/* Loading */}
          <Section title="Loading" count="3 size">
            <Loading size="sm" label="작은" />
            <Loading size="md" label="로딩 중..." />
            <Loading size="lg" label="큰" />
          </Section>
        </div>
      </Container>
    </div>
  )
}
