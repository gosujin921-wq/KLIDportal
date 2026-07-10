/** 재난·안전 이벤트 유형 정의. 검색카드·배지·통계에서 공통 사용. */
import { TreePine, Waves, Flame, ShieldAlert, Shapes } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type EventTypeKey = 'wildfire' | 'flood' | 'fire' | 'abduction' | 'etc'

export interface EventType {
  key: EventTypeKey
  label: string
  /** Tailwind 텍스트 색 토큰 */
  textClass: string
  /** Tailwind 보더 색 토큰 */
  borderClass: string
  /** 옅은 배경(불투명) */
  bgClass: string
  /** 유형 아이콘 (lucide) */
  icon: LucideIcon
}

export const EVENT_TYPES: EventType[] = [
  {
    key: 'wildfire',
    label: '산불',
    textClass: 'text-event-wildfire',
    borderClass: 'border-event-wildfire/30',
    bgClass: 'bg-orange-50',
    icon: TreePine,
  },
  {
    key: 'flood',
    label: '침수',
    textClass: 'text-event-flood',
    borderClass: 'border-event-flood/30',
    bgClass: 'bg-cyan-50',
    icon: Waves,
  },
  {
    key: 'fire',
    label: '화재',
    textClass: 'text-event-fire',
    borderClass: 'border-event-fire/30',
    bgClass: 'bg-red-50',
    icon: Flame,
  },
  {
    key: 'abduction',
    label: '유괴',
    textClass: 'text-event-abduction',
    borderClass: 'border-event-abduction/30',
    bgClass: 'bg-violet-50',
    icon: ShieldAlert,
  },
  {
    key: 'etc',
    label: '기타',
    textClass: 'text-event-etc',
    borderClass: 'border-event-etc/30',
    bgClass: 'bg-slate-50',
    icon: Shapes,
  },
]

export const EVENT_TYPE_MAP: Record<EventTypeKey, EventType> = Object.fromEntries(
  EVENT_TYPES.map((e) => [e.key, e]),
) as Record<EventTypeKey, EventType>
