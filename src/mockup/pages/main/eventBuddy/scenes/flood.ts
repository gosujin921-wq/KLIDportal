import * as THREE from 'three'
import {
  FEET_BOTTOM,
  blinkOpen,
  radialTex,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 침수 — 발밑에서 파란 물이 차오르며 하반신이 잠기고, 캐릭터가 까치발로 버티며
 * 팔을 허우적. 수면엔 물결·포말·튀는 물방울. 차오름 → 유지 → 빠짐. 반복.
 *
 * 물은 오브젝트(반투명 파란 시트 + 물결). 카드 배경은 중립 유지(색 배경 토큰 금지 규칙).
 * 물 시트를 캐릭터 앞(z+)에 두어 수면 아래 몸이 파랗게 비쳐 "잠긴" 느낌을 만든다.
 * 두 겹(깊은 물·수면)으로 두께감 — 두 물선 사이 얇은 띠가 일렁이는 수면으로 읽힌다.
 */

// 수면 물결(순수) — 정점·포말·물방울이 같은 수면 위에 놓이도록 공유.
function waveOffset(x: number, t: number, speed: number, phase: number, amp: number) {
  return amp * (Math.sin(x * 0.9 + t * speed + phase) + 0.45 * Math.sin(x * 1.7 - t * speed * 0.7))
}

export function buildFlood(ctx: SceneContext): SceneModule {
  const { scene, camera, track } = ctx
  const b = ctx.makeBuddy()
  scene.add(b.root)
  const shadow = ctx.makeShadow()

  // 카드 간 캐릭터 크기 통일 — 폭력·교통사고 기준(체감 크기 ≈ SCALE/카메라Z ≈ 0.064).
  camera.position.set(0, 0, 15.5)
  camera.lookAt(0, -0.1, 0)

  // 물이 잠기는 높이. HIDDEN = 발밑 아래(안 보임) → HIGH = 하반신(허리 아래)까지.
  const HIDDEN = FEET_BOTTOM - 1.0
  const HIGH = -0.3

  // ── 물 시트(반투명, 윗변이 물결치는 평면) — 캐릭터 앞에서 하반신을 덮어 잠김 연출. ──
  const WATER_W = 15
  const WATER_H = 6
  const SEG = 28
  function makeWater(color: number, opacity: number, z: number) {
    const geo = track(new THREE.PlaneGeometry(WATER_W, WATER_H, SEG, 1))
    const mat = track(
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }),
    )
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.z = z
    mesh.frustumCulled = false // 윗변 정점을 매 프레임 움직여도 컬링되지 않게
    scene.add(mesh)
    // 윗변 정점 인덱스 + 기준 x (매 프레임 waveOffset 으로 일렁)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const top: { i: number; x: number }[] = []
    for (let i = 0; i < pos.count; i++) if (pos.getY(i) > 0) top.push({ i, x: pos.getX(i) })
    return { geo, mat, pos, top, mesh, base: opacity }
  }
  // 뒤(깊은 물) → 앞(수면) 두 겹. 둘 다 캐릭터 앞(z>1.08)이라 몸이 물빛으로 비친다.
  const deep = makeWater(0x0369a1, 0.4, 1.15)
  const surf = makeWater(0x38bdf8, 0.5, 1.5)

  function updateWater(
    w: ReturnType<typeof makeWater>,
    lineY: number,
    t: number,
    speed: number,
    phase: number,
    amp: number,
    visible: number,
  ) {
    w.mesh.position.y = lineY - WATER_H / 2
    for (const { i, x } of w.top) w.pos.setY(i, WATER_H / 2 + waveOffset(x, t, speed, phase, amp))
    w.pos.needsUpdate = true
    w.mat.opacity = w.base * visible
  }

  // ── 포말(수면 흰 거품) — 수면 물결 위에 얹혀 함께 출렁. ──
  const foamTex = track(radialTex('rgba(255,255,255,0.95)', 'rgba(224,242,254,0)'))
  const foams = [-4, -2.8, -1.6, -0.6, 0.5, 1.7, 2.9, 4].map((x) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: foamTex, transparent: true, depthWrite: false })),
    )
    sp.position.z = 1.62
    scene.add(sp)
    return { sp, x }
  })

  // ── 튀는 물방울(발 주변에서 통통) — 잠길수록 활발. ──
  const dropTex = track(radialTex('rgba(190,225,255,0.96)', 'rgba(56,189,248,0)'))
  const drops = Array.from({ length: 7 }, (_, i) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: dropTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    sp.position.z = 1.64
    scene.add(sp)
    return { sp, x: -1.1 + (i / 6) * 2.2, peak: 0.55 + (i % 3) * 0.16 }
  })

  const CYCLE = 6.2
  const seg = (x: number, s: number, e: number) => smoothstep((x - s) / (e - s))

  return {
    update(t) {
      const x = t % CYCLE

      // 수위 봉투: 차오름 → 유지 → 빠짐 → 잠잠.
      let level = 0
      if (x < 0.6) level = 0
      else if (x < 2.1) level = seg(x, 0.6, 2.1)
      else if (x < 3.9) level = 1
      else if (x < 5.4) level = 1 - seg(x, 3.9, 5.4)
      else level = 0
      const calm = 1 - level
      const visible = Math.min(1, level * 4)

      // 물선(깊은 물은 살짝 아래, 수면은 살짝 위 → 둘 사이가 일렁이는 수면 띠).
      const line = HIDDEN + (HIGH - HIDDEN) * level
      updateWater(deep, line - 0.05, t, 1.0, 0.0, 0.11, visible)
      updateWater(surf, line + 0.1, t, 2.1, 1.3, 0.14, visible)
      const surfLine = line + 0.1

      // ── 캐릭터: 차오르면 까치발로 버티며 팔 허우적, 겁먹은 떨림. 잠잠하면 idle. ──
      b.root.position.y =
        level * 0.32 + Math.sin(t * 1.5) * 0.06 * calm + Math.sin(t * 3.4) * 0.05 * level
      b.char.rotation.y = Math.sin(t * 0.8) * 0.12 * calm
      b.char.rotation.z = Math.sin(t * 11) * 0.05 * level // 불안한 떨림
      b.char.rotation.x = -0.06 * level

      const sway = Math.sin(t * 1.4) * 0.05 * calm
      const flail = Math.sin(t * 15)
      b.leftArm.rotation.z = sway + level * (0.5 + 0.25 * flail)
      b.rightArm.rotation.z = -sway - level * (0.5 + 0.25 * flail)
      b.leftArm.rotation.x = -level * (0.45 + 0.35 * flail)
      b.rightArm.rotation.x = -level * (0.45 - 0.35 * flail) // 반대 위상으로 허우적

      // 잠기면 눈 동그랗게(당황), 아니면 자연 깜빡임.
      b.blink(level > 0.45 ? 1 : blinkOpen(t))
      shadow.scale.setScalar(1 - level * 0.5)

      // 포말: 수면 물결 위에 얹혀 함께 출렁.
      foams.forEach(({ sp, x: fx }) => {
        sp.position.set(fx, surfLine + waveOffset(fx, t, 2.1, 1.3, 0.14) + 0.04, 1.62)
        sp.scale.setScalar(0.34 * visible)
        sp.material.opacity = 0.7 * visible
      })

      // 물방울: 발 주변 수면에서 통통 튀어 오르며 페이드. 잠길수록 활발.
      const splash = smoothstep((level - 0.25) / 0.35)
      drops.forEach(({ sp, x: dx, peak }, i) => {
        const life = (t * 0.8 + i * 0.37) % 1
        const up = Math.sin(life * Math.PI)
        sp.position.set(
          dx + Math.sin(i * 2.1) * 0.15,
          surfLine + up * peak,
          1.64,
        )
        sp.scale.setScalar(Math.max(0.18 * splash * up, 0.0001))
        sp.material.opacity = splash * up
      })
    },
  }
}
