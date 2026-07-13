import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

/**
 * 히어로 복셀 캐릭터 — 정자세(v1) ↔ 돋보기 탐색 포즈(v2) 모핑 루프.
 *
 * 한 사이클:
 *   ① 정자세 유지 (양팔 내림, 두 눈 뜸, 두 발 평평)
 *   ② 변신     : 왼팔 슬랩이 사라지고 돋보기 든 팔이 올라오며, 오른눈은 윙크,
 *                양발은 걷는 스트라이드로 전환
 *   ③ 탐색 포즈 유지 → 다시 정자세로 복귀 (핑퐁 반복)
 *
 * three(0.184) 기반. r128 프로토타입의 outputEncoding/sRGBEncoding API만 갱신.
 * 라이트 톤 + 브랜드 컬러(시안/블루/퍼플). 비상호작용(포인터 통과).
 */

// 레퍼런스(00.png) 픽셀 추출 색. 블루 3단계: 연한 / 중간 / 로열.
const PAL = {
  cyan: 0x9bdcef,
  blue: 0x436bfa, // 로열 블루(상단 돌출·우측팔·다리)
  blueLight: 0x728ffb, // 연한 페리윙클(2·4번) — 채도 올림
  blueMid: 0x5a82f0, // 중간 페리윙클(7번)
  blueViolet: 0x807ef5, // 블루-퍼플 사이(6번) — 붉은기(R) 낮춰 시원하게
  indigo: 0x5176fb, // 팔다리 로열 블루 — 명도 살짝 올림
  violet: 0x9790f2, // 바이올렛(8번) — 명도 유지 + 붉은기(R) 낮춰 시원하게
  lilac: 0xbf9afd,
  pink: 0xcca7fb, // 우상단 라일락(3번)
  skyblue: 0x76c3e2, // 스카이 시안(9번) — 1번 민트보다 진하고 파란 쪽
}

const smoothstep = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}

// 한 사이클의 5개 동작(초 단위). 각 동작 사이엔 기본형으로 복귀.
// 재생 순서: 검색 → 저작도구(라벨링) → 증강(공중부양) → 생성(빛큐브) → 안전(방패).
// (아래 [동작 N]은 포즈 식별 번호. 실제 재생 순서는 poses()의 시간 창으로 결정.)
//  [동작 1] 기본형    — 정면, 팔 내림, 접지.
//  [동작 2] 돋보기L   — 팔 올려 돋보기 들고 좌측 응시. (search 0→1→0)
//  [동작 3] 공중부양  — 팔은 기본형 그대로, 정면으로 떠올랐다 내려옴. (float 0→1→0)
//  [동작 4] 빛큐브    — 양손을 앞으로 들어 빛나는 큐브를 받침. (face 0→1→0)
//  [동작 5] 라벨링   — 양손으로 라벨링 보드를 들어 앞으로 내밂(바운딩 박스 저작). (dash 0→1→0)
//  [동작 6] 빼꼼      — 동작5에 이어 발 뒷꿈치 들고 몸 상승, 라벨링 보드 뒤로 눈만 빼꼼. (peek 0→1→0)
//  [동작 7] 안전아이콘 — 한 발 내딛고 반대 발 뒷꿈치 들며 방패. (shield=팔, shieldVis=방패 표시)
const CYCLE = 23.85
// 동작 사이클 재생 속도 배수. 1보다 크면 빠르게(전체 동작이 같은 비율로 단축).
const POSE_SPEED = 1.5
function poses(t: number) {
  const x = t % CYCLE
  const ramp = (a: number, b: number) => smoothstep((x - a) / (b - a))
  // 재생 순서: 검색 → 저작도구(라벨링) → 증강(공중부양) → 생성(빛큐브) → 안전(방패).
  // 동작 사이 기본자세 간격 ~0.35s. 각 동작의 진입·유지·복귀 길이는 유지.
  // 동작 2: 돋보기(좌측) 0.35~4.15  [검색]
  let search = 0
  if (x < 0.35) search = 0
  else if (x < 1.85) search = ramp(0.35, 1.85)
  else if (x < 3.35) search = 1
  else if (x < 4.15) search = 1 - ramp(3.35, 4.15) // 복귀 빠르게
  // 동작 5: 라벨링 보드 내밀기 4.5~11.3  [저작도구]
  let dash = 0
  if (x < 4.5) dash = 0
  else if (x < 6.0) dash = ramp(4.5, 6.0)
  else if (x < 10.5) dash = 1
  else dash = 1 - ramp(10.5, 11.3) // 복귀 빠르게
  // 동작 6: 빼꼼 — 라벨링 보드와 거의 동시에(살짝 늦게 시작) 같이 올라갔다 같이 내려옴
  let peek = 0
  if (x < 4.8) peek = 0
  else if (x < 6.3) peek = ramp(4.8, 6.3)
  else if (x < 10.5) peek = 1
  else peek = 1 - ramp(10.5, 11.3) // 복귀 빠르게
  // 동작 3: 공중부양 11.65~15.45  [증강]
  let float = 0
  if (x < 11.65) float = 0
  else if (x < 13.15) float = ramp(11.65, 13.15)
  else if (x < 14.65) float = 1
  else if (x < 15.45) float = 1 - ramp(14.65, 15.45) // 복귀 빠르게
  // 동작 4: 빛큐브 15.8~19.1  [생성]
  let face = 0
  if (x < 15.8) face = 0
  else if (x < 17.3) face = ramp(15.8, 17.3)
  else if (x < 18.3) face = 1
  else if (x < 19.1) face = 1 - ramp(18.3, 19.1) // 복귀 빠르게
  // 동작 7: shield=팔 들기, shieldVis=방패 표시. 19.45~23.85  [안전]
  //  나갈 때: 방패(shieldVis) 먼저 사라지고(22.25~22.95) → 그 다음 손(shield) 내려옴(22.95~23.85).
  let shield = 0
  if (x < 19.45) shield = 0
  else if (x < 20.95) shield = ramp(19.45, 20.95)
  else if (x < 22.95) shield = 1
  else shield = 1 - ramp(22.95, 23.85) // 복귀 빠르게
  let shieldVis = 0
  if (x < 19.95) shieldVis = 0
  else if (x < 20.95) shieldVis = ramp(19.95, 20.95)
  else if (x < 22.25) shieldVis = 1
  else if (x < 22.95) shieldVis = 1 - ramp(22.25, 22.95)
  return { search, float, face, dash, peek, shield, shieldVis }
}

