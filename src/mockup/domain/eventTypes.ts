/** 재난·안전 이벤트 유형 정의 (기획 확정 8종). 검색카드·배지·통계에서 공통 사용. */
import {
  HeartPulse,
  BicepsFlexed,
  Flame,
  CarFront,
  ShieldAlert,
  Waves,
  TreePine,
  Mountain,
  Shapes,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type EventTypeKey =
  | 'falldown'
  | 'violence'
  | 'fire'
  | 'traffic'
  | 'abduction'
  | 'flood'
  | 'wildfire'
  | 'landslide'
  | 'etc'

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

/** 기획 확정 8종. 노출 순서도 이 배열 순서를 따른다. */
export const EVENT_TYPES: EventType[] = [
  {
    key: 'falldown',
    label: '쓰러짐',
    textClass: 'text-event-falldown',
    borderClass: 'border-event-falldown/30',
    bgClass: 'bg-yellow-50',
    icon: HeartPulse,
  },
  {
    key: 'violence',
    label: '폭력',
    textClass: 'text-event-violence',
    borderClass: 'border-event-violence/30',
    bgClass: 'bg-fuchsia-50',
    icon: BicepsFlexed,
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
    key: 'traffic',
    label: '교통사고',
    textClass: 'text-event-traffic',
    borderClass: 'border-event-traffic/30',
    bgClass: 'bg-teal-50',
    icon: CarFront,
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
    key: 'flood',
    label: '침수',
    textClass: 'text-event-flood',
    borderClass: 'border-event-flood/30',
    bgClass: 'bg-sky-50',
    icon: Waves,
  },
  {
    key: 'wildfire',
    label: '산불',
    textClass: 'text-event-wildfire',
    borderClass: 'border-event-wildfire/30',
    bgClass: 'bg-orange-50',
    icon: TreePine,
  },
  {
    key: 'landslide',
    label: '산사태',
    textClass: 'text-event-landslide',
    borderClass: 'border-event-landslide/30',
    bgClass: 'bg-stone-100',
    icon: Mountain,
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

/** 검색 칩·쇼케이스 등 사용자 노출용 8종 (기타 제외) */
export const EVENT_TYPES_MAIN = EVENT_TYPES.filter((e) => e.key !== 'etc')

export const EVENT_TYPE_MAP: Record<EventTypeKey, EventType> = Object.fromEntries(
  EVENT_TYPES.map((e) => [e.key, e]),
) as Record<EventTypeKey, EventType>
