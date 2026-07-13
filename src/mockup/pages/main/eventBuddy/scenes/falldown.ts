import * as THREE from 'three'
import {
  FEET_BOTTOM,
  PAL,
  blinkOpen,
  easeOutBack,
  roundedBox,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 쓰러짐 — 휘청 → 뒤로 털썩(발끝 기준 회전) → 눈 ×, 머리 위 "!" → 다시 기상. 핑퐁 반복.
 */
export function buildFalldown(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx
  const b = ctx.makeBuddy()
  scene.add(b.root)
  const shadow = ctx.makeShadow()

  // 카드 간 캐릭터 크기 통일 — 폭력·교통사고 기준(체감 크기 ≈ SCALE/카메라Z ≈ 0.064).
  camera.position.set(0, 0, 15.5)
  camera.lookAt(0, -0.1, 0)

  // 머리 위 "!" (경고색). 기절 순간 팝.
  const bang = new THREE.Group()
  const barMat = plastic(PAL.warn)
  const bar = new THREE.Mesh(track(roundedBox(0.34, 0.9, 0.34, 0.16, 5)), barMat)
  bar.position.y = 0.3
  const dot = new THREE.Mesh(track(roundedBox(0.34, 0.34, 0.34, 0.16, 5)), barMat)
  dot.position.y = -0.42
  bang.add(bar, dot)
  bang.position.set(0, 1.5, 0.8) // 캐릭터 바로 위(중앙)
  bang.scale.setScalar(0.0001)
  scene.add(bang)

  const CYCLE = 4.6
  const ramp = (x: number, a: number, c: number) => smoothstep((x - a) / (c - a))

  return {
    update(t) {
      const x = t % CYCLE
      let fall = 0
      if (x < 1.1) fall = 0
      else if (x < 1.8) fall = ramp(x, 1.1, 1.8)
      else if (x < 3.2) fall = 1
      else if (x < 4.1) fall = 1 - ramp(x, 3.2, 4.1)
      const fallE = fall < 0.5 ? 2 * fall * fall : 1 - Math.pow(-2 * fall + 2, 2) / 2

      const wobble = x < 1.1 ? Math.sin(x * 9) * 0.05 * smoothstep(x / 1.1) : 0
      const tilt = -fallE * 1.4 // 뒤로 눕는 각(발끝 기준)
      b.pivot.rotation.x = tilt
      b.char.rotation.z = wobble
      b.char.rotation.y = 0

      b.leftArm.rotation.z = fall * 1.5 + wobble
      b.rightArm.rotation.z = -fall * 1.5 - wobble
      b.leftArm.rotation.x = -fall * 0.5
      b.rightArm.rotation.x = -fall * 0.5

      // 비틀거리는 동안엔 빠르게 깜빡깜빡 → 넘어가기 직전 눈이 ×로 → 쓰러짐. 기상하며 다시 눈 뜸.
      const ko = x >= 1.0 && x < 3.9
      b.setKO(ko)
      if (!ko) b.blink(x < 1.0 ? Math.pow(Math.abs(Math.cos(x * 7)), 0.4) : blinkOpen(t))

      const bangV = fall > 0.6 ? smoothstep((fall - 0.6) / 0.25) : 0
      bang.scale.setScalar(Math.max(easeOutBack(bangV), 0.0001))
      bang.position.y = 1.5 + Math.sin(t * 3) * 0.07 * bangV

      // 발끝 한 점을 축으로 두꺼운 몸통을 눕히면 몸통 뒷면 아래 모서리가 바닥을 파고든다.
      // 회전 후 가장 낮은 모서리(몸통 뒤 아래·발뒤꿈치)가 바닥선에 닿도록 몸 전체를 들어 올려
      // "바닥을 뚫는" 대신 "등이 바닥에 닿아 눕는" 모습으로 만든다. (피벗 로컬 좌표 기준)
      const clearance = (cy: number, cz: number) => cy * Math.cos(tilt) - cz * Math.sin(tilt)
      b.root.position.y = Math.max(0, -Math.min(clearance(0.73, -1.08), clearance(0, -0.3)))

      // 그림자는 눕는 몸통 아래(지면 투영)로 미끄러져 들어간다. 카메라가 거의 수평이라
      // 발끝보다 카메라 쪽(+z)으로 나오면 반투명 평면이 캐릭터를 덮으므로,
      // 이동은 약하게 + 살짝 작게 해서 접지 그림자로만 남긴다.
      shadow.position.z = -FEET_BOTTOM * Math.sin(tilt) * 0.6
      shadow.scale.setScalar(1 - fall * 0.12)
    },
  }
}