// 캐릭터 동작 키 — 좌측 헤드라인 문구 동기화에 사용
export type HeroPoseKey = 'search' | 'float' | 'face' | 'dash' | 'shield'

// 단일 동작 정지(접근성: 동작 줄이기 시 대표 자세 유지). 해당 동작만 1, 나머지 0.
function lockPose(p: HeroPoseKey) {
  return {
    search: p === 'search' ? 1 : 0,
    float: p === 'float' ? 1 : 0,
    face: p === 'face' ? 1 : 0,
    dash: p === 'dash' ? 1 : 0,
    peek: 0,
    shield: p === 'shield' ? 1 : 0,
    shieldVis: p === 'shield' ? 1 : 0,
  }
}

// 카드용 단독 동작 루프: 지정 동작만 0→1(진입)→유지→복귀→휴지 를 반복 재생.
// 히어로 poses()가 동작 1~7을 순환하는 것과 달리, 한 동작의 전체 연기를 되풀이한다.
const SOLO_CYCLE = 4.6 // 한 동작 루프 길이(초)
// 세 카드가 동시에 같은 위상으로 움직이지 않도록 동작별 시작 위상 오프셋.
const SOLO_OFFSET: Record<HeroPoseKey, number> = {
  search: 0,
  dash: 1.6,
  float: 3.1,
  face: 2.3,
  shield: 4.0,
}
function soloPose(key: HeroPoseKey, t: number) {
  const x = (((t + SOLO_OFFSET[key]) % SOLO_CYCLE) + SOLO_CYCLE) % SOLO_CYCLE
  // 진입 0.9s → 유지 2.2s → 복귀 0.8s → 휴지 0.7s(기본자세)
  let v: number
  if (x < 0.9) v = smoothstep(x / 0.9)
  else if (x < 3.1) v = 1
  else if (x < 3.9) v = 1 - smoothstep((x - 3.1) / 0.8)
  else v = 0
  return {
    search: key === 'search' ? v : 0,
    float: key === 'float' ? v : 0,
    face: key === 'face' ? v : 0,
    dash: key === 'dash' ? v : 0,
    peek: 0,
    shield: key === 'shield' ? v : 0,
    shieldVis: key === 'shield' ? v : 0,
  }
}

