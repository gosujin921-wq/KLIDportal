import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Environment, Lightformer } from '@react-three/drei'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

/**
 * 히어로 3D — "데이터를 모아서 증강한다" 자동재생 루프.
 *
 * 한 사이클(LOOP 초):
 *   ① 모으기  : 흩어진 반투명 글래스 판들이 한곳으로 모여 큐브로 적층된다.
 *               (얇은 판을 겹쳐 쌓으면 옆면에 리브 질감이 자동 발생 → frosted glass)
 *   ② 증강    : 완성된 큐브에서 클론 큐브들이 사방으로 퍼져나가며 증식한다.
 *               (원본 1건이 AI 증강으로 N배 확장되는 은유)
 *   ③ 리셋    : 클론이 사라지고 판이 다시 흩어지며 사이클 반복.
 *
 * 라이트 톤 + 코발트 단색 포인트. 텍스트 가독을 위해 오른쪽에 배치.
 */

const PLATES = 18 // 큐브를 이루는 글래스 판 수
const CLONES = 7 // 증강 시 퍼져나가는 클론 큐브 수
const LOOP = 9.0 // 한 사이클 길이(초)

const smooth = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}

const COBALT = new THREE.Color('#2f63f0')
const PALE = new THREE.Color('#d6e6ff')

interface Plate {
  scatter: THREE.Vector3
  scatterRot: THREE.Euler
  stackZ: number
  color: THREE.Color
}

interface Clone {
  dir: THREE.Vector3
  size: number
  birth: number // 증강 구간 내 등장 시점(0~1)
  color: THREE.Color
}

function useScene() {
  return useMemo(() => {
    const plates: Plate[] = Array.from({ length: PLATES }, (_, i) => {
      const f = i / (PLATES - 1) // 0=뒤(맑음) → 1=앞(코발트)
      return {
        scatter: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 7 - 1,
        ),
        scatterRot: new THREE.Euler(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.6,
        ),
        stackZ: (f - 0.5) * 1.0, // 촘촘히 적층 → 큐브 두께 ~1
        color: PALE.clone().lerp(COBALT, f * f),
      }
    })

    const clones: Clone[] = Array.from({ length: CLONES }, (_, i) => {
      const a = (i / CLONES) * Math.PI * 2 + 0.5
      const r = 2.6 + Math.random() * 1.2
      return {
        dir: new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 2.4, Math.sin(a) * r * 0.6),
        size: 0.34 + Math.random() * 0.2,
        birth: (i / CLONES) * 0.5,
        color: PALE.clone().lerp(COBALT, 0.5 + Math.random() * 0.4),
      }
    })

    return { plates, clones }
  }, [])
}

function glassMaterial(color: THREE.Color) {
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={0.92}
      thickness={0.6}
      roughness={0.18}
      ior={1.32}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.12}
      transparent
      envMapIntensity={1.4}
    />
  )
}

