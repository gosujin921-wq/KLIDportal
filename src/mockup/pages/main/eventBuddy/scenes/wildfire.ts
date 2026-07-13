import * as THREE from 'three'
import {
  FEET_BOTTOM,
  YSCALE,
  radialTex,
  roundedBox,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 산불 — 초록 복셀 침엽수 "숲"(여러 그루)에 주황 불꽃이 그루마다 위상차로 번지고,
 * 위로 회색 연기가 피어오른다. 캐릭터는 겁먹고 물러나는 화재(fire)와 달리
 * 소방수처럼 왼팔을 들어 물줄기를 뿌리며 "대응"한다.
 *
 * 차별화 포인트
 *  - fire.ts = 장작 한 더미 + 뒤로 폴짝(회피). wildfire = 숲(3그루)·번짐·연기 + 진화 동작.
 *  - 불은 오브젝트(스프라이트)로만. 카드 배경은 중립 유지(opacity 색 배경 금지 규칙).
 */
export function buildWildfire(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx

  // ── 캐릭터: 중앙 우측에 서서 왼쪽 숲을 향해 물 분사 ──
  const SCALE = 0.82
  const REST_X = 0.7
  const b = ctx.makeBuddy()
  b.root.scale.setScalar(SCALE)
  const baseY = FEET_BOTTOM * (1 - SCALE) // 줄인 만큼 발을 바닥에 고정
  b.root.position.set(REST_X, 0, 0)
  scene.add(b.root)
  const shadow = ctx.makeShadow(SCALE)
  shadow.position.x = REST_X

  // 카드 간 캐릭터 크기 통일 — 폭력·교통사고 기준(체감 크기 ≈ SCALE/카메라Z ≈ 0.064).
  camera.position.set(0, 0, 12.75)
  camera.lookAt(0, -0.1, 0)

  // ── 텍스처(불꽃·불티·연기·물) ──
  const flameTex = track(radialTex('rgba(255,150,60,0.85)', 'rgba(220,70,20,0)'))
  const coreTex = track(radialTex('rgba(255,240,170,0.98)', 'rgba(250,150,45,0)')) // 밝은 노란 심지
  const smokeTex = track(radialTex('rgba(120,122,132,0.5)', 'rgba(120,122,132,0)'))
  const waterTex = track(radialTex('rgba(200,230,255,0.96)', 'rgba(90,160,245,0)'))

  // ── 침엽수 소품(줄기 + 3단 잎) ──
  const forest = new THREE.Group()
  forest.position.set(0, FEET_BOTTOM, 0) // 바닥에 밑동을 맞춤
  scene.add(forest)

  const trunkGeo = track(roundedBox(0.44, 0.95, 0.44, 0.14, 4))
  const foliageGeo = track(roundedBox(1.35, 0.85, 1.35, 0.24, 5))
  const FOLIAGE_FRONT = 0.72 // 잎 앞면(깊이 1.35 → 반 0.675)보다 살짝 앞. 불꽃·불티를 여기로.
  const trunkMat = plastic(0x7a4a24)

  interface Flame {
    sp: THREE.Sprite
    tex: THREE.Texture
    y: number
    w: number
    h: number
    ph: number
  }
  interface Tree {
    group: THREE.Group
    ti: number
    flames: Flame[]
    leaf: THREE.MeshPhysicalMaterial // 나무별 잎 재질(불붙으면 그을려 물듦)
  }

  // 잎 색: 생생한 초록 → 불붙어 그을린 주황갈색
  const LEAF_GREEN = new THREE.Color(0x2f9e44)
  const LEAF_BURNT = new THREE.Color(0x8a3a12)

  // 앞줄(캐릭터에 가까움) → 뒤로 갈수록 새로 옮겨붙게 ignite 지연
  const treeDefs = [
    { x: -2.3, z: 0.3, s: 0.9, ignite: 0.0 },
    { x: -3.2, z: -0.4, s: 1.1, ignite: 1.0 },
    { x: -4.0, z: 0.1, s: 0.75, ignite: 1.9 },
  ]
  const tiers = [
    { y: 1.15, s: 1.0 },
    { y: 1.7, s: 0.74 },
    { y: 2.12, s: 0.5 },
  ]

  const trees: Tree[] = treeDefs.map((def, ti) => {
    const g = new THREE.Group()
    g.position.set(def.x, 0, def.z)
    g.scale.setScalar(def.s)
    forest.add(g)

    const trunk = new THREE.Mesh(trunkGeo, trunkMat)
    trunk.position.y = 0.47
    g.add(trunk)
    const leaf = plastic(0x2f9e44) // 나무마다 따로 → 그루별로 타들어감
    tiers.forEach((tier) => {
      const m = new THREE.Mesh(foliageGeo, leaf)
      m.position.y = tier.y
      m.scale.setScalar(tier.s)
      g.add(m)
    })

    // 잎을 감싸고 위로 솟구치는 화염(큰 몸통 + 위 혓불 + 밝은 코어)
    const ig = def.ignite * 2
    const flameDefs: Flame[] = [
      { sp: null as unknown as THREE.Sprite, tex: flameTex, y: 1.35, w: 2.0, h: 3.0, ph: ig },
      { sp: null as unknown as THREE.Sprite, tex: flameTex, y: 2.1, w: 1.25, h: 2.0, ph: ig + 1.3 },
      { sp: null as unknown as THREE.Sprite, tex: flameTex, y: 1.5, w: 1.4, h: 1.2, ph: ig + 0.6 },
      { sp: null as unknown as THREE.Sprite, tex: coreTex, y: 1.5, w: 1.05, h: 1.8, ph: ig + 2.4 },
      { sp: null as unknown as THREE.Sprite, tex: coreTex, y: 2.15, w: 0.6, h: 1.2, ph: ig + 1.9 },
    ]
    flameDefs.forEach((fd) => {
      fd.sp = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: fd.tex, transparent: true, depthWrite: false })),
      )
      fd.sp.position.set(0, fd.y, FOLIAGE_FRONT) // 잎 앞면보다 앞 → 잎에 안 묻히고 타오름
      g.add(fd.sp)
    })
    return { group: g, ti, flames: flameDefs, leaf }
  })

  // ── 불티(위로 오르며 소멸) ──
  const embers = Array.from({ length: 4 }, () => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: coreTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    forest.add(sp)
    return sp
  })

  // ── 연기(숲 위로 크게 피어오름 — 산불의 대표 신호) ──
  const smokes = Array.from({ length: 4 }, (_, i) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    forest.add(sp)
    return { sp, ph: i / 4, x0: [-2.3, -3.2, -4.0, -2.8][i] }
  })

  // ── 물줄기(왼손에서 숲으로 아치) — 캐릭터에 부착해 몸을 따라감 ──
  const WATER_FROM = new THREE.Vector2(-2.3, 1.45)
  const WATER_TO = new THREE.Vector2(-4.9, 0.25)
  const drops = Array.from({ length: 9 }, (_, i) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: waterTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    b.char.add(sp)
    return { sp, ph: i / 9 }
  })
  // 노즐(손끝) 밝은 코어
  const nozzle = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: waterTex, transparent: true, depthWrite: false })),
  )
  nozzle.position.set(WATER_FROM.x, WATER_FROM.y, 1.4)
  b.char.add(nozzle)

  return {
    update(t) {
      // ── 캐릭터: 산불 앞에서 허둥지둥. 제자리 종종걸음 + 두리번 + 양팔 허우적 + 급히 물 분사 ──
      const step = Math.sin(t * 7) // 좌우로 바쁜 종종걸음(발 동동)
      const stomp = Math.abs(step) // 발디딤 0..1(부유가 아닌 발 구르기)
      const look = Math.sin(t * 2.7) // 다급하게 두리번
      const flail = Math.sin(t * 13) // 왼팔 정신없이
      const flailR = Math.sin(t * 13 + 1.6) // 오른팔(반대 위상)
      b.root.position.x = REST_X + step * 0.14
      b.root.position.y = baseY + stomp * 0.04 // 발 구르며 톡톡(짧고 얕게)
      b.char.scale.set(1, YSCALE * (1 - (1 - stomp) * 0.05), 1) // 디딜 때 살짝 눌림
      b.char.rotation.y = -0.2 + look * 0.3 // 불 쪽 위주로 보되 좌우로 두리번
      b.char.rotation.x = 0.08
      b.char.rotation.z = step * 0.1 // 스텝 반동으로 몸 좌우 기울임
      b.leftArm.rotation.z = 1.1 + flail * 0.4 // 왼팔로 급히 물 뿌리며 허둥
      b.leftArm.rotation.x = -0.5 + flail * 0.3
      b.rightArm.rotation.z = -0.3 - flailR * 0.5 // 오른팔 정신없이 허우적
      b.rightArm.rotation.x = 0.1 - flailR * 0.3
      b.blink(1) // 놀라 눈 동그랗게
      shadow.position.x = b.root.position.x
      shadow.scale.setScalar(SCALE * (1 - stomp * 0.06))

      // ── 불꽃: 그루마다 위상차 파동으로 활활 번짐. 앞줄(ti=0)은 물에 눌려 약함. ──
      let heat = 0 // 전역 화세(연기 세기 등에 사용)
      trees.forEach(({ group, ti, flames, leaf }) => {
        const spread = 0.5 + 0.5 * Math.sin(t * 0.8 - ti * 1.5) // 그루 사이를 도는 파동
        let burn = 0.78 + 0.22 * spread
        if (ti === 0) burn *= 0.85 + 0.1 * Math.sin(t * 3.1) // 진화 중인 앞줄은 살짝 잦아듦
        heat += burn
        flames.forEach((fd) => {
          const fl = 0.5 + 0.5 * Math.sin(t * 9 + fd.ph)
          const wob = Math.sin(t * 6 + fd.ph * 1.7)
          fd.sp.scale.set(fd.w * (0.82 + 0.18 * fl) * burn, fd.h * (0.85 + 0.25 * fl) * burn, 1)
          fd.sp.position.set(wob * 0.07, fd.y + fl * 0.14, FOLIAGE_FRONT)
          const base = fd.tex === coreTex ? 0.72 : 0.5
          fd.sp.material.opacity = Math.min(0.9, base + 0.18 * fl) * (0.55 + 0.45 * burn)
        })

        // 잎은 초록을 유지하며 살짝만 그을림 + 은은한 주황 발광(불꽃과 대비되게)
        leaf.color.lerpColors(LEAF_GREEN, LEAF_BURNT, Math.min(burn * 0.4, 0.4))
        const gl = 0.5 + 0.5 * Math.sin(t * 8 + ti)
        leaf.emissive.setRGB(0.12 * burn * (0.6 + 0.4 * gl), 0.05 * burn, 0.01)

        // 열기 흔들림
        group.rotation.z = Math.sin(t * 1.1 + ti) * 0.03
      })
      heat /= trees.length

      // ── 불티: 위로 오르며 페이드(결정적: t·index 기반) ──
      embers.forEach((sp, i) => {
        const life = (t * 0.4 + i * 0.25) % 1
        sp.position.set(-3.1 + Math.sin(i * 2.3 + life * 4) * 1.0, 1.0 + life * 1.6, 0.8)
        sp.scale.setScalar(0.28 * (1 - life) + 0.04)
        sp.material.opacity = Math.min(life * 5, 1) * (1 - life) * 0.85
      })

      // ── 연기: 숲 위로 크게 오르며 드리프트·확산·소멸 ──
      smokes.forEach(({ sp, ph, x0 }) => {
        const life = (t * 0.16 + ph) % 1
        sp.position.set(x0 + life * 0.6 + Math.sin(life * 4 + ph * 6) * 0.22, 2.3 + life * 2.2, -0.2)
        sp.scale.setScalar(0.55 + life * 1.5)
        sp.material.opacity = Math.min(life * 4, 1) * (1 - life) * 0.5 * (0.5 + 0.5 * heat)
      })

      // ── 물줄기: 왼손에서 숲으로 아치. 허둥대며 뿌리니 상하로 우왕좌왕(팔 허우적과 동기). ──
      const toY = WATER_TO.y + flail * 0.5
      drops.forEach(({ sp, ph }) => {
        const life = (t * 0.9 + ph) % 1
        const x = WATER_FROM.x + (WATER_TO.x - WATER_FROM.x) * life
        const y = WATER_FROM.y + (toY - WATER_FROM.y) * life + Math.sin(life * Math.PI) * 0.55
        const jit = Math.sin(ph * 30 + life * 12) * 0.06
        sp.position.set(x, y + jit, 1.4)
        const grow = Math.min(life * 6, 1)
        sp.scale.setScalar(Math.max(0.24 * grow * (1 - life * 0.5), 0.0001))
        sp.material.opacity = grow * (1 - life)
      })
      // 노즐 코어 맥동
      const pulse = 0.16 + 0.05 * Math.sin(t * 16)
      nozzle.scale.setScalar(pulse)
      nozzle.material.opacity = 0.85
    },
  }
}
