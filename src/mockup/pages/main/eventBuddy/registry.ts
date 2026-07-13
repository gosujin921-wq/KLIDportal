import type { EventTypeKey } from '@/mockup/domain/eventTypes'
import type { SceneBuilder } from './core'
import { buildIdle } from './scenes/idle'
import { buildFalldown } from './scenes/falldown'
import { buildViolence } from './scenes/violence'
import { buildFire } from './scenes/fire'
import { buildTraffic } from './scenes/traffic'
import { buildAbduction } from './scenes/abduction'
import { buildFlood } from './scenes/flood'
import { buildWildfire } from './scenes/wildfire'
import { buildLandslide } from './scenes/landslide'

/**
 * EventTypeKey → 유형별 장면 빌더. 각 빌더는 scenes/*.ts 에서 독립 작업.
 * 미구현 유형은 현재 idle(호흡)로 폴백. 새 유형 장면을 완성하면 여기 매핑만 추가/갱신하면 된다.
 */
export const EVENT_SCENES: Partial<Record<EventTypeKey, SceneBuilder>> = {
  falldown: buildFalldown,
  violence: buildViolence,
  fire: buildFire,
  traffic: buildTraffic,
  abduction: buildAbduction,
  flood: buildFlood,
  wildfire: buildWildfire,
  landslide: buildLandslide,
}

export function resolveScene(event: EventTypeKey): SceneBuilder {
  return EVENT_SCENES[event] ?? buildIdle
}
