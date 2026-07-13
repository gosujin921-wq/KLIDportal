import * as THREE from 'three'
import {
  FEET_BOTTOM,
  blinkOpen,
  easeOutBack,
  radialTex,
  roundedBox,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 화재 — [스펙] 옆/뒤에서 주황 불꽃이 일렁이고, 캐릭터가 놀라 뒤로 폴짝 + 땀방울.
 *  - 불꽃: radialTex('rgba(255,180,80,..)', 'rgba(240,90,20,0)') 스프라이트 여러 장, 위로 일렁.
 *  - 반응: b.root.position/rotation 으로 놀라 물러나기, 땀방울은 작은 파란 스프라이트.
 *  - 색 배경 금지 규칙 유지(불꽃은 오브젝트로, 카드 배경은 중립).
 */
export function buildFire(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx
  const b = ctx.makeBuddy()
  const SCALE = 0.85 // 캐릭터 살짝 줄임
  b.root.scale.setScalar(SCALE)
  const baseY = FEET_BOTTOM * (1 - SCALE) // 줄인 만큼 발을 바닥에 고정하는 보정
  scene.add(b.root)
  const shadow = ctx.makeShadow(SCALE)

  // 카드 간 캐릭터 크기 통일 — 폭력·교통사고 기준(체감 크기 ≈ SCALE/카메라Z ≈ 0.064).
  camera.position.set(0, 0, 13.2)
  camera.lookAt(0, -0.1, 0)

  // ── 불더미 소품(장작) — 불꽃이 솟는 밑동. roundedBox 로 통나무 두 개 교차. ──
  const fire = new THREE.Group()
  fire.position.set(-2.85, FEET_BOTTOM, -1.0) // 캐릭터 왼쪽·뒤(팔 바깥 + 깊이로 간격 확보)
  fire.scale.setScalar(0.9)
  scene.add(fire)

  const logGeo = track(roundedBox(1.15, 0.3, 0.3, 0.13, 4))
  const logMat = plastic(0x7a4a24)
  const log1 = new THREE.Mesh(logGeo, logMat)
  log1.position.set(-0.08, 0.16, 0.05)
  log1.rotation.set(0, 0.5, 0.12)
  const log2 = new THREE.Mesh(logGeo, logMat)
  log2.position.set(0.1, 0.16, -0.05)
  log2.rotation.set(0, -0.55, -0.1)
  fire.add(log1, log2)

  // ── 불꽃 스프라이트(여러 장) — 바깥 주황 + 안쪽 밝은 코어. ──
  const flameTex = track(radialTex('rgba(255,120,50,0.92)', 'rgba(205,30,15,0)'))
  const coreTex = track(radialTex('rgba(255,210,140,0.98)', 'rgba(240,80,35,0)'))
  // 방사형 블롭이라 중심 아래로도 번진다 → 앵커를 장작 위로 올려(y≈0.3=장작 top) 위로만 솟게.
  const flameDefs = [
    { tex: flameTex, x: 0.0, y: 1.15, w: 1.35, h: 2.1, sp: 0.0 }, // 본체(위로)
    { tex: flameTex, x: -0.36, y: 0.92, w: 0.85, h: 1.3, sp: 1.4 }, // 좌 혓불
    { tex: flameTex, x: 0.38, y: 0.95, w: 0.85, h: 1.3, sp: 2.6 }, // 우 혓불
    { tex: flameTex, x: 0.0, y: 1.7, w: 0.8, h: 1.35, sp: 0.8 }, // 꼭대기 혀
    { tex: coreTex, x: 0.0, y: 1.0, w: 0.72, h: 1.15, sp: 3.1 }, // 코어
    { tex: coreTex, x: 0.0, y: 1.45, w: 0.5, h: 0.85, sp: 1.9 },
  ]
  const flames = flameDefs.map((d) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: d.tex, transparent: true, depthWrite: false })),
    )
    fire.add(sp)
    return sp
  })

  // 위로 오르며 사그라드는 불티
  const embers = Array.from({ length: 5 }, () => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: coreTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    fire.add(sp)
    return sp
  })

  // ── 땀방울(작은 파란 스프라이트) — 놀랄 때 머리 옆에서 또르르. char 에 부착해 머리 추적. ──
  const sweatTex = track(radialTex('rgba(190,225,255,0.96)', 'rgba(90,150,240,0)'))
  const sweats = [
    { x: 0.68, base: 1.9, ph: 0.0 },
    { x: 0.54, base: 2.08, ph: 0.55 },
    { x: 0.74, base: 1.64, ph: 0.3 },
  ].map((s) => {
    const sprite = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: sweatTex, transparent: true, depthWrite: false })),
    )
    sprite.position.set(s.x, s.base, 1.2)
    sprite.scale.setScalar(0.0001)
    b.char.add(sprite)
    return { sprite, base: s.base, ph: s.ph }
  })

  const CYCLE = 3.2
  const seg = (x: number, a: number, c: number) => smoothstep((x - a) / (c - a))

  return {
    update(t) {
      const x = t % CYCLE

      // 놀람 봉투(recoil) — 0.35~0.62 폴짝 물러남 → 유지 → 1.5~2.3 진정.
      let r = 0
      if (x < 0.35) r = 0
      else if (x < 0.62) r = easeOutBack(seg(x, 0.35, 0.62))
      else if (x < 1.5) r = 1
      else if (x < 2.3) r = 1 - seg(x, 1.5, 2.3)
      r = Math.max(0, Math.min(1.1, r))

      // 물러나기: 오른쪽으로(불은 왼쪽) 폴짝 + 뒤로 젖힘 + 겁먹은 떨림.
      const hop = x < 0.62 ? Math.sin(seg(x, 0.35, 0.62) * Math.PI) * 0.3 : 0
      const shiver = r > 0.5 ? Math.sin(t * 22) * 0.02 * r : 0
      const idleSway = Math.sin(t * 1.4) * 0.05
      b.root.position.x = r * 0.85
      b.root.position.y = baseY + hop + (1 - r) * Math.sin(t * 1.5) * 0.05
      b.root.rotation.z = -r * 0.1 + shiver
      b.char.rotation.x = -r * 0.22 // 뒤로 젖힘
      b.char.rotation.y = (1 - r) * Math.sin(t * 0.8) * 0.1 - r * 0.12

      // 팔 번쩍(방어 자세)
      b.leftArm.rotation.z = r * 1.2 + (1 - r) * idleSway
      b.rightArm.rotation.z = -r * 1.2 - (1 - r) * idleSway
      b.leftArm.rotation.x = -r * 0.5
      b.rightArm.rotation.x = -r * 0.5

      // 놀라면 눈 동그랗게, 아니면 깜빡.
      b.blink(r > 0.5 ? 1 : blinkOpen(t))
      shadow.position.x = b.root.position.x
      shadow.scale.setScalar(SCALE * (1 - hop * 0.5))

      // 불꽃 일렁 — 놀라는 순간 살짝 확 커짐(flare).
      const flare = 1 + r * 0.14
      flames.forEach((sp, i) => {
        const d = flameDefs[i]
        const fl = 0.5 + 0.5 * Math.sin(t * 9 + d.sp)
        const wob = Math.sin(t * 6 + d.sp * 1.7)
        sp.scale.set(d.w * (0.85 + 0.18 * fl) * flare, d.h * (0.88 + 0.24 * fl) * flare, 1)
        sp.position.set(d.x + wob * 0.05, d.y + fl * 0.12, 0)
        const base = d.tex === coreTex ? 0.78 : 0.66
        sp.material.opacity = Math.min(1, base + 0.26 * fl)
      })

      // 불티 — 위로 오르며 페이드(결정적: t·index 기반).
      embers.forEach((sp, i) => {
        const life = (t * 0.45 + i * 0.2) % 1
        sp.position.set(Math.sin(i * 2.3 + life * 4) * 0.35, 0.9 + life * 1.55, 0)
        sp.scale.setScalar(0.3 * (1 - life) + 0.04)
        sp.material.opacity = Math.min(life * 5, 1) * (1 - life) * 0.85
      })

      // 땀방울 — 놀랄 때 팝 후 또르르 흘러내리며 페이드.
      const drip = seg(x, 0.5, 1.7)
      sweats.forEach(({ sprite, base, ph }) => {
        const d = (drip + ph * 0.15) % 1
        sprite.position.y = base - d * 0.85
        sprite.scale.setScalar(Math.max(easeOutBack(Math.min(r, 1)) * 0.44, 0.0001))
        sprite.material.opacity = Math.min(1, r * 1.15) * (1 - d * 0.6)
      })
    },
  }
}