export function HeroVoxelBuddy({
  onPose,
  pose,
  center = false,
  zoom = 1,
}: {
  onPose?: (key: HeroPoseKey) => void
  /** 지정 시 해당 동작으로 고정(사이클 루프 대신). 카드용. */
  pose?: HeroPoseKey
  /** true면 종횡비와 무관하게 중앙 배치(카드용). 기본은 히어로용 우측 배치. */
  center?: boolean
  /** >1이면 카메라를 당겨 캐릭터를 크게(카드용). 기본 1(히어로). */
  zoom?: number
} = {}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // onPose를 ref로 보관 → 무거운 씬 생성 useEffect가 onPose 변경에 재실행되지 않게
  const onPoseRef = useRef(onPose)
  onPoseRef.current = onPose
  const poseRef = useRef(pose)
  poseRef.current = pose
  const centerRef = useRef(center)
  centerRef.current = center
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ---------- Renderer ----------
    const canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    mount.appendChild(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // Neutral 톤맵: 채도 보존 + 하이라이트 부드럽게. (ACES는 채도를 뺌)
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.3

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    // zoom>1이면 카메라를 당겨 캐릭터를 크게(카드용). 기본 13.5(히어로).
    camera.position.set(0, 0.3, 13.5 / zoomRef.current)

    // ---------- Rounded box geometry ----------
    function roundedBox(w: number, h: number, d: number, r: number, seg = 10) {
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

    function plastic(color: number, _rough = 0.3) {
      const c = new THREE.Color(color)
      return new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.0,
        // 맑은 젤리 플라스틱: 또렷한(맑은) 코트 반사 + 얕은 안쪽 발광.
        // 투과(transmission)·흡수(attenuation)는 색 있는 몸통에서 색을 탁하게 뭉개므로 쓰지 않음.
        roughness: 0.28,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1, // 코트를 또렷하게 → 표면에 씌워진 듯한 뿌연 막 제거
        reflectivity: 0.5,
        emissive: c.clone().multiplyScalar(0.08),
      })
    }

    function roundedRectShape(w: number, h: number, r: number) {
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

    // 진짜 캡슐(스타디움): 직선 옆면 + 완전한 반원 캡(실제 원호 absarc). w=h면 완전한 원.
    function capsuleShape(w: number, h: number) {
      const r = w / 2
      const straight = Math.max(h / 2 - r, 0)
      const s = new THREE.Shape()
      s.moveTo(r, -straight)
      s.lineTo(r, straight)
      s.absarc(0, straight, r, 0, Math.PI, false) // 위쪽 반원
      s.lineTo(-r, -straight)
      s.absarc(0, -straight, r, Math.PI, Math.PI * 2, false) // 아래쪽 반원
      return s
    }

    // 방패 실루엣: 넓고 둥근 모서리의 상단(거의 평평) + 아래로 좁아져 둥근 뾰족 끝.
    function shieldShape(w: number, h: number) {
      const s = new THREE.Shape()
      const hw = w / 2
      const top = h * 0.5
      const bot = -h * 0.5
      const r = w * 0.2 // 상단 모서리 라운드
      s.moveTo(-hw + r, top)
      s.lineTo(hw - r, top) // 상단(평평)
      s.quadraticCurveTo(hw, top, hw, top - r) // 우상 모서리
      s.lineTo(hw, -h * 0.08) // 우측 변
      s.quadraticCurveTo(hw, bot + h * 0.16, 0, bot) // 우측 → 아래 뾰족 끝
      s.quadraticCurveTo(-hw, bot + h * 0.16, -hw, -h * 0.08) // 아래 → 좌측 변
      s.lineTo(-hw, top - r) // 좌측 변
      s.quadraticCurveTo(-hw, top, -hw + r, top) // 좌상 모서리
      return s
    }

    function roundedPath(pts: THREE.Vector2[], r: number) {
      const sh = new THREE.Shape()
      const n = pts.length
      for (let i = 0; i < n; i++) {
        const prev = pts[(i - 1 + n) % n],
          cur = pts[i],
          next = pts[(i + 1) % n]
        const d1x = cur.x - prev.x,
          d1y = cur.y - prev.y,
          l1 = Math.hypot(d1x, d1y)
        const d2x = next.x - cur.x,
          d2y = next.y - cur.y,
          l2 = Math.hypot(d2x, d2y)
        const rr = Math.min(r, l1 / 2, l2 / 2)
        const p1x = cur.x - (d1x / l1) * rr,
          p1y = cur.y - (d1y / l1) * rr
        const p2x = cur.x + (d2x / l2) * rr,
          p2y = cur.y + (d2y / l2) * rr
        if (i === 0) sh.moveTo(p1x, p1y)
        else sh.lineTo(p1x, p1y)
        sh.quadraticCurveTo(cur.x, cur.y, p2x, p2y)
      }
      sh.closePath()
      return sh
    }

    const disposables: { dispose: () => void }[] = []
    const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(o: T): T => {
      disposables.push(o)
      return o
    }
    // plastic() wrapper that tracks material for disposal
    const mat = (color: number) => track(plastic(color))

    // 얼굴 판 전용 화이트 — 조명 각도와 무관하게 항상 깨끗한 화이트로 보이도록 자체 발광을 실어 밝힘.
    // (plastic()의 색 있는 코트·발광을 태우면 회백색으로 떠서 "뭔가 씌워진" 느낌이 남음)
    const faceMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.42,
        clearcoat: 0.12,
        clearcoatRoughness: 0.28,
        emissive: 0xffffff,
        emissiveIntensity: 0.3,
      }),
    )

    const buddy = new THREE.Group()
    scene.add(buddy)
    buddy.scale.set(1, 0.94, 1)

    // ---------- Body 3x3x2 ----------
    const UNIT = 1.0
    const BLK = 1.16
    const BR = BLK * 0.15
    const cubeGeo = track(roundedBox(BLK, BLK, BLK, BR, 14))

    const XS = [-1, 0, 1]
    const YS = [-1, 0, 1]
    const ZS = [-0.5, 0.5]
    const M = PAL.cyan,
      BL = PAL.blueLight,
      P = PAL.violet,
      PK = PAL.pink,
      SKY = PAL.skyblue
    // 레퍼런스 격자(1~9) 그대로:
    //  1 시안     2 연한블루  3 라일락
    //  4 연한블루  5 시안     6 연한블루
    //  7 연한블루  8 바이올렛  9 스카이시안
    const GRID = [
      [M, BL, PK],
      [BL, M, BL],
      [BL, P, SKY],
    ]
    function cellColor(x: number, j: number, k: number) {
      const row = 1 - j
      let col = x + 1
      if (k < 0) col = 2 - col
      return GRID[row][col]
    }
    for (const i of XS)
      for (const j of YS)
        for (const k of ZS) {
          const m = new THREE.Mesh(cubeGeo, mat(cellColor(i, j, k)))
          m.position.set(i * UNIT, j * UNIT, k * UNIT)
          buddy.add(m)
        }

    // ---------- Limbs ----------
    const BODY = UNIT + BLK / 2
    const FULL = 1.12
    function slab(w: number, h: number, d: number, x: number, y: number, z: number, color = PAL.indigo) {
      const r = Math.min(w, h, d) * 0.22
      const m = new THREE.Mesh(track(roundedBox(w, h, d, r, 12)), mat(color))
      m.position.set(x, y, z)
      buddy.add(m)
      return m
    }

    // 머리 — 몸통 안으로 0.24 내려 끼워, 맞닿는 아랫면 둥근 엣지를 가림
    const HH = 0.82
    slab(FULL, HH, FULL, 0, BODY + HH / 2 - 0.24, 0)

    // 오른팔 — 기본은 옆에 정적. 동작4에서 오른쪽 위로 들어올림.
    const AW = 0.92
    const rightArm = slab(AW, FULL, FULL, BODY + AW / 2, 0, 0)
    const RARM_REST = new THREE.Vector3(BODY + AW / 2, 0, 0)
    const RARM_UP = new THREE.Vector3(1.35, 0.28, 1.45) // 동작4(빛큐브)
    const RARM_DASH = new THREE.Vector3(0.85, -0.85, 1.6) // 동작5 — 대시보드 뒤·안쪽(튀어나옴 방지)

    // 발 (정자세 ↔ 걷는 스트라이드 보간)
    const FW = 0.94,
      FH = 0.78,
      FD = 1.0
    const footL = slab(FW, FH, FD, -0.62, -(BODY + FH / 2), 0.2)
    const footR = slab(FW, FH, FD, 0.62, -(BODY + FH / 2), 0.2, PAL.indigo)

    // ---------- Face ----------
    const bodyFrontZ = 0.5 + BLK / 2
    const plateGeo = track(
      new THREE.ExtrudeGeometry(roundedRectShape(2.05, 2.05, 0.62), {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.035,
        bevelSegments: 4,
        curveSegments: 20,
      }),
    )
    plateGeo.center()
    plateGeo.computeVertexNormals()
    const PLATE_HALF = 0.065
    const plate = new THREE.Mesh(plateGeo, faceMat)
    plate.position.set(0, 0, bodyFrontZ + PLATE_HALF - 0.03)
    buddy.add(plate)
    const faceFront = bodyFrontZ + 2 * PLATE_HALF - 0.03

    const eyeMat = track(
      new THREE.MeshStandardMaterial({ color: 0x14151c, roughness: 0.25, metalness: 0.0 }),
    )
    // 눈: 폭 고정(0.32), 높이만 바꿔 캡슐↔원(반경=폭/2 유지). CSS border-radius와 동일 개념.
    // 스케일이 아니라 지오메트리를 재생성하므로 캡(반원)이 눌리지 않음.
    const EYE_W = 0.32
    const EYE_H = 0.58
    function makeEyeGeo(h: number) {
      const g = new THREE.ExtrudeGeometry(capsuleShape(EYE_W, h), {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
        curveSegments: 22,
      })
      g.center()
      g.computeVertexNormals()
      return g
    }
    let eyeGeo = makeEyeGeo(EYE_H)
    let currentEyeH = EYE_H

    // 왼눈 (항상 뜸)
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
    leftEye.position.set(-0.42, 0.0, faceFront - 0.015)
    buddy.add(leftEye)

    // 오른눈 — 탐색 포즈에서 자연스럽게 감기는 윙크(세로로 닫힘)
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
    rightEye.position.set(0.42, 0.0, faceFront - 0.015)
    buddy.add(rightEye)


    // ---------- 왼팔 — v1: 옆에 붙은 슬랩 / v2: 들어올려 돋보기 쥠. 두 자세를 보간 ----------
    const arm = new THREE.Group()

    // v1 왼팔 슬랩(= 정자세 손). 돋보기 등장 시 쥐는 손으로 스왑.
    // 왼팔은 로열 블루. 엣지는 다른 팔다리(0.22)와 통일.
    const armBlock = new THREE.Mesh(
      track(roundedBox(0.92, 1.12, 1.12, Math.min(0.92, 1.12) * 0.22, 12)),
      mat(PAL.indigo),
    )
    arm.add(armBlock)

    const glass = new THREE.Group()
    const frameMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x18191f,
        roughness: 0.3,
        metalness: 0.0,
        clearcoat: 0.85,
        clearcoatRoughness: 0.18,
      }),
    )
    glass.add(new THREE.Mesh(track(new THREE.TorusGeometry(0.56, 0.11, 22, 56)), frameMat))
    const lensMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xbfe0ff,
        roughness: 0.08,
        metalness: 0.0,
        transparent: true,
        opacity: 0.85,
        transmission: 0.2,
        thickness: 0.4,
        ior: 1.45,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      }),
    )
    glass.add(new THREE.Mesh(track(new THREE.CircleGeometry(0.53, 56)), lensMat))
    const glintMat = track(
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
    )
    const g1 = new THREE.Mesh(track(roundedBox(0.075, 0.34, 0.02, 0.037, 4)), glintMat)
    g1.position.set(-0.14, 0.08, 0.055)
    g1.rotation.z = -0.5
    glass.add(g1)
    const g2 = new THREE.Mesh(track(roundedBox(0.05, 0.14, 0.02, 0.025, 4)), glintMat)
    g2.position.set(0.02, -0.16, 0.055)
    g2.rotation.z = -0.5
    glass.add(g2)
    const handle = new THREE.Mesh(track(roundedBox(0.15, 0.6, 0.15, 0.065, 6)), frameMat)
    handle.position.set(0, -0.92, 0)
    glass.add(handle)
    // 손 앞쪽에 돋보기(렌즈 정면, 손잡이 아래로). 손잡이가 손 위로 보이도록 위로 올림
    glass.position.set(0, 1.25, 0.42)
    glass.scale.setScalar(0) // 처음엔 빈 손, 팔을 든 뒤 "뿅" 등장
    arm.add(glass)

    // ㄷ자 손
    const Wx = 0.42,
      Wz = 0.4,
      nW = 0.15,
      nD = 0.46
    const PTs = Wx - 0.28
    const PTl = Wx + 0.16
    const handPts = [
      new THREE.Vector2(-Wx, -Wz),
      new THREE.Vector2(PTl, -Wz),
      new THREE.Vector2(PTl, -nW),
      new THREE.Vector2(Wx - nD, -nW),
      new THREE.Vector2(Wx - nD, nW),
      new THREE.Vector2(PTs, nW),
      new THREE.Vector2(PTs, Wz),
      new THREE.Vector2(-Wx, Wz),
    ]
    const handGeo = track(
      new THREE.ExtrudeGeometry(roundedPath(handPts, 0.1), {
        depth: 0.84,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.06,
        bevelSegments: 4,
        curveSegments: 8,
      }),
    )
    handGeo.center()
    handGeo.computeVertexNormals()
    // 쥐는 손(ㄷ자) — 돋보기 등장 시 armBlock 대신 나타나 손잡이 끝을 쥠
    const gripHand = new THREE.Mesh(handGeo, mat(PAL.indigo))
    gripHand.rotation.x = -Math.PI / 2
    gripHand.position.set(0, 0, 0.42)
    gripHand.scale.setScalar(0)
    arm.add(gripHand)

    buddy.add(arm)

    // 왼팔 자세 보간: v1(옆에 붙은 슬랩) → v2(들어올려 앞으로).
    // x를 항상 몸 바깥(≤-1.7)으로 유지 → 이동 중에도 몸통과 안 겹침.
    // 3단계: REST(옆에 붙음) → MID(위로 들어올림) → EYE(우측으로 회전해 돋보기를 눈앞으로)
    const ARM_REST_POS = new THREE.Vector3(-2.04, 0, 0)
    const ARM_REST_ROT = new THREE.Euler(0, 0, 0)
    // MID: x를 rest와 동일(-2.04, 몸 바깥)으로 유지 → 들어올리는 동안 몸통 앞을 안 가로지름
    const ARM_MID_POS = new THREE.Vector3(-2.04, 0.45, 1.25)
    const ARM_MID_ROT = new THREE.Euler(-0.12, 0.1, 0.22)
    // EYE: 손을 우측으로 회전(z-)·앞으로 기울여(x+) 돋보기를 눈앞(앞쪽)으로. 모두 몸통 앞(z>front)
    const ARM_EYE_POS = new THREE.Vector3(-1.4, -0.3, 1.25)
    const ARM_EYE_ROT = new THREE.Euler(0.5, 0.0, -0.95)
    // 동작 4: 돋보기 없이 왼손을 앞·아래·안쪽으로(큐브 좌측을 받침). 오른손과 대칭.
    const ARM_FACE_POS = new THREE.Vector3(-1.35, 0.28, 1.45) // 동작4(빛큐브)
    const ARM_FACE_ROT = new THREE.Euler(0.2, 0.0, -0.2)
    const ARM_DASH_POS = new THREE.Vector3(-0.85, -0.85, 1.6) // 동작5 — 대시보드 뒤·안쪽(튀어나옴 방지)
    // 동작7: 왼손을 앞으로 내밀어 방패를 들어올림. 얼굴을 가리지 않게 좌측 바깥으로 빼서 두 눈 노출.
    const ARM_SHIELD_POS = new THREE.Vector3(-2.1, -0.1, 2.0) // 앞으로 내밀고 좌측으로 비켜 얼굴 노출
    const ARM_SHIELD_ROT = new THREE.Euler(0.1, 0.0, 0.15)
    const lerp = (a: number, b: number, m: number) => a + (b - a) * m
    // 오버슈트 이징(뿅): 0→1로 가며 살짝 넘쳤다가 안착
    const easeOutBack = (x: number) => {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
    }

    // ---------- 빛나는 투명 큐브(동작4: 양손 사이에 띄움) ----------
    const glowCube = new THREE.Mesh(
      track(roundedBox(0.85, 0.85, 0.85, 0.13, 8)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0xbdeaff,
          emissive: 0x6fd4ff,
          emissiveIntensity: 2.8,
          metalness: 0,
          roughness: 0.06,
          transmission: 0.9,
          thickness: 0.5,
          ior: 1.3,
          transparent: true,
          opacity: 0.92,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
        }),
      ),
    )
    glowCube.position.set(0, 0.35, 1.65) // 양손 사이, 앞쪽(동작4)
    glowCube.scale.setScalar(0.0001)
    buddy.add(glowCube)
    // 외곽 글로우 — 박스(모서리가 라인처럼 보임) 대신 부드러운 원형 스프라이트 헤일로
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 128
    {
      const gx = glowCanvas.getContext('2d')!
      const gg = gx.createRadialGradient(64, 64, 0, 64, 64, 64)
      gg.addColorStop(0, 'rgba(170,230,255,0.95)')
      gg.addColorStop(0.4, 'rgba(110,210,255,0.45)')
      gg.addColorStop(1, 'rgba(110,210,255,0)')
      gx.fillStyle = gg
      gx.fillRect(0, 0, 128, 128)
    }
    const glowTexture = track(new THREE.CanvasTexture(glowCanvas))
    const glowSprite = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x7ad6ff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    )
    glowSprite.scale.setScalar(2.7) // 큐브보다 크게 퍼지는 부드러운 빛무리
    glowCube.add(glowSprite)

    // ---------- 라벨링 보드(동작5: 양손으로 들어 앞으로 내밂 — 바운딩 박스 저작) ----------
    const dashboard = new THREE.Group()
    // 플랫 화면 판(밝은 블루, 발광) — 매트하게(광택 핫스팟 억제: 조명 번짐 방지)
    const screenPlate = new THREE.Mesh(
      track(roundedBox(2.1, 1.45, 0.12, 0.14, 8)),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x4f7be6,
          emissive: 0x2f5fd6,
          emissiveIntensity: 0.7,
          roughness: 0.55,
          metalness: 0,
          clearcoat: 0.25,
          clearcoatRoughness: 0.5,
        }),
      ),
    )
    dashboard.add(screenPlate)
    // 볼드 테두리 프레임 — 라운드 사각에 구멍을 뚫어 압출(진짜 액자형 테두리). 큐브와 같은 젤리 재질.
    const frameOuter = roundedRectShape(2.34, 1.69, 0.24)
    frameOuter.holes.push(roundedRectShape(2.0, 1.35, 0.16)) // 구멍 키워 테두리 폭 얇게
    const frameGeo = track(
      new THREE.ExtrudeGeometry(frameOuter, {
        depth: 0.28,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3,
        curveSegments: 16,
      }),
    )
    frameGeo.center()
    frameGeo.computeVertexNormals()
    const boldFrame = new THREE.Mesh(frameGeo, mat(0x2a3dd4))
    boldFrame.position.z = 0.05
    dashboard.add(boldFrame)
    // 라벨링 캔버스 — 화면 속 피사체에 바운딩 박스를 친 저작 메타포(ValueFlowSection 2D 캔버스와 동일 언어).
    const boxCX = 0,
      boxCY = -0.02 // 박스 중심(상단에 라벨 태그 공간 확보)
    // 박스 안 피사체 힌트 — 부드러운 시안 글로우(감지 대상 암시)
    const subjectGlow = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x8fe6ff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.5,
        }),
      ),
    )
    subjectGlow.scale.setScalar(0.52)
    subjectGlow.position.set(boxCX, boxCY, 0.1)
    dashboard.add(subjectGlow)
    // 바운딩 박스 — 라운드 사각에 구멍을 뚫어 압출한 얇은 시안 발광 아웃라인
    const bboxOuter = roundedRectShape(0.9, 0.62, 0.07)
    bboxOuter.holes.push(roundedRectShape(0.84, 0.56, 0.05)) // 테두리 폭 0.03 — 얇은 아웃라인
    const bboxGeo = track(
      new THREE.ExtrudeGeometry(bboxOuter, {
        depth: 0.035,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2,
        curveSegments: 12,
      }),
    )
    bboxGeo.center()
    bboxGeo.computeVertexNormals()
    const markMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xbdf3ff,
        emissive: 0x6fe0ff,
        emissiveIntensity: 1.7,
        roughness: 0.15,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    )
    const bbox = new THREE.Mesh(bboxGeo, markMat)
    bbox.position.set(boxCX, boxCY, 0.12)
    dashboard.add(bbox)
    // 코너 리사이즈 핸들 4개 — 박스 네 귀퉁이의 작은 흰 큐브(라벨링 도구 시그니처)
    const handleGeo = track(roundedBox(0.09, 0.09, 0.06, 0.025, 4))
    const handleMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xcfeeff,
        emissiveIntensity: 0.5,
        roughness: 0.15,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    )
    for (const [hx, hy] of [
      [-0.45, 0.31],
      [0.45, 0.31],
      [-0.45, -0.31],
      [0.45, -0.31],
    ]) {
      const h = new THREE.Mesh(handleGeo, handleMat)
      h.position.set(boxCX + hx, boxCY + hy, 0.14)
      dashboard.add(h)
    }
    // 라벨 태그 칩 — 박스 좌상단에 얹힌 흰 칩(브랜드 색점 + 텍스트 바)
    const chip = new THREE.Group()
    chip.add(new THREE.Mesh(track(roundedBox(0.44, 0.16, 0.05, 0.04, 4)), mat(0xfbfbfd)))
    const chipDot = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.035, 16, 16)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0x2f6bff,
          emissive: 0x2f6bff,
          emissiveIntensity: 0.4,
          roughness: 0.3,
        }),
      ),
    )
    chipDot.position.set(-0.13, 0, 0.05)
    chip.add(chipDot)
    const chipBar = new THREE.Mesh(track(roundedBox(0.19, 0.04, 0.025, 0.02, 3)), mat(0x8aa0c8))
    chipBar.position.set(0.045, 0, 0.05)
    chip.add(chipBar)
    chip.position.set(boxCX - 0.23, boxCY + 0.44, 0.15)
    dashboard.add(chip)
    dashboard.position.set(0, -0.4, 1.6)
    dashboard.scale.setScalar(0.0001)
    buddy.add(dashboard)

    // ---------- 안전 방패 아이콘(동작7: 위에 띄움) ----------
    const shieldGroup = new THREE.Group()
    const shieldExtrude = { depth: 0.18, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 20 }
    // 외곽(진한 블루)
    const shieldOuter = new THREE.Mesh(
      track(new THREE.ExtrudeGeometry(shieldShape(1.95, 2.3), shieldExtrude)),
      mat(0x3a52ee),
    )
    shieldGroup.add(shieldOuter)
    // 안쪽 면(밝은 블루, 살짝 발광)
    const shieldInner = new THREE.Mesh(
      track(new THREE.ExtrudeGeometry(shieldShape(1.52, 1.78), { ...shieldExtrude, depth: 0.16 })),
      track(
        new THREE.MeshPhysicalMaterial({
          color: 0x6f93f5,
          emissive: 0x3f63e0,
          emissiveIntensity: 0.4,
          roughness: 0.12,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
        }),
      ),
    )
    shieldInner.position.z = 0.06
    shieldGroup.add(shieldInner)
    // 체크마크(흰색, 글로시)
    const checkMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xdfe9ff,
        emissiveIntensity: 0.3,
        roughness: 0.15,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    )
    const checkPts = [
      new THREE.Vector3(-0.34, 0.04, 0),
      new THREE.Vector3(-0.08, -0.24, 0),
      new THREE.Vector3(0.42, 0.34, 0),
    ]
    const check = new THREE.Mesh(
      track(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(checkPts), 28, 0.085, 8, false)),
      checkMat,
    )
    // 방패 중앙 정렬(체크 바운딩박스 중심을 원점으로)
    check.position.set(-0.04, -0.05, 0.24)
    shieldGroup.add(check)
    // 왼손(arm 그룹)이 들도록 부모를 arm으로. 손을 가리며 앞쪽에 큼직하게.
    shieldGroup.position.set(0, 0.85, 0.5)
    shieldGroup.scale.setScalar(0.0001)
    arm.add(shieldGroup)

    // ---------- 공중부양(동작3): 작은 큐브 3개 부유, 1개엔 캐릭터와 같은 얼굴 ----------
    const floatCubes = new THREE.Group()
    // 얼굴 달린 미니 큐브 빌더 — 캐릭터 얼굴의 미니 버전(흰 판 + 눈 2개). 모든 치수는 큐브 크기(s)에 비례.
    // 흰 판은 큰 얼굴(plate)과 동일하게 ExtrudeGeometry로 "납작한" 라운드 사각.
    // (roundedBox는 r>depth/2면 면이 부풀어 평판이 안 됨 → 흰판이 작아지고 눈이 파란면에 얹힘)
    function makeFaceCube(color: number, s: number) {
      const cube = new THREE.Mesh(track(roundedBox(s, s, s, s * 0.17, 8)), mat(color))
      const panelGeo = track(
        new THREE.ExtrudeGeometry(roundedRectShape(s * 0.73, s * 0.73, s * 0.2), {
          depth: s * 0.12,
          bevelEnabled: true,
          bevelThickness: s * 0.03,
          bevelSize: s * 0.03,
          bevelSegments: 3,
          curveSegments: 16,
        }),
      )
      panelGeo.center()
      panelGeo.computeVertexNormals()
      const panel = new THREE.Mesh(panelGeo, faceMat)
      panel.position.z = s * 0.53 // 큐브 앞면(s/2) 위에 평평하게 얹힘
      cube.add(panel)
      const eGeo = track(
        new THREE.ExtrudeGeometry(capsuleShape(s * 0.13, s * 0.235), {
          depth: 0.04,
          bevelEnabled: true,
          bevelThickness: 0.015,
          bevelSize: 0.015,
          bevelSegments: 2,
          curveSegments: 12,
        }),
      )
      eGeo.center()
      eGeo.computeVertexNormals()
      for (const ex of [-s * 0.153, s * 0.153]) {
        const e = new THREE.Mesh(eGeo, eyeMat)
        e.position.set(ex, 0, s * 0.61) // 흰 판 앞면에 얹혀 살짝 돌출
        cube.add(e)
      }
      return cube
    }

    // 세 개 모두 얼굴 큐브. 크기 키우고 캐릭터 주변에 분산 배치.
    const faceCube = makeFaceCube(PAL.blue, 1.15)
    faceCube.position.set(2.15, 1.15, 0.5)
    const fcube2 = makeFaceCube(PAL.violet, 0.95)
    fcube2.position.set(-2.25, 1.75, 0.3)
    const fcube3 = makeFaceCube(PAL.cyan, 0.85)
    fcube3.position.set(1.05, 2.6, 0.2)
    floatCubes.add(faceCube, fcube2, fcube3)
    floatCubes.scale.setScalar(0.0001)
    buddy.add(floatCubes)

    // ---------- Shadow ----------
    function shadowTex() {
      const c = document.createElement('canvas')
      c.width = c.height = 256
      const x = c.getContext('2d')!
      const g = x.createRadialGradient(128, 128, 10, 128, 128, 128)
      g.addColorStop(0, 'rgba(60,60,90,0.5)')
      g.addColorStop(0.55, 'rgba(60,60,90,0.2)')
      g.addColorStop(1, 'rgba(60,60,90,0)')
      x.fillStyle = g
      x.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    }
    const shadowTexture = track(shadowTex())
    const shadow = new THREE.Mesh(
      track(new THREE.PlaneGeometry(8, 4.5)),
      track(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -2.2 // 발바닥 높이(접지)
    scene.add(shadow)

    // ---------- Lighting ----------
    // 어두운 옆면(그림자 면)을 들어올리기 위해 앰비언트(반구광)·필을 키움(키 라이트는 유지).
    scene.add(new THREE.HemisphereLight(0xeef2fb, 0xc2c8da, 1.4))
    const key = new THREE.DirectionalLight(0xffffff, 1.0)
    key.position.set(4, 6, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.75)
    fill.position.set(-6, 1, 4)
    scene.add(fill)

    // ---------- Resize ----------
    // 카메라 수직 FOV(35°) 절반의 탄젠트 — 캐릭터 월드 x를 화면 가로비율로 투영하는 데 사용.
    const halfFovTan = Math.tan(((35 * Math.PI) / 180) / 2)
    function resize() {
      const w = mount!.clientWidth || 1
      const h = mount!.clientHeight || 1
      renderer.setSize(w, h, false)
      const aspect = w / h
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      // 풀블리드: 데스크톱(가로형)에선 캐릭터를 우측으로 밀어 좌측 텍스트와 분리,
      // 모바일(세로형)에선 중앙 배치. center면 종횡비와 무관하게 항상 중앙.
      buddy.position.x = centerRef.current ? 0 : Math.min(Math.max((aspect - 1.1) * 2.4, 0), 3.6)
      // 그림자도 캐릭터 x를 따라가게(발밑 정렬)
      shadow.position.x = buddy.position.x
      // 배경 코발트 글로우를 캐릭터 화면 위치에 고정 — 폭이 바뀌어도 글로우가 캐릭터를 벗어나지 않게.
      // 캐릭터 월드 x를 z=0 평면 기준 화면 가로비율(0~1)로 투영해 섹션 CSS 변수(--hero-focal-x)로 전달.
      if (!centerRef.current) {
        const halfW = camera.position.z * halfFovTan * aspect
        const frac = 0.5 + 0.5 * (buddy.position.x / halfW)
        const section = mount!.closest('section') as HTMLElement | null
        section?.style.setProperty('--hero-focal-x', `${(frac * 100).toFixed(1)}%`)
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // ---------- Animate ----------
    const clock = new THREE.Clock()
    const _armTmpL = new THREE.Vector3()
    const _armTmpR = new THREE.Vector3()
    const FOOT_BASE_Y = -(BODY + FH / 2)
    let raf = 0
    let lastPoseKey: HeroPoseKey | '' = ''
    // 팔 동작(동작2·4 공용): raise 0→1로 REST→MID→목표(target) 보간.
    //  ① 0~0.6 : REST(옆) → MID(들어올림)  [x=-2.04 유지, 몸통과 안 겹침]
    //  ② 0.6~1 : MID → target(EYE=좌측눈앞 / FACE=얼굴앞중앙)  [전부 몸통 앞쪽]
    function applyArm(
      raise: number,
      targetPos: THREE.Vector3,
      targetRot: THREE.Euler,
      showGlass: boolean,
    ) {
      let fromPos: THREE.Vector3, toPos: THREE.Vector3, fromRot: THREE.Euler, toRot: THREE.Euler, seg: number
      if (raise < 0.6) {
        seg = raise / 0.6
        fromPos = ARM_REST_POS; toPos = ARM_MID_POS; fromRot = ARM_REST_ROT; toRot = ARM_MID_ROT
      } else {
        seg = (raise - 0.6) / 0.4
        fromPos = ARM_MID_POS; toPos = targetPos; fromRot = ARM_MID_ROT; toRot = targetRot
      }
      const segE = smoothstep(seg)
      arm.position.lerpVectors(fromPos, toPos, segE)
      arm.rotation.set(
        lerp(fromRot.x, toRot.x, segE),
        lerp(fromRot.y, toRot.y, segE),
        lerp(fromRot.z, toRot.z, segE),
      )
      // 돋보기: 동작2에서만 "뿅" 등장. 동작4(showGlass=false)에선 숨김.
      const gp = showGlass ? smoothstep((raise - 0.45) / 0.17) : 0
      glass.scale.setScalar(Math.max(easeOutBack(gp), 0.0001))
      armBlock.scale.setScalar(1)
      gripHand.scale.setScalar(0.0001)
    }

    function animate() {
      const t = clock.getElapsedTime()
      const locked = poseRef.current
      const { search, float, face, dash, peek, shield, shieldVis } = locked
        ? reduce
          ? lockPose(locked) // 접근성: 동작 줄이기 → 대표 자세 정지
          : soloPose(locked, t) // 카드: 해당 동작 전체를 반복 재생
        : reduce
          ? { search: 0, float: 0, face: 0, dash: 0, peek: 0, shield: 0, shieldVis: 0 }
          : poses(t * POSE_SPEED)

      // 현재 우세 동작을 좌측 헤드라인에 알림(임계값 넘는 동작 중 최댓값).
      // 동작 사이 휴지 구간에는 갱신하지 않고 직전 동작 문구를 유지(기본 문구 노출 X).
      // 고정 동작(카드)일 땐 헤드라인 동기화 불필요.
      if (!locked) {
        let key: HeroPoseKey | '' = ''
        let best = 0.55
        const cand: [HeroPoseKey, number][] = [
          ['search', search],
          ['float', float],
          ['face', face],
          ['dash', dash],
          ['shield', shield],
        ]
        for (const [k, v] of cand) if (v > best) { best = v; key = k }
        if (key && key !== lastPoseKey) {
          lastPoseKey = key
          onPoseRef.current?.(key)
        }
      }

      // 왼팔: 동작2(돋보기, 좌측) / 동작4(빛큐브, 위) / 동작5(대시보드, 더 아래). 하나만 활성.
      const hold = Math.max(face, dash)
      const isDash = dash >= face
      const peekDrop = peek * 0.6 // 동작6: 몸은 위로, 대시보드·손은 body-local에서 같은 만큼 아래로
      if (shield > 0) {
        applyArm(shield, ARM_SHIELD_POS, ARM_SHIELD_ROT, false) // 동작7: 왼손 내밀어 방패 듦
      } else if (search >= hold) {
        applyArm(search, ARM_EYE_POS, ARM_EYE_ROT, true) // 동작2: 돋보기 표시
      } else if (isDash) {
        _armTmpL.copy(ARM_DASH_POS)
        _armTmpL.y -= peekDrop
        applyArm(hold, _armTmpL, ARM_FACE_ROT, false)
      } else {
        applyArm(hold, ARM_FACE_POS, ARM_FACE_ROT, false)
      }
      // 오른팔: 동작4·5에서 앞·안쪽으로(왼손과 대칭). 동작5는 더 아래, 동작6에선 추가로 내림.
      if (isDash) {
        _armTmpR.copy(RARM_DASH)
        _armTmpR.y -= peekDrop
        rightArm.position.lerpVectors(RARM_REST, _armTmpR, hold)
      } else {
        rightArm.position.lerpVectors(RARM_REST, RARM_UP, hold)
      }
      rightArm.rotation.set(lerp(0, 0.2, hold), 0, lerp(0, 0.2, hold))
      // 동작3(공중부양): 팔을 몸통 중심(0,0,0) 기준으로 회전 → 위아래로 둥근 원호. (큐브 중심 스핀 X)
      if (float > 0.001) {
        const swing = float * Math.sin(t * 4) * 0.15
        const cs = Math.cos(swing),
          sn = Math.sin(swing)
        arm.position.set(-2.04 * cs, -2.04 * sn, 0) // 왼팔 rest(-2.04,0,0)를 몸통 중심으로 회전
        arm.rotation.z = swing
        rightArm.position.set(2.04 * cs, -2.04 * sn, 0) // 오른팔도 대칭으로 함께 위아래
        rightArm.rotation.z = -swing
      }

      // 공중부양(동작3): 작은 큐브 3개 부유. 얼굴 큐브는 정면 유지하며 끄덕, 나머지는 회전.
      floatCubes.scale.setScalar(Math.max(easeOutBack(float), 0.0001))
      // 세 큐브 모두 buddy 회전(faceCam)을 상쇄해 정면(카메라)을 보게 + 살짝 끄덕·갸웃·부유
      const faceY = Math.atan2(buddy.position.x, 13.5)
      faceCube.rotation.set(Math.sin(t * 0.9) * 0.07, faceY, Math.sin(t * 0.7) * 0.05)
      faceCube.position.y = 1.15 + Math.sin(t * 1.1) * 0.13
      fcube2.rotation.set(Math.sin(t * 1.0 + 1) * 0.08, faceY, Math.sin(t * 0.8 + 1) * 0.06)
      fcube2.position.y = 1.75 + Math.sin(t * 1.0 + 1) * 0.15
      fcube3.rotation.set(Math.sin(t * 1.2 + 2) * 0.07, faceY, Math.sin(t * 0.9 + 2) * 0.05)
      fcube3.position.y = 2.6 + Math.sin(t * 1.2 + 2) * 0.14

      // 빛나는 큐브: 동작4에서 등장, 천천히 회전하며 살짝 부유
      glowCube.scale.setScalar(Math.max(easeOutBack(face), 0.0001))
      glowCube.rotation.y = t * 0.6
      glowCube.rotation.x = -0.3 + Math.sin(t * 0.9) * 0.15
      glowCube.position.y = 0.35 + face * 0.22 + (reduce ? 0 : Math.sin(t * 1.4) * 0.05) // 살짝 위로

      // 대시보드: 동작5 등장·내밂. 동작6(빼꼼) 동안엔 body-local에서 내려(몸 상승분 상쇄) 화면상 고정.
      dashboard.scale.setScalar(Math.max(easeOutBack(dash), 0.0001))
      dashboard.position.z = lerp(1.6, 2.5, dash)
      dashboard.position.y = -0.4 - peekDrop + (reduce ? 0 : Math.sin(t * 1.3) * 0.04)
      dashboard.rotation.z = peek * 0.14 // 몸통 기울기(롤)를 상쇄해 대시보드는 수평 유지

      // 안전 방패(동작7): 표시는 shieldVis로(팔 내려오기 전에 먼저 사라짐)
      shieldGroup.scale.setScalar(Math.max(easeOutBack(shieldVis), 0.0001))

      // 눈: 동작3에서 높이를 폭(0.32)까지 줄여 캡슐→원. 지오메트리 재생성(스케일 X)이라 캡 안 눌림.
      const targetH = EYE_H - float * (EYE_H - EYE_W)
      if (Math.abs(targetH - currentEyeH) > 0.004) {
        const old = eyeGeo
        eyeGeo = makeEyeGeo(targetH)
        leftEye.geometry = eyeGeo
        rightEye.geometry = eyeGeo
        old.dispose()
        currentEyeH = targetH
      }
      // 동작2 오른눈 윙크는 세로 스케일로(슬릿)
      leftEye.scale.set(1, 1, 1)
      rightEye.scale.set(1, 1 - search * 0.86, 1)

      buddy.rotation.x = 0.05 - face * 0.18 // 동작4: 큐브 들며 몸통 살짝 뒤로 기울임
      // 몸통: 우측에 배치해도 정면으로 보이게 카메라를 향하도록 보정(원근 각 상쇄).
      //  돋보기(search)·대시보드(dash) 응시 중에는 faceCam을 그만큼 빼서(반대로) 정면 기준 좌측 응시.
      const faceCam = -Math.atan2(buddy.position.x, 13.5)
      buddy.rotation.y = faceCam * (1 - search - dash) - search * 0.5 - dash * 0.45
      // 동작6(빼꼼): 몸통을 우측으로 살짝 기울임(롤)
      buddy.rotation.z = -peek * 0.14

      // 동작 3(공중부양): float일 때 떠오름. 동작6(빼꼼): peek만큼 추가 상승.
      buddy.position.y = float * (0.42 + (reduce ? 0 : Math.sin(t * 1.2) * 0.13)) + peekDrop
      // 카드 동작: 유지·휴지 구간에도 미세한 숨쉬기(주 모션은 동작 재생).
      if (locked && !reduce) {
        buddy.position.y += Math.sin(t * 1.5) * 0.05
        buddy.rotation.y += Math.sin(t * 0.9) * 0.03
      }
      // 발: 몸통 롤(-peek*0.14)을 위치·회전에서 상쇄해 바닥에 평평하게 머묾(뚫림 방지).
      const za = peek * 0.14 // 빼꼼 롤 상쇄 각
      const cza = Math.cos(za),
        sza = Math.sin(za)
      // 동작4 몸통 뒤로 기울임(buddy.rotation.x -= face*0.18)을 발에서 상쇄 → 다리는 붙은 채 접지.
      const lb = face * 0.18
      const clb = Math.cos(lb),
        slb = Math.sin(lb)
      // 발은 몸에 붙임(부양해도 간격 X). 부양 시엔 뒷꿈치만 들기(까치발).
      const fy = FOOT_BASE_Y - peekDrop
      const fz = 0.2
      const yL = -0.62 * sza + fy * cza,
        zL = fz + shield * 0.9 + search * 0.5
      footL.position.set(-0.62 * cza - fy * sza, yL * clb - zL * slb, yL * slb + zL * clb)
      footL.rotation.x = peek * 0.7 + float * 0.7 + lb // +면 뒷꿈치(뒤쪽 면)가 들림
      footL.rotation.z = za
      const yR = 0.62 * sza + fy * cza,
        zR = fz - shield * 0.3
      footR.position.set(0.62 * cza - fy * sza, yR * clb - zR * slb, yR * slb + zR * clb)
      footR.rotation.x = peek * 0.7 + shield * 0.7 + float * 0.7 + lb
      footR.rotation.z = za

      shadow.scale.setScalar(1 - buddy.position.y * 0.6) // 들썩일수록 그림자 작게
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      disposables.forEach((d) => d.dispose())
      eyeGeo.dispose() // 동적 생성된 눈 지오메트리(track 미등록)
      renderer.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [reduce])

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />
  // 문구는 좌측 헤드라인이 동작별로 표시(HeroSectionV2). 기존 우측 말풍선 제거.
}
