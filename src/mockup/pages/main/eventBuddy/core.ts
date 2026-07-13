import * as THREE from 'three'

/**
 * 이벤트 카드 캐릭터 장면 — 공용 코어.
 *
 * 히어로(HeroVoxelBuddy)와 "같은 캐릭터"를 쓰기 위한 조형 프리미티브·팔레트·치수와,
 * 캔버스마다 1회 생성하는 캐릭터 팩토리(makeBuddy)·그림자·재질을 제공한다.
 *
 * 유형별 장면은 scenes/*.ts 에서 각자 구현하고(다른 세션에서 독립 작업 가능),
 * registry.ts 가 EventTypeKey → 장면 빌더로 묶는다.
 *
 * 규칙:
 *  - 순수 헬퍼(roundedBox·radialTex·smoothstep 등)와 상수(PAL·치수)는 여기서 import.
 *  - 상태 있는 것(scene·재질·makeBuddy·makeShadow)은 SceneContext 로 주입받는다.
 *  - 새 지오메트리/텍스처는 ctx.track(...) 로 감싸 dispose 누수를 막는다.
 */

// ---------- 히어로와 동일한 팔레트(레퍼런스 픽셀 추출 색) ----------
export const PAL = {
  cyan: 0x9bdcef,
  blue: 0x436bfa,
  blueLight: 0x728ffb,
  indigo: 0x5176fb,
  violet: 0x9790f2,
  pink: 0xcca7fb,
  skyblue: 0x76c3e2,
  warn: 0xf59e0b,
}

// ---------- 히어로와 동일한 몸통 치수 ----------
export const UNIT = 1.0
export const BLK = 1.16
export const BR = BLK * 0.15
export const BODY = UNIT + BLK / 2 // 1.58
export const HH = 0.82 // 머리 높이
export const FULL = 1.12 // 머리·팔 폭
export const AW = 0.92 // 팔 폭
export const FW = 0.94,
  FH = 0.78,
  FD = 1.0 // 발
export const YSCALE = 0.94 // 히어로 buddy.scale.set(1,0.94,1)
export const FOOT_Y = -(BODY + FH / 2) // -1.97
export const FEET_BOTTOM = (FOOT_Y - FH / 2) * YSCALE // 발바닥(스케일 반영)
export const FACE_FRONT = 0.5 + BLK / 2 + 0.13 - 0.03 // 얼굴판 앞면 z (밴드·소품 부착용)