function Scene() {
  const reduce = useReducedMotion()
  const group = useRef<THREE.Group>(null!)
  const plateRefs = useRef<(THREE.Mesh | null)[]>([])
  const cloneRefs = useRef<(THREE.Mesh | null)[]>([])
  const { plates, clones } = useScene()

  // 사이클 구간(초) — 모으기 / 유지 / 증강 / 소멸
  const GATHER = [0.5, 3.5]
  const AUGMENT = [4.6, 7.2]
  const DISSOLVE = [7.2, 8.5]

  useFrame((state) => {
    const t = reduce ? 4.0 : state.clock.elapsedTime % LOOP

    // ── 모으기/소멸: 판의 흩어짐↔적층 보간 ──────────────────────────────
    let gather = 0 // 0=흩어짐, 1=적층
    if (t < GATHER[0]) gather = 0
    else if (t < GATHER[1]) gather = smooth((t - GATHER[0]) / (GATHER[1] - GATHER[0]))
    else if (t < DISSOLVE[0]) gather = 1
    else if (t < DISSOLVE[1]) gather = 1 - smooth((t - DISSOLVE[0]) / (DISSOLVE[1] - DISSOLVE[0]))
    else gather = 0

    plates.forEach((p, i) => {
      const m = plateRefs.current[i]
      if (!m) return
      m.position.set(
        THREE.MathUtils.lerp(p.scatter.x, 0, gather),
        THREE.MathUtils.lerp(p.scatter.y, 0, gather),
        THREE.MathUtils.lerp(p.scatter.z, p.stackZ, gather),
      )
      m.rotation.set(
        THREE.MathUtils.lerp(p.scatterRot.x, 0, gather),
        THREE.MathUtils.lerp(p.scatterRot.y, 0, gather),
        THREE.MathUtils.lerp(p.scatterRot.z, 0, gather),
      )
      const s = 0.45 + gather * 0.55
      m.scale.set(s, s, 1)
      const mat = m.material as THREE.MeshPhysicalMaterial
      mat.opacity = 0.35 + gather * 0.65
    })

    // ── 증강: 클론이 중심에서 사방으로 퍼지며 등장 ───────────────────────
    clones.forEach((c, i) => {
      const m = cloneRefs.current[i]
      if (!m) return
      let prog = 0
      if (t >= AUGMENT[0] && t < AUGMENT[1]) {
        const local = (t - AUGMENT[0]) / (AUGMENT[1] - AUGMENT[0])
        prog = smooth(Math.min(Math.max((local - c.birth) / (1 - c.birth), 0), 1))
      } else if (t >= AUGMENT[1] && t < DISSOLVE[1]) {
        prog = 1 // 증강 후 유지하다 소멸 구간에서 페이드
      }
      const fade = t >= DISSOLVE[0] ? 1 - smooth((t - DISSOLVE[0]) / (DISSOLVE[1] - DISSOLVE[0])) : 1
      m.position.copy(c.dir).multiplyScalar(prog)
      const s = prog * c.size
      m.scale.setScalar(s)
      const mat = m.material as THREE.MeshPhysicalMaterial
      mat.opacity = prog * fade * 0.9
      m.visible = prog > 0.001
    })

    // 전체 완만한 회전 + 미세 스웨이
    if (group.current) {
      group.current.rotation.y = 0.45 + (reduce ? 0 : state.clock.elapsedTime * 0.12)
      group.current.rotation.x = -0.28 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04
    }
  })

  return (
    <group ref={group} position={[2.7, 0.15, 0]} scale={1.15}>
      {/* 모으기: 적층 글래스 판 */}
      {plates.map((p, i) => (
        <RoundedBox
          key={`p${i}`}
          ref={(el) => {
            plateRefs.current[i] = el
          }}
          args={[1.5, 1.5, 0.05]}
          radius={0.06}
          smoothness={3}
        >
          {glassMaterial(p.color)}
        </RoundedBox>
      ))}
      {/* 증강: 퍼져나가는 클론 큐브 */}
      {clones.map((c, i) => (
        <RoundedBox
          key={`c${i}`}
          ref={(el) => {
            cloneRefs.current[i] = el
          }}
          args={[1, 1, 1]}
          radius={0.08}
          smoothness={3}
          visible={false}
        >
          {glassMaterial(c.color)}
        </RoundedBox>
      ))}
    </group>
  )
}

export function HeroDataFlow() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 12.5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 7, 6]} intensity={1.4} />
        <Scene />
        {/* 스튜디오 반사판 — 밝은 환경광으로 글래스 면을 밝은 블루로 */}
        <Environment resolution={512}>
          <Lightformer form="rect" intensity={8} position={[0, 7, 6]} scale={[20, 10, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={6} position={[0, 0, 10]} scale={[16, 12, 1]} color="#e3f0ff" />
          <Lightformer form="rect" intensity={4} position={[-10, 2, 4]} scale={[8, 13, 1]} color="#d6e8ff" />
          <Lightformer form="rect" intensity={5} position={[10, -1, 4]} scale={[8, 13, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={3} position={[0, -7, -4]} scale={[16, 8, 1]} color="#bcd6ff" />
        </Environment>
      </Canvas>
    </div>
  )
}
