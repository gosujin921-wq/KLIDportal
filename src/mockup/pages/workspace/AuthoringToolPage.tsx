import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  MousePointer2,
  Square,
  Pentagon,
  Trash2,
  Undo2,
  Save,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge } from '@/mockup/components/ui/badges'
import { authoringTasks } from '@/mockup/mocks/workspace'
import { cn } from '@/lib/cn'

/**
 * 저작도구 라벨링 화면.
 * 참고 목업(다크 툴)의 정보 구조 — 좌측 툴바+라벨 목록 / 중앙 캔버스 / 우측 객체 목록+속성 /
 * 하단 프레임 스트립 — 를 포털 라이트 룩앤필로 재구성.
 */

/** 라벨 팔레트 (참고 목업의 라벨 세트 준용) */
const LABELS = [
  { name: 'person', color: '#ef4444', count: 8 },
  { name: 'car', color: '#3b82f6', count: 5 },
  { name: 'bus', color: '#f59e0b', count: 1 },
  { name: 'truck', color: '#94a3b8', count: 0 },
  { name: 'fire', color: '#dc2626', count: 0 },
  { name: 'smoke', color: '#64748b', count: 0 },
  { name: 'fallen-person', color: '#ca8a04', count: 0 },
  { name: 'vehicle-accident', color: '#0d9488', count: 2 },
]

/** 캔버스 위 mock 바운딩박스 (% 좌표) */
const BOXES = [
  { id: 347, label: 'person', color: '#ef4444', x: 34, y: 38, w: 12, h: 26, selected: true },
  { id: 348, label: 'person', color: '#ef4444', x: 55, y: 42, w: 8, h: 20, selected: false },
  { id: 352, label: 'car', color: '#3b82f6', x: 12, y: 55, w: 22, h: 22, selected: false },
  { id: 355, label: 'car', color: '#3b82f6', x: 68, y: 50, w: 18, h: 18, selected: false },
  { id: 359, label: 'bus', color: '#f59e0b', x: 76, y: 22, w: 16, h: 20, selected: false },
]

const OBJECT_GROUPS = [
  { label: 'person', color: '#ef4444', items: ['person #1', 'person #2'] },
  { label: 'car', color: '#3b82f6', items: ['car #1', 'car #2'] },
  { label: 'bus', color: '#f59e0b', items: ['bus #1'] },
  { label: 'vehicle-accident', color: '#0d9488', items: ['vehicle-accident #1', 'vehicle-accident #2'] },
]

const TOOLS = [
  { icon: MousePointer2, label: '선택', active: true },
  { icon: Square, label: '바운딩박스', active: false },
  { icon: Pentagon, label: '폴리곤', active: false },
  { icon: Trash2, label: '삭제', active: false },
  { icon: Undo2, label: '되돌리기', active: false },
]

