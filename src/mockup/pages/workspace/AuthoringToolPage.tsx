import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { Select } from '@/mockup/components/ui/Select'
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

type Box = (typeof BOXES)[number]

/** 그리기 모드 툴 (선택 시 활성 유지) */
const MODE_TOOLS = [
  { key: 'select', icon: MousePointer2, label: '선택' },
  { key: 'bbox', icon: Square, label: '바운딩박스' },
  { key: 'polygon', icon: Pentagon, label: '폴리곤' },
] as const

const labelColor = (name: string) => LABELS.find((l) => l.name === name)?.color ?? '#94a3b8'

export function AuthoringToolPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const task = authoringTasks.find((t) => t.id === taskId) ?? authoringTasks[0]
  const [frame, setFrame] = useState(12)
  const totalFrames = task.frames || 48

  // --- 라벨링 상태 ---
  const [boxes, setBoxes] = useState<Box[]>(BOXES)
  const [selectedId, setSelectedId] = useState<number | null>(347)
  const [activeTool, setActiveTool] = useState<string>('select')
  const [activeLabel, setActiveLabel] = useState<string>('person')
  const [dirty, setDirty] = useState(false)
  const [history, setHistory] = useState<Box[][]>([])

  const selectedBox = boxes.find((b) => b.id === selectedId) ?? null

  // 우측 객체 목록은 현재 프레임의 박스에서 유도 → 삭제·라벨 변경이 즉시 반영
  const objectGroups = useMemo(() => {
    const map = new Map<string, { label: string; color: string; items: Box[] }>()
    boxes.forEach((b) => {
      if (!map.has(b.label)) map.set(b.label, { label: b.label, color: b.color, items: [] })
      map.get(b.label)!.items.push(b)
    })
    return [...map.values()]
  }, [boxes])

  // --- 토스트 ---
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const toastId = useRef(0)
  const showToast = (msg: string) => setToast({ id: (toastId.current += 1), msg })
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [toast])

  // --- 액션 ---
  const relabel = (name: string) => {
    if (!selectedBox) return
    const color = labelColor(name)
    setBoxes((bs) => bs.map((b) => (b.id === selectedId ? { ...b, label: name, color } : b)))
    setDirty(true)
  }

  const deleteSelected = () => {
    if (!selectedBox) return
    const removed = selectedBox
    setHistory((h) => [...h, boxes])
    const rest = boxes.filter((b) => b.id !== selectedId)
    setBoxes(rest)
    setSelectedId(rest[0]?.id ?? null)
    setDirty(true)
    showToast(`${removed.label} #${removed.id} 객체를 삭제했습니다`)
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setBoxes(prev)
    setHistory((h) => h.slice(0, -1))
    if (!prev.some((b) => b.id === selectedId)) setSelectedId(prev[0]?.id ?? null)
    setDirty(true)
    showToast('되돌렸습니다')
  }

  const handleSave = () => {
    setDirty(false)
    showToast('저장되었습니다. 작업 목록으로 이동합니다')
    setTimeout(() => navigate('/workspace/authoring'), 900)
  }

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
          {dirty ? (
            <span className="ml-2 inline-flex items-center gap-1 font-semibold text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-500" />
              저장 안 됨
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center gap-1 font-semibold text-green-600">
              <Check className="size-3.5" />
              저장됨
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500 tabular-nums">객체 {boxes.length}개</p>
          <Button size="sm" onClick={handleSave}>
            <Save className="size-4" />
            저장
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* 좌측: 툴바 */}
        <div className="flex w-13 shrink-0 flex-col items-center gap-1 border-r border-slate-200 bg-white py-3">
          {MODE_TOOLS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-label={t.label}
              aria-pressed={activeTool === t.key}
              title={t.label}
              onClick={() => setActiveTool(t.key)}
              className={cn(
                'flex size-9 items-center justify-center rounded-lg transition-colors',
                activeTool === t.key
                  ? 'bg-cobalt-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
              )}
            >
              <t.icon className="size-4.5" />
            </button>
          ))}
          <span className="my-1 h-px w-6 bg-slate-200" />
          <button
            type="button"
            aria-label="선택 객체 삭제"
            title="선택 객체 삭제"
            onClick={deleteSelected}
            disabled={!selectedBox}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-30"
          >
            <Trash2 className="size-4.5" />
          </button>
          <button
            type="button"
            aria-label="되돌리기"
            title="되돌리기"
            onClick={undo}
            disabled={history.length === 0}
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30"
          >
            <Undo2 className="size-4.5" />
          </button>
        </div>

        {/* 좌측: 라벨 목록 */}
        <div className="w-44 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-3">
          <p className="px-1 pb-2 text-xs font-bold tracking-wider text-slate-400">라벨</p>
          <ul className="space-y-0.5">
            {LABELS.map((l, i) => {
              const highlighted = selectedBox ? selectedBox.label === l.name : activeLabel === l.name
              return (
                <li key={l.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLabel(l.name)
                      if (selectedBox && selectedBox.label !== l.name) {
                        relabel(l.name)
                        showToast(`라벨을 '${l.name}' 로 변경했습니다`)
                      }
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                      highlighted ? 'bg-cobalt-50' : 'hover:bg-slate-50',
                    )}
                  >
                    <span className="size-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span
                      className={cn(
                        'flex-1 truncate font-mono text-sm',
                        highlighted ? 'font-semibold text-cobalt-700' : 'text-slate-700',
                      )}
                    >
                      {l.name}
                    </span>
                    <span className="font-mono text-xs text-slate-300">{i + 1}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 중앙: 캔버스 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            onClick={() => setSelectedId(null)}
            className={cn(
              'relative m-4 min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 shadow-inner',
              activeTool !== 'select' && 'cursor-crosshair',
            )}
          >
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
            {boxes.map((b) => {
              const selected = b.id === selectedId
              return (
                <div
                  key={b.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedId(b.id)
                  }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.w}%`,
                    height: `${b.h}%`,
                    border: `2px solid ${b.color}`,
                    boxShadow: selected ? `0 0 0 4px ${b.color}33` : undefined,
                  }}
                >
                  <span
                    className="absolute -top-6 left-0 rounded px-1.5 py-0.5 font-mono text-xs font-semibold whitespace-nowrap text-white"
                    style={{ backgroundColor: b.color }}
                  >
                    {b.label} #{b.id}
                  </span>
                  {selected &&
                    ['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map(
                      (pos) => (
                        <span
                          key={pos}
                          className={`absolute ${pos} size-2 rounded-sm border border-white bg-cobalt-600`}
                        />
                      ),
                    )}
                </div>
              )
            })}
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
            {objectGroups.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-slate-400">이 프레임의 객체가 없습니다</p>
            )}
            {objectGroups.map((g) => (
              <div key={g.label} className="mb-2">
                <p className="flex items-center gap-1.5 px-1 py-1 font-mono text-sm font-semibold text-slate-700">
                  <span className="size-2 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.label}
                  <span className="ml-auto text-xs text-slate-300">({g.items.length})</span>
                </p>
                <ul>
                  {g.items.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(b.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-mono text-sm transition-colors',
                          b.id === selectedId
                            ? 'bg-cobalt-50 font-semibold text-cobalt-700'
                            : 'text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        {b.label} #{b.id}
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
            {selectedBox ? (
              <>
                <p className="text-xs font-bold tracking-wider text-slate-400">
                  객체 속성 · #{selectedBox.id}
                </p>
                <label className="mt-3 block">
                  <span className="text-sm font-semibold text-slate-700">라벨</span>
                  <Select
                    value={selectedBox.label}
                    onChange={relabel}
                    wrapperClassName="mt-1 w-full"
                    className="w-full font-mono"
                  >
                    {LABELS.map((l) => (
                      <option key={l.name}>{l.name}</option>
                    ))}
                  </Select>
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {[
                    ['X 좌표', ((selectedBox.x / 100) * 1920).toFixed(2)],
                    ['Y 좌표', ((selectedBox.y / 100) * 1080).toFixed(2)],
                    ['너비', ((selectedBox.w / 100) * 1920).toFixed(2)],
                    ['높이', ((selectedBox.h / 100) * 1080).toFixed(2)],
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
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-bold tracking-wider text-slate-400">객체 속성</p>
                <p className="mt-2 text-sm text-slate-400">캔버스나 목록에서 객체를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 토스트 */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
            <Check className="size-4 text-green-400" />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
