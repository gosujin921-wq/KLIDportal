import type { ReactNode } from 'react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'

/**
 * 목업 디자인 스타일 가이드 (내부 확인용, 라우트 /style).
 * index.css 토큰을 그대로 반영. 색/타이포/버튼/라운드/여백 통일 기준을 한 화면에 정리.
 */
export function StyleGuide() {
  return (
    <div className="bg-slate-50 py-16">
      <Container className="space-y-16">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-cobalt-600">DESIGN GUIDE</p>
          <h1 className="text-4xl font-extrabold text-slate-900">디자인 스타일 가이드</h1>
          <p className="max-w-2xl text-base text-slate-600">
            AI 영상학습 사용자 포털 목업의 색·타이포·컴포넌트 기준입니다. 새 화면을 만들 때 이 값만
            사용하고, 임의 색상·폰트 크기·라운드 값을 넣지 않습니다.
          </p>
        </header>

        {/* 1. 컬러 */}
        <Section title="1. 컬러" desc="코발트 단일 강조색 + 중립 그레이 + 이벤트·시맨틱 보조색">
          <SubLabel>Primary — 코발트 (강조 기본 600)</SubLabel>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {COBALT.map((c) => (
              <Swatch key={c.name} hex={c.hex} name={c.name} dark={c.dark} main={c.name === '600'} />
            ))}
          </div>

          <SubLabel>이벤트 유형색 (검색카드·배지 전용)</SubLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {EVENTS.map((c) => (
              <Swatch key={c.name} hex={c.hex} name={c.name} label={c.label} dark />
            ))}
          </div>

          <SubLabel>시맨틱</SubLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SEMANTIC.map((c) => (
              <Swatch key={c.name} hex={c.hex} name={c.name} label={c.label} dark />
            ))}
          </div>

          <SubLabel>중립 (본문 slate)</SubLabel>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
            {NEUTRAL.map((c) => (
              <Swatch key={c.name} hex={c.hex} name={c.name} dark={c.dark} />
            ))}
          </div>
        </Section>

        {/* 2. 타이포그래피 */}
        <Section
          title="2. 타이포그래피"
          desc="Pretendard · 본문 15px · 최소 13px (12px 이하 금지) · 한글 자간 -0.5px"
        >
          <div className="divide-y divide-slate-200 rounded-2xl bg-white p-6">
            {TYPE.map((t) => (
              <div key={t.cls} className="flex items-baseline justify-between gap-4 py-3">
                <span className={`${t.cls} ${t.bold ? 'font-bold' : ''} text-slate-900 truncate`}>
                  데이터를 찾고 발견해요
                </span>
                <span className="shrink-0 font-mono text-sm text-slate-400">
                  {t.cls} · {t.px}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. 버튼 */}
        <Section title="3. 버튼" desc="캡슐형(rounded-full) · 3 variant × 3 size">
          <div className="space-y-4 rounded-2xl bg-white p-6">
            {(['primary', 'secondary', 'ghost'] as const).map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-20 font-mono text-sm text-slate-400">{v}</span>
                <Button variant={v} size="sm">
                  Small
                </Button>
                <Button variant={v} size="md">
                  Medium
                </Button>
                <Button variant={v} size="lg">
                  Large
                </Button>
                <Button variant={v} size="md" disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. 라운드 */}
        <Section title="4. 라운드 (모서리)" desc="요소 유형별 고정 규칙">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {RADIUS.map((r) => (
              <div key={r.cls} className="space-y-2">
                <div className={`h-24 bg-cobalt-100 ${r.cls}`} />
                <p className="font-mono text-sm text-slate-500">{r.cls}</p>
                <p className="text-sm text-slate-600">{r.use}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. 카드·엘리베이션 */}
        <Section title="5. 카드 · 그림자" desc="기본은 얇은 보더, 강조 카드는 정적 소프트 섀도(호버 반응 없음)">
          <div className="grid gap-4 sm:grid-cols-3">
            <DemoCard className="border border-slate-200">
              <b>기본 카드</b>
              <span>border-slate-200 · 그림자 없음</span>
            </DemoCard>
            <DemoCard className="border border-slate-200 shadow-lg">
              <b>떠 있는 카드</b>
              <span>shadow-lg</span>
            </DemoCard>
            <DemoCard className="card-soft border border-slate-200">
              <b>소프트 섀도</b>
              <span>card-soft · 코발트 틴트 정적 섀도</span>
            </DemoCard>
          </div>
        </Section>

        {/* 6. 레이아웃 */}
        <Section title="6. 레이아웃 · 여백" desc="콘텐츠 폭과 섹션 리듬">
          <div className="grid gap-3 rounded-2xl bg-white p-6 text-base text-slate-700 sm:grid-cols-2">
            <Rule k="콘텐츠 최대폭" v="1200px (Container, 좌우 px-6)" />
            <Rule k="섹션 세로 여백" v="py-20 (80px) 기본 · 히어로 py-24~32" />
            <Rule k="본문 배경" v="흰색 · 섹션 교차 시 slate-50" />
            <Rule k="다크 밴드" v="band-cobalt (Wow·CTA 강조 구간)" />
          </div>
        </Section>
      </Container>
    </div>
  )
}

/* ---------- 데이터 (index.css 토큰과 1:1) ---------- */
const COBALT = [
  { name: '50', hex: '#eef1fe' },
  { name: '100', hex: '#e0e6fd' },
  { name: '200', hex: '#c4cffb' },
  { name: '300', hex: '#9daef7' },
  { name: '400', hex: '#6e84f1', dark: true },
  { name: '500', hex: '#4a61e8', dark: true },
  { name: '600', hex: '#2e45dc', dark: true },
  { name: '700', hex: '#2336b8', dark: true },
  { name: '800', hex: '#1f2e92', dark: true },
  { name: '900', hex: '#1e2b74', dark: true },
]
const EVENTS = [
  { name: 'wildfire', label: '산불', hex: '#ea580c' },
  { name: 'flood', label: '침수', hex: '#0e9ab8' },
  { name: 'fire', label: '화재', hex: '#dc2626' },
  { name: 'abduction', label: '유괴', hex: '#7c3aed' },
  { name: 'etc', label: '기타', hex: '#64748b' },
]
const SEMANTIC = [
  { name: 'success', label: '성공', hex: '#16a34a' },
  { name: 'warning', label: '경고', hex: '#d97706' },
  { name: 'danger', label: '위험', hex: '#dc2626' },
  { name: 'info', label: '정보', hex: '#2e45dc' },
]
const NEUTRAL = [
  { name: '50', hex: '#f8fafc' },
  { name: '100', hex: '#f1f5f9' },
  { name: '200', hex: '#e2e8f0' },
  { name: '300', hex: '#cbd5e1' },
  { name: '400', hex: '#94a3b8', dark: true },
  { name: '500', hex: '#64748b', dark: true },
  { name: '600', hex: '#475569', dark: true },
  { name: '800', hex: '#1e293b', dark: true },
  { name: '900', hex: '#0f172a', dark: true },
]
const TYPE = [
  { cls: 'text-5xl', px: '52px', bold: true },
  { cls: 'text-4xl', px: '40px', bold: true },
  { cls: 'text-3xl', px: '30px', bold: true },
  { cls: 'text-2xl', px: '24px', bold: true },
  { cls: 'text-xl', px: '20px', bold: true },
  { cls: 'text-lg', px: '17px' },
  { cls: 'text-base', px: '15px (본문)' },
  { cls: 'text-sm', px: '14px' },
  { cls: 'text-xs', px: '13px (하한)' },
]
const RADIUS = [
  { cls: 'rounded-full', use: '버튼·칩·태그·배지 (캡슐)' },
  { cls: 'rounded-3xl', use: '큰 패널·미디어 (24px)' },
  { cls: 'rounded-2xl', use: '카드 기본 (16px)' },
  { cls: 'rounded-lg', use: '입력창·작은 요소 (8px)' },
]

/* ---------- 조각 컴포넌트 ---------- */
function Section({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-base text-slate-500">{desc}</p>
      </div>
      {children}
    </section>
  )
}
function SubLabel({ children }: { children: ReactNode }) {
  return <p className="pt-2 text-sm font-semibold text-slate-500">{children}</p>
}
function Swatch({
  hex,
  name,
  label,
  dark,
  main,
}: {
  hex: string
  name: string
  label?: string
  dark?: boolean
  main?: boolean
}) {
  return (
    <div
      className={`flex h-20 flex-col justify-between rounded-lg p-2 ${main ? 'ring-2 ring-cobalt-600 ring-offset-2' : ''}`}
      style={{ background: hex }}
    >
      <span className={`text-xs font-semibold ${dark ? 'text-white' : 'text-slate-700'}`}>
        {label ?? name}
      </span>
      <span className={`font-mono text-xs ${dark ? 'text-white/80' : 'text-slate-600'}`}>{hex}</span>
    </div>
  )
}
function DemoCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 rounded-2xl bg-white p-5 text-slate-700 ${className}`}>
      {children}
    </div>
  )
}
function Rule({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 font-semibold text-slate-900">{k}</span>
      <span>{v}</span>
    </div>
  )
}
