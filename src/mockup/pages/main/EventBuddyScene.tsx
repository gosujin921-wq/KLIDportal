import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'
import type { EventTypeKey } from '@/mockup/domain/eventTypes'
import { createKit, type SceneContext, type Track } from './eventBuddy/core'
import { resolveScene } from './eventBuddy/registry'
import { SCROLL_TRIGGER_MARGIN } from '@/mockup/components/ui/scrollTrigger'

/**
 * 이벤트 카드 썸네일용 복셀 캐릭터 미니 장면(캔버스 호스트).
 *
 * 렌더러·씬·카메라·조명만 여기서 셋업하고, 유형별 연출은 eventBuddy/registry 가
 * 골라주는 장면 빌더(eventBuddy/scenes/*.ts)에 위임한다. 히어로와 같은 복셀 캐릭터 사용.
 *
 * 성능: 카드마다 독립 캔버스. IntersectionObserver 로 화면 밖이면 rAF 정지, DPR 상한.
 * 비상호작용(포인터 통과). 접근성: 동작 줄이기면 대표 정지 프레임 1장.
 */
export function EventBuddyScene({ event }: { event: EventTypeKey }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    mount.appendChild(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 1.3

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 9)
    camera.lookAt(0, -0.1, 0)

    // 조명
    scene.add(new THREE.HemisphereLight(0xeef2fb, 0xc2c8da, 1.4))
    const key = new THREE.DirectionalLight(0xffffff, 1.0)
    key.position.set(4, 6, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.7)
    fill.position.set(-6, 1, 4)
    scene.add(fill)

    // 리소스 추적
    const disposables: { dispose: () => void }[] = []
    const track: Track = (o) => {
      disposables.push(o)
      return o
    }

    // 공용 키트 + 유형별 장면
    const kit = createKit(scene, track)
    const ctx: SceneContext = { scene, camera, track, ...kit }
    const mod = resolveScene(event)(ctx)

    // 리사이즈
    function resize() {
      const w = mount!.clientWidth || 1
      const h = mount!.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // 애니메이트 — 2단계 트리거.
    //  ① 카드가 화면에 들어오면(가장자리) 정적 프레임을 그려 "캐릭터가 서 있는 모습"을 먼저 보여준다.
    //     (빈 카드로 있다가 튀어나오지 않게.)
    //  ② 카드가 뷰포트 중앙쯤 오면 그때 애니메이션을 0부터 재생(다른 come-alive 애니메이션과 통일).
    //     elapsed 는 재생 중에만 누적, 중앙 재진입마다 0으로 리셋해 처음부터.
    //  화면 밖이면 정지. 동작 줄이기면 정적 프레임만.
    let raf = 0
    let running = false
    let elapsed = 0
    let last = 0

    function frame(now: number) {
      if (!running) {
        raf = 0
        return
      }
      elapsed += (now - last) / 1000
      last = now
      mod.update(elapsed)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }

    function startLoop() {
      running = true
      elapsed = 0 // 중앙 진입마다 처음부터
      last = performance.now()
      if (!raf) raf = requestAnimationFrame(frame)
    }

    function paintStatic() {
      // 정적 대표 프레임(캐릭터가 서 있는 시작 자세). 재생 전/동작 줄이기 시 사용.
      mod.update(0)
      renderer.render(scene, camera)
    }

    // ① 가시성 — 화면에 조금이라도 들어오면(재생 전이면) 정적 프레임을 그려 보이게.
    const visIo = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) paintStatic()
    })
    visIo.observe(mount)

    // ② 중앙 트리거 — 뷰포트 중앙쯤 오면 재생 시작 / 화면 상단으로 벗어나면 정지.
    const startIo = new IntersectionObserver(
      ([e]) => {
        if (reduce) {
          if (e.isIntersecting) paintStatic()
          return
        }
        if (e.isIntersecting) startLoop()
        else running = false
      },
      { rootMargin: SCROLL_TRIGGER_MARGIN },
    )
    startIo.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      visIo.disconnect()
      startIo.disconnect()
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [event, reduce])

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />
}
