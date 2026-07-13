import * as THREE from 'three'
import {
  FACE_FRONT,
  FEET_BOTTOM,
  FULL,
  PAL,
  blinkOpen,
  radialTex,
  roundedBox,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 폭력(만화적) — 둘은 떨어진 채로 손을 위아래로 휘두르며 다툰다(겹치지 않음).
 * 잠시 뒤 먼지구름이 둘을 통째로 가리고(그 뒤에서 몸통은 숨김, 별만 삐죽),
 * 구름이 걷히면 얼굴 볼에 대일밴드(X)가 붙어 있다. 핑퐁 반복.
 */
export function buildViolence(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic, faceMat, eyeMat } = ctx
  const REST = 1.5
  const ARM_Y = FULL / 2 // 팔(어깨) 기본 높이 — 위/아래 스윙의 기준
  const a = ctx.makeBuddy()
  const c = ctx.makeBuddy()
  a.root.scale.setScalar(0.62)
  c.root.scale.setScalar(0.62)
  a.char.rotation.y = 0.5 // 서로 마주 봄
  c.char.rotation.y = -0.5

  // 두 캐릭터 구분: 웜/쿨로 뒤집지 않고, 기본 쿨 팔레트 안에서 색 "자리"만 순환시킨다.
  // a 는 기본, c 는 같은 팔레트를 한 칸씩 돌려 배치(머리·팔·발은 인디고→라벤더로 포인트).
  // 공유 재질(faceMat·eyeMat)은 건드리지 않는다. 소품(밴드) 부착 전에 호출.
  const SWAP: Record<number, number> = {
    [PAL.cyan]: PAL.blueLight,
    [PAL.blueLight]: PAL.violet,
    [PAL.violet]: PAL.pink,
    [PAL.pink]: PAL.skyblue,
    [PAL.skyblue]: PAL.cyan,
    [PAL.indigo]: PAL.violet,
  }
  const PAL_LIST = [PAL.cyan, PAL.blue, PAL.blueLight, PAL.indigo, PAL.violet, PAL.pink, PAL.skyblue]
  const probe = new THREE.Color()
  const nearestPal = (col: THREE.Color) => {
    let best = PAL_LIST[0]
    let bestD = Infinity
    for (const p of PAL_LIST) {
      probe.setHex(p)
      const d = (probe.r - col.r) ** 2 + (probe.g - col.g) ** 2 + (probe.b - col.b) ** 2
      if (d < bestD) {
        bestD = d
        best = p
      }
    }
    return best
  }
  const remap = (char: THREE.Group, map: Record<number, number>) => {
    char.traverse((o) => {
      const mesh = o as THREE.Mesh
      const mat = mesh.material as THREE.MeshPhysicalMaterial
      if (!mesh.isMesh || !mat || mat === faceMat || mat === eyeMat || !mat.color) return
      const next = map[nearestPal(mat.color)]
      if (next === undefined) return
      mat.color.setHex(next)
      if (mat.emissive) mat.emissive.copy(mat.color).multiplyScalar(0.08)
    })
  }
  remap(c.char, SWAP)

  scene.add(a.root, c.root)
  const shadowA = ctx.makeShadow(0.62)
  const shadowC = ctx.makeShadow(0.62)
  const shy = FEET_BOTTOM * 0.62 + 0.02
  shadowA.position.set(-REST, shy, 0)
  shadowC.position.set(REST, shy, 0)
  camera.position.set(0, 0, 9.6)
  camera.lookAt(0, -0.2, 0)

  // 대일밴드(X) — 얼굴 볼에 붙는 밴드 두 줄 교차. 기본 숨김.
  const bandGeo = track(roundedBox(0.16, 0.5, 0.07, 0.07, 3))
  function makeBandaid(px: number, py: number, tilt: number) {
    const g = new THREE.Group()
    const s1 = new THREE.Mesh(bandGeo, plastic(0xf6cea8))
    s1.rotation.z = Math.PI / 5
    const s2 = new THREE.Mesh(bandGeo, plastic(0xf6cea8))
    s2.rotation.z = -Math.PI / 5
    g.add(s1, s2)
    g.scale.setScalar(1.7) // 크게 — 잘 보이게
    g.rotation.z = tilt
    g.position.set(px, py, FACE_FRONT + 0.02)
    g.visible = false
    return g
  }
  // 눈(중앙 y0 부근)은 피해서 아래/위 구석에. 위치·기울기도 달라 미러링 방지.
  const aBand = makeBandaid(0.5, -0.78, 0.2) // a: 오른 눈 아래(뺨)
  const cBand = makeBandaid(-0.5, 0.8, -0.24) // c: 왼 눈 위(이마)
  a.char.add(aBand)
  c.char.add(cBand)

  // 먼지구름 — fire 불꽃과 같은 소프트 스프라이트 레이어 방식.
  // 흰 배경에 흰 구름은 안 보이므로, 바깥은 진한 슬레이트(그늘) + 안쪽은 밝은 하이라이트로 두 톤.
  const dustTex = track(radialTex('rgba(122,134,158,0.92)', 'rgba(78,90,116,0)'))
  const dustCore = track(radialTex('rgba(230,236,245,0.98)', 'rgba(172,184,204,0)'))
  const cloudGroup = new THREE.Group()
  cloudGroup.position.set(0, 0.05, 1.6)
  // 두 캐릭터(±1.5)에 맞춰 넓고 낮은 형태 — 화면을 꽉 채우지 않게.
  const puffDefs = [
    { tex: dustTex, x: 0.0, y: 0.0, w: 3.0, h: 2.4, sp: 0.0 },
    { tex: dustTex, x: -1.5, y: 0.05, w: 2.3, h: 2.0, sp: 1.4 },
    { tex: dustTex, x: 1.5, y: 0.05, w: 2.3, h: 2.0, sp: 2.6 },
    { tex: dustTex, x: -0.85, y: -0.5, w: 1.9, h: 1.7, sp: 0.8 },
    { tex: dustTex, x: 0.85, y: -0.5, w: 1.9, h: 1.7, sp: 3.4 },
    { tex: dustTex, x: 0.0, y: 0.62, w: 2.1, h: 1.8, sp: 1.9 },
    { tex: dustCore, x: -0.95, y: 0.0, w: 1.6, h: 1.4, sp: 2.2 },
    { tex: dustCore, x: 0.95, y: 0.05, w: 1.6, h: 1.4, sp: 0.5 },
    { tex: dustCore, x: 0.0, y: -0.05, w: 1.8, h: 1.6, sp: 3.1 },
  ]
  const puffs = puffDefs.map((d) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: d.tex, transparent: true, depthWrite: false })),
    )
    cloudGroup.add(sp)
    return sp
  })
  cloudGroup.scale.setScalar(0.0001)
  scene.add(cloudGroup)

  // 구름 밖으로 삐죽 튀는 별(충돌 중)
  const starTex = track(radialTex('rgba(255,224,130,0.95)', 'rgba(245,158,11,0)'))
  const stars = Array.from({ length: 4 }, () => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    scene.add(sp)
    return sp
  })

  const CYCLE = 4.4
  const seg = (x: number, s: number, e: number) => smoothstep((x - s) / (e - s))

  return {
    update(t) {
      const x = t % CYCLE

      // ── 타임라인: 손 휘두름 → 마주보기(정지) → a 점프·부딪힘 → 연기 덮음 → 걷힘·반창고 ──
      // 손 휘두름 0.2~1.05 (부드럽게 켜고 끔)
      let flail = 0
      if (x < 0.2) flail = 0
      else if (x < 0.5) flail = seg(x, 0.2, 0.5)
      else if (x < 0.85) flail = 1
      else if (x < 1.05) flail = 1 - seg(x, 0.85, 1.05)
      // 마주보기(정지 비트) 1.0~1.9
      let faceoff = 0
      if (x >= 1.0 && x < 1.3) faceoff = seg(x, 1.0, 1.3)
      else if (x >= 1.3 && x < 1.55) faceoff = 1
      else if (x >= 1.55 && x < 1.9) faceoff = 1 - seg(x, 1.55, 1.9)
      // a 점프 1.55~1.95 — 상대에게 폴짝 뛰어 부딪히면 연기가 가린다.
      const jp = x >= 1.55 && x < 1.95 ? seg(x, 1.55, 1.95) : 0
      const airborne = Math.sin(jp * Math.PI) // 점프 아치 0→1→0

      // 연기: 존재(cloud=불투명도) + 크기(grow). 점프·부딪힘 뒤에 등장.
      let cloud = 0
      if (x < 1.6) cloud = 0
      else if (x < 1.82) cloud = seg(x, 1.6, 1.82)
      else if (x < 2.6) cloud = 1
      else if (x < 3.05) cloud = 1 - seg(x, 2.6, 3.05)
      let grow = 0
      if (x < 1.62) grow = 0
      else if (x < 1.95) grow = seg(x, 1.62, 1.95)
      else grow = 1
      const cover = Math.min(grow, cloud)

      // 뒷수습(반창고). 끝나면 처음과 똑같은 위치·자세로 복귀(등 돌리지 않음).
      const hurt = x > 2.7

      // ── 위치: 발 바닥 고정. a 만 상대에게 폴짝 뛰어 부딪힘. ──
      a.root.position.set(-REST + faceoff * 0.12 + jp * 1.1, airborne * 0.9, 0)
      c.root.position.set(REST - faceoff * 0.12, 0, 0)
      shadowA.position.x = a.root.position.x
      shadowA.scale.setScalar(1 - airborne * 0.45) // 점프하면 그림자 작게

      // 몸통 방향: 마주보기 때 서로 더 마주 틀고, 점프 때 a 다이브. (끝엔 처음 자세 그대로)
      a.char.rotation.y = 0.5 + faceoff * 0.25
      c.char.rotation.y = -0.5 - faceoff * 0.25
      a.char.rotation.x = jp * 0.35 // 점프 다이브
      c.char.rotation.x = -jp * 0.1 // 살짝 움찔

      // ── 손: 회전 없이 위/아래 + 앞/뒤(펀치). 어깨가 세로 타원을 그려 치고받는 느낌. ──
      const thA = t * 17 // a 빠르게
      const swingA = flail * 0.5 * Math.sin(thA) // 위아래
      const punchA = flail * 0.5 * Math.cos(thA) // 앞뒤(+z 지르기)
      a.leftArm.position.y = ARM_Y + swingA + airborne * 0.5
      a.leftArm.position.z = punchA
      a.rightArm.position.y = ARM_Y - swingA + airborne * 0.5
      a.rightArm.position.z = -punchA // 두 팔 엇갈려 교대 펀치
      const thC = t * 12 + 0.9 // c 느리게·리듬 다르게
      const swingC = flail * 0.36 * Math.sin(thC)
      const punchC = flail * 0.44 * Math.cos(thC)
      c.leftArm.position.y = ARM_Y + swingC
      c.leftArm.position.z = punchC
      c.rightArm.position.y = ARM_Y + swingC // c 두 팔 같이
      c.rightArm.position.z = punchC
      a.leftArm.rotation.set(0, 0, 0)
      a.rightArm.rotation.set(0, 0, 0)
      c.leftArm.rotation.set(0, 0, 0)
      c.rightArm.rotation.set(0, 0, 0)

      // 대일밴드 + 눈(마주보기·점프 땐 부릅뜨고, 그 외엔 깜빡).
      aBand.visible = hurt
      cBand.visible = hurt
      const stare = faceoff > 0.3 || jp > 0
      a.blink(stare ? 1 : blinkOpen(t))
      c.blink(stare ? 1 : blinkOpen(t, 1.7))

      // 구름이 커져서(covered) 덮을 만큼이면 몸통·그림자 숨김. 걷힐 땐 opacity(cloud)로 되돌림.
      const covered = grow > 0.85 && cloud > 0.45
      a.root.visible = !covered
      c.root.visible = !covered
      shadowA.visible = !covered
      shadowC.visible = !covered

      // 먼지 poof — 손 휘젓는 동안 작게 피었다가(grow) 커져 덮는다. 넓고 낮은 형태로 과하지 않게.
      cloudGroup.scale.setScalar(0.3 + 0.8 * grow)
      puffs.forEach((sp, i) => {
        const d = puffDefs[i]
        const fl = 0.5 + 0.5 * Math.sin(t * 8 + d.sp)
        const wob = Math.sin(t * 5 + d.sp * 1.7)
        sp.scale.set(d.w * (0.9 + 0.16 * fl), d.h * (0.9 + 0.16 * fl), 1)
        sp.position.set(d.x + wob * 0.08, d.y + fl * 0.1, 0)
        const base = d.tex === dustCore ? 0.85 : 0.7
        sp.material.opacity = cloud * Math.min(1, base + 0.28 * fl)
      })

      // 삐죽 별 — 구름이 덮은 구간에만
      const spark = cover > 0.5 ? cover : 0
      stars.forEach((sp, i) => {
        const ang = (i / stars.length) * Math.PI * 2 + t * 2.2
        const r = 1.3 + Math.sin(t * 6 + i) * 0.15
        sp.position.set(Math.cos(ang) * r, 0.1 + Math.sin(ang) * r * 0.7, 2.0)
        sp.scale.setScalar(Math.max(spark * (0.45 + i * 0.05), 0.0001))
        sp.material.opacity = spark
      })
    },
  }
}
