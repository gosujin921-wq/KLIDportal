import { Play, Video } from 'lucide-react'
import { EVENT_TYPE_MAP, type EventTypeKey } from '@/components/domain/eventTypes'
import { cn } from '@/lib/cn'

/**
 * 데이터셋 썸네일 placeholder.
 * CCTV 야간 화면 느낌의 다크 그라데이션 + 유형색 글로우 + 유형 아이콘 워터마크.
 */
export function DatasetThumb({
  type,
  resolution,
  showPlay = false,
  className,
}: {
  type: EventTypeKey
  resolution?: string
  showPlay?: boolean
  className?: string
}) {
  const t = EVENT_TYPE_MAP[type]
  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
        className,
      )}
    >
      {/* 유형색 글로우 */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at 70% 65%, color-mix(in srgb, var(--color-event-${t.key}) 34%, transparent), transparent 75%)`,
        }}
      />
      {/* CCTV 스캔라인 텍스처 */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)',
        }}
      />
      {/* 유형 아이콘 워터마크 */}
      <t.icon
        aria-hidden
        className="absolute right-[12%] bottom-[14%] size-[34%] text-white/25"
        strokeWidth={1.4}
      />
      {/* 좌상단 CCTV 표시 */}
      <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-slate-900/60 px-1.5 py-0.5 text-xs font-semibold tracking-wide text-white/85">
        <Video className="size-3.5" />
        CCTV
      </span>
      {/* 해상도 */}
      {resolution && (
        <span className="absolute right-2.5 bottom-2.5 rounded-md bg-slate-900/60 px-1.5 py-0.5 text-xs font-medium text-white/75 tabular-nums">
          {resolution}
        </span>
      )}
      {/* 재생 오버레이 */}
      {showPlay && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <Play className="ml-0.5 size-6 fill-cobalt-600 text-cobalt-600" />
          </span>
        </span>
      )}
    </div>
  )
}