export function AuthoringToolPage() {
  const { taskId } = useParams()
  const task = authoringTasks.find((t) => t.id === taskId) ?? authoringTasks[0]
  const [frame, setFrame] = useState(12)
  const totalFrames = task.frames || 48

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
      {/* 상단 바 */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            to="/workspace/authoring"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft className="size-4" />
            작업 목록
          </Link>
          <span className="h-5 w-px bg-slate-200" />
          <p className="text-base font-bold text-slate-900">{task.videoName}</p>
          <EventBadge type={task.type} />
        </div>
        <p className="text-sm font-medium text-slate-500 tabular-nums">
          프레임 {frame} / {totalFrames}
          <span className="ml-2 inline-flex items-center gap-1 font-semibold text-green-600">
            <Check className="size-3.5" />
            저장됨
          </span>
        </p>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500 tabular-nums">객체 {task.objects || 16}개</p>
          <Button size="sm">
            <Save className="size-4" />
            저장
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* 좌측: 툴바 */}
        <div className="flex w-13 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-3">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-label={t.label}
              title={t.label}
              className={cn(
                'flex size-9 items-center justify-center rounded-lg transition-colors',
                t.active
                  ? 'bg-cobalt-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
              )}
            >
              <t.icon className="size-4.5" />
            </button>
          ))}
        </div>

        {/* 좌측: 라벨 목록 */}
        <div className="w-44 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-3">
          <p className="px-1 pb-2 text-xs font-bold tracking-wider text-slate-400">라벨</p>
          <ul className="space-y-0.5">
            {LABELS.map((l, i) => (
              <li key={l.name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                  <span className="flex-1 truncate font-mono text-sm text-slate-700">{l.name}</span>
                  <span className="font-mono text-xs text-slate-300">{i + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 중앙: 캔버스 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="relative m-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 shadow-inner">
            {/* 노면·조명 느낌 */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(50% 55% at 50% 62%, rgba(148,163,184,0.28), transparent 75%)',
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)',
              }}
            />
            <span className="absolute top-3 left-3 rounded-md bg-slate-900/60 px-2 py-0.5 font-mono text-xs text-white/80">
              {task.videoId} · frame_{String(frame).padStart(4, '0')}
            </span>

            {/* mock 바운딩박스 */}
            {BOXES.map((b) => (
              <div
                key={b.id}
                className="absolute"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.w}%`,
                  height: `${b.h}%`,
                  border: `2px solid ${b.color}`,
                  boxShadow: b.selected ? `0 0 0 4px ${b.color}33` : undefined,
                }}
              >
                <span
                  className="absolute -top-6 left-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold whitespace-nowrap text-white"
                  style={{ backgroundColor: b.color }}
                >
                  {b.label} #{b.id}
                </span>
                {b.selected &&
                  ['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map(
                    (pos) => (
                      <span
                        key={pos}
                        className={`absolute ${pos} size-2 rounded-sm border border-white bg-cobalt-600`}
                      />
                    ),
                  )}
              </div>
            ))}
          </div>

          {/* 하단: 프레임 스트립 */}
          <div className="flex h-20 shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-4">
            <button
              type="button"
              aria-label="이전 프레임"
              onClick={() => setFrame((f) => Math.max(1, f - 1))}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
            >
              <ChevronLeft className="size-4.5" />
            </button>
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-2">
              {Array.from({ length: 16 }, (_, i) => frame - 6 + i)
                .filter((n) => n >= 1 && n <= totalFrames)
                .map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFrame(n)}
                    className={cn(
                      'flex h-11 w-16 shrink-0 items-end justify-start rounded-md bg-gradient-to-br from-slate-500 to-slate-800 p-1 font-mono text-xs text-white/80 transition-all',
                      n === frame
                        ? 'ring-2 ring-cobalt-500 ring-offset-1'
                        : 'opacity-60 hover:opacity-90',
                    )}
                  >
                    {n}
                  </button>
                ))}
            </div>
            <button
              type="button"
              aria-label="다음 프레임"
              onClick={() => setFrame((f) => Math.min(totalFrames, f + 1))}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
            >
              <ChevronRight className="size-4.5" />
            </button>
          </div>
        </div>

        {/* 우측: 객체 목록 + 속성 */}
        <div className="flex w-64 shrink-0 flex-col border-l border-slate-200 bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <p className="px-1 pb-2 text-xs font-bold tracking-wider text-slate-400">객체 목록</p>
            {OBJECT_GROUPS.map((g) => (
              <div key={g.label} className="mb-2">
                <p className="flex items-center gap-1.5 px-1 py-1 font-mono text-sm font-semibold text-slate-700">
                  <span className="size-2 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.label}
                  <span className="ml-auto text-xs text-slate-300">({g.items.length})</span>
                </p>
                <ul>
                  {g.items.map((item, i) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-mono text-sm transition-colors',
                          g.label === 'person' && i === 0
                            ? 'bg-cobalt-50 font-semibold text-cobalt-700'
                            : 'text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        {item}
                        <span className="text-xs text-slate-300">BBOX</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 속성 패널 */}
          <div className="shrink-0 border-t border-slate-200 p-4">
            <p className="text-xs font-bold tracking-wider text-slate-400">객체 속성 · #347</p>
            <label className="mt-3 block">
              <span className="text-sm font-semibold text-slate-700">라벨</span>
              <select
                defaultValue="person"
                className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 font-mono text-sm text-slate-700 focus:border-cobalt-400 focus:outline-none"
              >
                {LABELS.map((l) => (
                  <option key={l.name}>{l.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {[
                ['X 좌표', '585.74'],
                ['Y 좌표', '377.33'],
                ['너비', '257.75'],
                ['높이', '328.76'],
              ].map(([label, value]) => (
                <label key={label} className="block">
                  <span className="text-xs text-slate-400">{label}</span>
                  <input
                    readOnly
                    value={value}
                    className="mt-0.5 h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2 font-mono text-sm text-slate-600 tabular-nums"
                  />
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">생성 출처: 수동 · 형태: BBOX</p>
          </div>
        </div>
      </div>
    </div>
  )
}
