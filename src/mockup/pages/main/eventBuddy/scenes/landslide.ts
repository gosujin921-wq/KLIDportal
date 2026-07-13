import * as THREE from 'three'
import {
  FEET_BOTTOM,
  PAL,
  blinkOpen,
  easeOutBack,
  radialTex,
  roundedBox,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 산사태 — 서사 순서로 반복.
 *  1) 위에서 바위 하나가 떨어져 캐릭터 머리를 때림 → 움찔(눌림·"!"·충격 스파크).
 *  2) 맞은 바위가 오른쪽으로 튕겨 데굴데굴 굴러감.
 *  3) 캐릭터가 정신 차리고 왼쪽으로 폴짝 회피.
 *  4) 비운 자리로 갈색 바위·흙덩이가 우수수 쏟아짐(굴러 떨어지며 흙먼지).
 *  5) 잦아들고 제자리 복귀.
 *
 *  카메라가 완전 수평(0,0,9)이라 깊이(z)로는 위아래 분리가 안 됨 → 겹침은 world x 로 제어.
 *  회피 후 낙석 대역은 캐릭터가 비운 중앙~오른쪽, 캐릭터는 왼쪽(-x)이라 화면상 분리된다.
 */
export function buildLandslide(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx
  const b = ctx.makeBuddy()
  const SCALE = 0.86 // 굴러오는 바위 무리에 자리를 내주려 캐릭터 살짝 줄임
  b.root.scale.setScalar(SCALE)
  const baseY = FEET_BOTTOM * (1 - SCALE) // 줄인 만큼 발을 바닥에 고정하는 보정
  scene.add(b.root)
  const shadow = ctx.makeShadow(SCALE)

  // 카드 간 캐릭터 크기 통일 — 폭력·교통사고 기준(체감 크기 ≈ SCALE/카메라Z ≈ 0.064).
  camera.position.set(0, 0, 13.4)
  camera.lookAt(0, -0.1, 0)

  const GROUND = FEET_BOTTOM + 0.18 // 바위가 구르는 바닥선(발 언저리)
  const TOP = 4.6 // 낙하 시작 높이(비탈 위)
  const HEAD_Y = 1.55 // 타격 지점(머리 위, SCALE 반영 world 높이)

  // ── 흙먼지·충격 스파크 텍스처 ──
  const dustTex = track(radialTex('rgba(180,150,110,0.85)', 'rgba(150,120,80,0)'))
  const sparkTex = track(radialTex('rgba(255,244,214,0.98)', 'rgba(245,180,90,0)'))

  // ── 바위 팩토리(메시 + 착지 흙먼지). 흙덩이 느낌으로 살짝 찌그러뜨림. ──
  function makeRock(size: number, color: number) {
    const mesh = new THREE.Mesh(track(roundedBox(size, size, size, size * 0.28, 4)), plastic(color))
    const baseScale = new THREE.Vector3(1.08, 0.9, 1.02)
    scene.add(mesh)
    const dust = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: dustTex, transparent: true, depthWrite: false })),
    )
    dust.scale.setScalar(0.0001)
    scene.add(dust)
    return { mesh, dust, size, baseScale, groundY: GROUND + size * 0.5 }
  }
  const setRock = (r: ReturnType<typeof makeRock>, x: number, y: number, rot: THREE.Euler, hide: number) => {
    r.mesh.position.set(x, y, r.mesh.position.z)
    r.mesh.rotation.copy(rot)
    r.mesh.scale.set(r.baseScale.x * hide, r.baseScale.y * hide, r.baseScale.z * hide)
  }
  const puffDust = (r: ReturnType<typeof makeRock>, x: number, z: number, amt: number) => {
    r.dust.position.set(x, r.groundY - r.size * 0.35, z)
    r.dust.scale.setScalar(0.0001 + amt * (0.6 + r.size))
    r.dust.material.opacity = amt * (1 - amt) * 4 * 0.7
  }

  // ── 캐릭터를 때리는 바위(사이클당 1개) ──
  const hitRock = makeRock(0.56, 0x8a5a34)

  // ── 회피 후 우수수 쏟아지는 낙석 ──
  const FALL = [
    { size: 0.58, color: 0x8a5a34, sx: 0.2, ex: 1.1, z: 0.55, spin: 5.2, sax: 0.5, off: 0.0, dur: 1.0 },
    { size: 0.42, color: 0x9c6a3c, sx: 0.9, ex: 1.9, z: 0.2, spin: 6.6, sax: -0.4, off: 0.16, dur: 0.9 },
    { size: 0.5, color: 0x7a5028, sx: 0.0, ex: 0.9, z: 0.8, spin: 5.6, sax: 0.5, off: 0.3, dur: 0.95 },
    { size: 0.36, color: 0xa9784a, sx: 1.3, ex: 2.1, z: 0.4, spin: 7.4, sax: 0.35, off: 0.46, dur: 0.85 },
    { size: 0.46, color: 0x5f3d1e, sx: 0.5, ex: 1.5, z: 0.1, spin: 6.0, sax: -0.5, off: 0.62, dur: 0.95 },
  ]
  const fallRocks = FALL.map((d) => {
    const r = makeRock(d.size, d.color)
    r.mesh.position.z = d.z
    r.dust.position.z = d.z
    return { r, d }
  })

  // ── 충격 스파크(타격 순간 머리에서 번쩍) ──
  const spark = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: sparkTex, transparent: true, depthWrite: false })),
  )
  spark.position.set(0, HEAD_Y, 0.9)
  spark.scale.setScalar(0.0001)
  scene.add(spark)

  // ── 머리 위 "!" (경고색) — falldown 과 동일 조형. 타격·회피 때 팝. ──
  const bang = new THREE.Group()
  const barMat = plastic(PAL.warn)
  const bar = new THREE.Mesh(track(roundedBox(0.34, 0.9, 0.34, 0.16, 5)), barMat)
  bar.position.y = 0.3
  const dot = new THREE.Mesh(track(roundedBox(0.34, 0.34, 0.34, 0.16, 5)), barMat)
  dot.position.y = -0.42
  bang.add(bar, dot)
  bang.position.set(0, 1.62, 0.8)
  bang.scale.setScalar(0.0001)
  scene.add(bang) // world 부착(회전 비상속) + 매 프레임 머리 추적

  const CYCLE = 5.2
  const HIT = 0.5 // 타격 순간
  const DODGE = HIT + 0.36 // 회피 시작(맞고 곧장 ≈0.86)
  const RF_START = DODGE + 0.06 // 낙석 시작(회피와 거의 동시 ≈0.92)
  const ramp = (x: number, a: number, c: number) => smoothstep((x - a) / (c - a))
  const tmpRot = new THREE.Euler()

  return {
    update(t) {
      const x = t % CYCLE

      // 착지한 돌이 바닥에 쌓여 남았다가 복귀 구간(4.2~4.85)에 정리 → 다음 사이클은 빈 바닥.
      const clearAll = 1 - ramp(x, 4.2, 4.85)

      // ── 타격 스파이크(bonk) — 60ms 빠른 눌림 후 0.5s 감쇠. ──
      let bonk = 0
      if (x >= HIT) {
        const since = x - HIT
        bonk = smoothstep(since / 0.05) * (1 - smoothstep((since - 0.05) / 0.34))
      }
      bonk = Math.max(0, bonk)

      // ── 회피 봉투 — DODGE 부터 왼쪽으로 폴짝 → 유지 → 4.2~4.9 복귀. ──
      let d = 0
      if (x < DODGE) d = 0
      else if (x < DODGE + 0.32) d = easeOutBack(ramp(x, DODGE, DODGE + 0.32))
      else if (x < 4.2) d = 1
      else if (x < 4.9) d = 1 - ramp(x, 4.2, 4.9)
      d = Math.max(0, Math.min(1.1, d))

      const react = Math.max(d, bonk)
      const hop = x >= DODGE && x < DODGE + 0.32 ? Math.sin(ramp(x, DODGE, DODGE + 0.32) * Math.PI) * 0.34 : 0
      const shiver = d > 0.5 ? Math.sin(t * 24) * 0.02 * d : 0
      const dizzy = Math.sin((x - HIT) * 20) * 0.05 * bonk // 맞은 뒤 어질한 흔들
      const idleSway = Math.sin(t * 1.4) * 0.05
      const idleBob = react < 0.02 ? Math.sin(t * 1.5) * 0.05 : 0

      // 위치: 타격 눌림(아래로) + 회피 폴짝 + 왼쪽 사이드스텝.
      b.root.position.x = -d * 1.6
      b.root.position.y = baseY - bonk * 0.22 + hop + idleBob
      b.root.rotation.z = d * 0.14 + dizzy + shiver
      b.char.rotation.x = -d * 0.12 - bonk * 0.15 // 움츠림/눌림
      b.char.rotation.y = (1 - react) * Math.sin(t * 0.8) * 0.1 - d * 0.14

      // 눌림 스쿼시(머리 얻어맞음).
      b.char.scale.set(1 + bonk * 0.12, 0.94 * (1 - bonk * 0.2), 1 + bonk * 0.06)

      // 방어 팔(머리 감싸기) — 타격·회피 중 위로 번쩍.
      const armUp = Math.max(d * 1.35, bonk * 1.15)
      b.leftArm.rotation.z = armUp + (1 - react) * idleSway
      b.rightArm.rotation.z = -armUp - (1 - react) * idleSway
      b.leftArm.rotation.x = -react * 0.5
      b.rightArm.rotation.x = -react * 0.5

      b.blink(react > 0.4 ? 1 : blinkOpen(t)) // 놀라면 눈 동그랗게
      shadow.position.x = b.root.position.x
      shadow.scale.setScalar(SCALE * (1 - hop * 0.5))

      // ── 충격 스파크 — 타격 순간 머리에서 번쩍. ──
      spark.scale.setScalar(0.0001 + bonk * 1.1)
      spark.material.opacity = bonk

      // ── "!" 팝 — 타격·회피 때 튀어오름, 머리 추적. ──
      const bangV = Math.max(bonk, d > 0.5 ? smoothstep((d - 0.5) / 0.3) : 0)
      bang.scale.setScalar(Math.max(easeOutBack(Math.min(bangV, 1)), 0.0001))
      bang.position.x = b.root.position.x
      bang.position.y = 1.98 + hop - bonk * 0.22 + Math.sin(t * 3) * 0.07 * bangV

      // ── 타격 바위: 낙하(→머리) → 튕겨 오른쪽으로 굴러감 → 그 자리에 쌓임. ──
      if (x < HIT) {
        const p = x / HIT
        tmpRot.set(p * 5, p * 0.6, -p * 4)
        setRock(hitRock, 0.16 - 0.14 * p, TOP - (TOP - HEAD_Y) * p * p, tmpRot, smoothstep(p / 0.08))
        hitRock.dust.material.opacity = 0
      } else if (x < HIT + 0.9) {
        const p = ramp(x, HIT, HIT + 0.9)
        const hx = 0.05 + (2.7 - 0.05) * p
        // 머리에서 한 번 튀어오른 뒤 바닥으로.
        const hy = HEAD_Y + Math.sin(p * Math.PI) * 0.6 - (HEAD_Y - hitRock.groundY) * p
        tmpRot.set(5 + p * 7, 0.6, -5 - p * 8)
        setRock(hitRock, hx, hy, tmpRot, 1)
        puffDust(hitRock, hx, hitRock.mesh.position.z, ramp(p, 0.8, 1))
      } else {
        // 굴러가 멈춤 — 그 자리에 쌓여 유지, 복귀 때 정리.
        tmpRot.set(12, 0.6, -13)
        setRock(hitRock, 2.7, hitRock.groundY, tmpRot, clearAll)
        hitRock.dust.material.opacity = 0
      }

      // ── 낙석: 회피 후 비운 자리로 우수수 → 착지 지점에 쌓여 남음. ──
      fallRocks.forEach(({ r, d: def }) => {
        const localStart = RF_START + def.off
        const p = (x - localStart) / def.dur
        if (x < localStart) {
          // 등장 전 — 빈 바닥.
          r.mesh.scale.setScalar(0.0001)
          r.dust.material.opacity = 0
        } else if (p <= 1) {
          // 낙하 중.
          const rx = def.sx + (def.ex - def.sx) * p
          tmpRot.set(p * def.spin * def.sax, p * 0.8, -p * def.spin)
          setRock(r, rx, TOP - (TOP - r.groundY) * p * p, tmpRot, smoothstep(p / 0.08) * clearAll)
          puffDust(r, def.ex - 0.05, def.z, ramp(p, 0.82, 1))
        } else {
          // 착지 후 — 그 자리에 쌓여 유지, 복귀 때 정리.
          tmpRot.set(def.spin * def.sax, 0.8, -def.spin)
          setRock(r, def.ex, r.groundY, tmpRot, clearAll)
          r.dust.material.opacity = 0
        }
      })
    },
  }
}