// ---------- 순수 이징 ----------
export const smoothstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}
export const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// ---------- 순수 지오메트리 헬퍼(호출마다 새 지오메트리 반환 → ctx.track 로 감쌀 것) ----------
export function roundedBox(w: number, h: number, d: number, r: number, seg = 8) {
  const geo = new THREE.BoxGeometry(w, h, d, seg, seg, seg)
  const pos = geo.attributes.position
  const hw = w / 2 - r,
    hh = h / 2 - r,
    hd = d / 2 - r
  const v = new THREE.Vector3(),
    inner = new THREE.Vector3(),
    dir = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    inner.set(
      Math.max(-hw, Math.min(hw, v.x)),
      Math.max(-hh, Math.min(hh, v.y)),
      Math.max(-hd, Math.min(hd, v.z)),
    )
    dir.copy(v).sub(inner)
    if (dir.lengthSq() > 1e-8) {
      dir.normalize().multiplyScalar(r)
      v.copy(inner).add(dir)
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

export function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2,
    y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

// 스타디움(캡슐) 실루엣 — 눈 등
export function capsuleShape(w: number, h: number) {
  const r = w / 2
  const straight = Math.max(h / 2 - r, 0)
  const s = new THREE.Shape()
  s.moveTo(r, -straight)
  s.lineTo(r, straight)
  s.absarc(0, straight, r, 0, Math.PI, false)
  s.lineTo(-r, -straight)
  s.absarc(0, -straight, r, Math.PI, Math.PI * 2, false)
  return s
}

// 부드러운 원형 그라디언트 텍스처(그림자·먼지·별·불꽃·물방울 공용)
export function radialTex(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const x = c.getContext('2d')!
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, inner)
  g.addColorStop(0.55, inner)
  g.addColorStop(1, outer)
  x.fillStyle = g
  x.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

// 주기적 깜빡임(눈 세로 스케일: 1 뜸, 0 감음)
export function blinkOpen(t: number, phase = 0) {
  const x = (t + phase) % 3.4
  if (x > 3.1 && x < 3.28) return 1 - smoothstep(Math.abs(x - 3.19) / 0.09) * 0.9
  return 1
}

// ---------- 캐릭터 핸들 ----------
export interface Buddy {
  root: THREE.Group // 전체(이동·호흡)
  pivot: THREE.Group // 발끝 기준 회전(쓰러짐 등)
  char: THREE.Group // 캐릭터 본체(몸통 방향 회전)
  leftArm: THREE.Group
  rightArm: THREE.Group
  setKO: (ko: boolean) => void // 눈 정상 ↔ ×
  blink: (open: number) => void // 눈 세로 스케일
}

// ---------- 장면 계약 ----------
export type Track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(o: T) => T

export interface SceneContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  track: Track
  plastic: (color: number) => THREE.MeshPhysicalMaterial
  faceMat: THREE.MeshPhysicalMaterial
  eyeMat: THREE.MeshStandardMaterial
  makeBuddy: () => Buddy
  makeShadow: (sx?: number) => THREE.Mesh
}

export interface SceneModule {
  /** 매 프레임 호출(t = 경과 초) */
  update: (t: number) => void
}

export type SceneBuilder = (ctx: SceneContext) => SceneModule

// ---------- 몸통 컬러 그리드(히어로 동일) ----------
const GRID = [
  [PAL.cyan, PAL.blueLight, PAL.pink],
  [PAL.blueLight, PAL.cyan, PAL.blueLight],
  [PAL.blueLight, PAL.violet, PAL.skyblue],
]
function cellColor(x: number, j: number, k: number) {
  const row = 1 - j
  let col = x + 1
  if (k < 0) col = 2 - col
  return GRID[row][col]
}

/**
 * 캔버스마다 1회 호출 — 공유 재질·지오메트리와 makeBuddy·makeShadow 를 만든다.
 * 반환값을 SceneContext 에 펼쳐 담아 각 장면 빌더에 넘긴다.
 */
export function createKit(scene: THREE.Scene, track: Track) {
  function plastic(color: number) {
    return track(
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0,
        roughness: 0.28,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        reflectivity: 0.5,
        emissive: new THREE.Color(color).multiplyScalar(0.08),
      }),
    )
  }
  const faceMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.42,
      clearcoat: 0.12,
      clearcoatRoughness: 0.28,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
    }),
  )
  const eyeMat = track(
    new THREE.MeshStandardMaterial({ color: 0x14151c, roughness: 0.25, metalness: 0 }),
  )

  // 공유 지오메트리
  const cubeGeo = track(roundedBox(BLK, BLK, BLK, BR, 10))
  const headGeo = track(roundedBox(FULL, HH, FULL, Math.min(FULL, HH) * 0.22, 8))
  const armGeo = track(roundedBox(AW, FULL, FULL, Math.min(AW, FULL) * 0.22, 8))
  const footGeo = track(roundedBox(FW, FH, FD, Math.min(FW, FH) * 0.22, 8))
  const plateGeo = track(
    new THREE.ExtrudeGeometry(roundedRectShape(2.05, 2.05, 0.62), {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 3,
      curveSegments: 16,
    }),
  )
  plateGeo.center()
  plateGeo.computeVertexNormals()
  const eyeGeo = track(
    new THREE.ExtrudeGeometry(capsuleShape(0.32, 0.58), {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 18,
    }),
  )
  eyeGeo.center()
  eyeGeo.computeVertexNormals()
  const crossGeo = track(roundedBox(0.12, 0.6, 0.06, 0.05, 3))

  function makeBuddy(): Buddy {
    const root = new THREE.Group()
    const pivot = new THREE.Group()
    pivot.position.y = FEET_BOTTOM // 발끝(바닥)에서 회전
    root.add(pivot)
    const char = new THREE.Group()
    char.position.y = -FEET_BOTTOM // 발이 바닥에 닿게 세움
    char.scale.set(1, YSCALE, 1)
    pivot.add(char)

    // 몸통 3×3×2 컬러 복셀
    for (const i of [-1, 0, 1])
      for (const j of [-1, 0, 1])
        for (const k of [-0.5, 0.5]) {
          const m = new THREE.Mesh(cubeGeo, plastic(cellColor(i, j, k)))
          m.position.set(i * UNIT, j * UNIT, k * UNIT)
          char.add(m)
        }

    // 머리 슬랩(몸통 안으로 0.24 끼움)
    const head = new THREE.Mesh(headGeo, plastic(PAL.indigo))
    head.position.set(0, BODY + HH / 2 - 0.24, 0)
    char.add(head)

    // 얼굴판 + 눈
    const bodyFrontZ = 0.5 + BLK / 2 // 1.08
    const plate = new THREE.Mesh(plateGeo, faceMat)
    plate.position.set(0, 0, bodyFrontZ + 0.065 - 0.03)
    char.add(plate)
    const faceFront = bodyFrontZ + 0.13 - 0.03
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
    leftEye.position.set(-0.42, 0, faceFront - 0.015)
    char.add(leftEye)
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
    rightEye.position.set(0.42, 0, faceFront - 0.015)
    char.add(rightEye)

    // × 눈(기절) — 기본 숨김
    function makeCross(x: number) {
      const g = new THREE.Group()
      const a = new THREE.Mesh(crossGeo, eyeMat)
      a.rotation.z = Math.PI / 4
      const b = new THREE.Mesh(crossGeo, eyeMat)
      b.rotation.z = -Math.PI / 4
      g.add(a, b)
      g.position.set(x, 0, faceFront - 0.015)
      g.visible = false
      return g
    }
    const koL = makeCross(-0.42)
    const koR = makeCross(0.42)
    char.add(koL, koR)

    // 팔(어깨 피벗 그룹) — 회전으로 흔듦. 정지 시 히어로와 같은 위치(y 중앙).
    function makeArm(side: number) {
      const g = new THREE.Group()
      const m = new THREE.Mesh(armGeo, plastic(PAL.indigo))
      m.position.y = -FULL / 2
      g.add(m)
      g.position.set(side * (BODY + AW / 2), FULL / 2, 0)
      char.add(g)
      return g
    }
    const leftArm = makeArm(-1)
    const rightArm = makeArm(1)

    // 발
    const footL = new THREE.Mesh(footGeo, plastic(PAL.indigo))
    footL.position.set(-0.62, FOOT_Y, 0.2)
    char.add(footL)
    const footR = new THREE.Mesh(footGeo, plastic(PAL.indigo))
    footR.position.set(0.62, FOOT_Y, 0.2)
    char.add(footR)

    return {
      root,
      pivot,
      char,
      leftArm,
      rightArm,
      setKO(ko: boolean) {
        leftEye.visible = !ko
        rightEye.visible = !ko
        koL.visible = ko
        koR.visible = ko
      },
      blink(open: number) {
        leftEye.scale.y = open
        rightEye.scale.y = open
      },
    }
  }

  const shadowTex = track(radialTex('rgba(60,60,90,0.42)', 'rgba(60,60,90,0)'))
  function makeShadow(sx = 1) {
    const s = new THREE.Mesh(
      track(new THREE.PlaneGeometry(6 * sx, 3.2)),
      track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })),
    )
    s.rotation.x = -Math.PI / 2
    s.position.y = FEET_BOTTOM + 0.02
    scene.add(s)
    return s
  }

  return { plastic, faceMat, eyeMat, makeBuddy, makeShadow }
}
