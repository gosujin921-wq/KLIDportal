import * as THREE from 'three'
import { blinkOpen, type Buddy, type SceneContext, type SceneModule } from '../core'

/**
 * 기본 장면 — 잔잔한 호흡·좌우 흔들·깜빡임. 아직 유형별 장면이 없는 카드의 기본값.
 * idleMotion 은 각 유형 스텁이 캐릭터를 세워두고 재활용하도록 export 한다.
 */
export function idleMotion(b: Buddy, shadow: THREE.Mesh, t: number) {
  b.root.position.y = Math.sin(t * 1.5) * 0.06
  b.char.rotation.y = Math.sin(t * 0.8) * 0.12
  const sway = Math.sin(t * 1.4) * 0.05
  b.leftArm.rotation.z = sway
  b.rightArm.rotation.z = -sway
  b.blink(blinkOpen(t))
  shadow.scale.setScalar(1 - b.root.position.y * 0.4)
}

export function buildIdle(ctx: SceneContext): SceneModule {
  const b = ctx.makeBuddy()
  ctx.scene.add(b.root)
  const shadow = ctx.makeShadow()
  return {
    update(t) {
      idleMotion(b, shadow, t)
    },
  }
}
