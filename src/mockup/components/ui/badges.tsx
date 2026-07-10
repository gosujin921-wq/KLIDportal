import { EVENT_TYPE_MAP, type EventTypeKey } from '@/components/domain/eventTypes'
import type { StatusKey } from '@/mockup/mocks/workspace'
import { cn } from '@/lib/cn'

/** 이벤트 유형 뱃지. 옅은 불투명 배경 + 유형색 텍스트·보더 */
export function EventBadge({
  type,
  withIcon = false,
  className,
}: {
  type: EventTypeKey
  withIcon?: boolean
  className?: string
}) {
  const t = EVENT_TYPE_MAP[type]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        t.bgClass,
        t.textClass,
        t.borderClass,
        className,
      )}
    >
      {withIcon && <t.icon className="size-3.5" />}
      {t.label}
    </span>
  )
}

/** 상태 뱃지. 시맨틱 톤 통일: 진행=info / 완료=success / 임박·검수=warning / 실패·반려·만료=danger */
const STATUS_META: Record<StatusKey, { label: string; className: string }> = {
  waiting: { label: '대기', className: 'bg-slate-100 text-slate-600' },
  reviewing: { label: '심사중', className: 'bg-cobalt-50 text-cobalt-700' },
  inProgress: { label: '진행중', className: 'bg-cobalt-50 text-cobalt-700' },
  reviewWait: { label: '검수대기', className: 'bg-amber-50 text-amber-700' },
  approved: { label: '승인완료', className: 'bg-green-50 text-green-700' },
  done: { label: '완료', className: 'bg-green-50 text-green-700' },
  expiring: { label: '기한임박', className: 'bg-amber-50 text-amber-700' },
  rejected: { label: '반려', className: 'bg-red-50 text-red-600' },
  failed: { label: '실패', className: 'bg-red-50 text-red-600' },
  expired: { label: '만료', className: 'bg-slate-100 text-slate-500' },
}

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold',
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  )
}

/** 데이터 구성 태그 (영상/이미지/라벨) */
export function KindTag({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-500',
        className,
      )}
    >
      {label}
    </span>
  )
}
