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
 * 유괴 — [스펙: 경계(추상)] literal 금지(공공 재난·안전 포털 톤).
 * 어두운 후드 인물이 뒤편 옆(back-left) 깊은 곳에서 커지며 다가오자, 캐릭터가 위험을
 * 감지해 그쪽으로 홱 돌아보며(char.rotation.y) 놀라 폴짝 뛰고 파르르 떤다. 머리 위 "!" 팝.
 * "위험 감지"로만 처리 — 붙잡거나 끌고가는 묘사는 넣지 않는다. 핑퐁 반복.
 *
 * 조형: 다가오는 인물은 평면 스프라이트가 아니라 실제 3D(원뿔 망토+구 머리+원뿔 후드).
 * 씬 조명으로 명암이 생겨 입체로 읽힌다. 캐릭터는 작게(CHAR_SCALE) 두어 인물이 위압적으로 크다.
 * 프레임 주의: 카드가 16:10(가로 넓고 세로 짧음)이라, 인물은 가로 여백 있는 왼쪽에서 등장.
 */
export function buildAbduction(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx

  const CHAR_SCALE = 0.82 // 캐릭터를 작게 — 다가오는 인물이 상대적으로 크게 위압.
  const GROUND = FEET_BOTTOM * CHAR_SCALE // 발바닥 높이(월드)

  const b = ctx.makeBuddy()
  b.root.scale.setScalar(CHAR_SCALE)
  scene.add(b.root)
  const shadow = ctx.makeShadow()
  shadow.position.y = GROUND + 0.02

  // 카메라 뒤로 — 세로 여백 + 카드 간 캐릭터 크기 통일(폭력·교통사고 기준 ≈ SCALE/Z ≈ 0.064).
  camera.position.set(0, 0, 12.75)
  camera.lookAt(0, -0.1, 0)

  // ── 다가오는 후드 인물. 옆선 프로파일을 회전(Lathe)해 만든 단일 3D 메시.
  //    둥근 후드 + 어깨 + 망토가 한 몸으로 나오고, 씬 조명으로 명암이 져 입체로 읽힌다.
  const figMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x363c5b,
      roughness: 0.9,
      metalness: 0,
      emissive: 0x0c0e1a,
      emissiveIntensity: 0.35,
      transparent: true,
    }),
  )
  // 프로파일: [반지름 r, 높이 y] 밑(망토)→위(후드 돔). 어깨 벌지·목 잘록·둥근 후드.
  const profile = (
    [
      [1.06, 0.0],
      [1.0, 0.32],
      [0.9, 0.78],
      [0.77, 1.22],
      [0.63, 1.6], // 어깨로
      [0.68, 1.8], // 어깨 벌지
      [0.5, 2.04], // 목 잘록
      [0.5, 2.2],
      [0.56, 2.44], // 후드 벌어짐
      [0.52, 2.68],
      [0.39, 2.88], // 후드 돔
      [0.21, 3.02],
      [0.0, 3.08], // 후드 정수리(둥글게)
    ] as const
  ).map(([r, y]) => new THREE.Vector2(r, y))
  const figure = new THREE.Mesh(track(new THREE.LatheGeometry(profile, 30)), figMat)
  figure.rotation.y = 0.3 // 조명 각도용 살짝 회전
  figure.visible = false
  scene.add(figure)

  // 인물 발밑 그림자 — 바닥에 붙여 3D 접지감.
  const figShadow = new THREE.Mesh(
    track(new THREE.PlaneGeometry(3.4, 1.8)),
    track(
      new THREE.MeshBasicMaterial({
        map: track(radialTex('rgba(16,18,30,0.6)', 'rgba(16,18,30,0)')),
        transparent: true,
        depthWrite: false,
      }),
    ),
  )
  figShadow.rotation.x = -Math.PI / 2
  figShadow.position.y = GROUND + 0.01
  scene.add(figShadow)

  // 머리 위 "!" (경고색) — falldown 마크 패턴 재활용. 경계 순간 팝.
  const bang = new THREE.Group()
  const barMat = plastic(PAL.warn)
  const bar = new THREE.Mesh(track(roundedBox(0.34, 0.9, 0.34, 0.16, 5)), barMat)
  bar.position.y = 0.3
  const dot = new THREE.Mesh(track(roundedBox(0.34, 0.34, 0.34, 0.16, 5)), barMat)
  dot.position.y = -0.42
  bang.add(bar, dot)
  bang.scale.setScalar(0.0001)
  scene.add(bang)

  const CYCLE = 5.2
  const seg = (x: number, s: number, e: number) => smoothstep((x - s) / (e - s))

  return {
    update(t) {
      const x = t % CYCLE

      // 인물 접근 봉투: 등장 → 유지 → 물러남
      const loom =
        x < 1.0
          ? 0
          : x < 2.2
            ? seg(x, 1.0, 2.2)
            : x < 3.6
              ? 1
              : x < 4.4
                ? 1 - seg(x, 3.6, 4.4)
                : 0

      // 경계 반응 봉투 — 인물이 반쯤 다가오면 홱 발동, 있는 동안 유지 → 해제.
      const alertUp = seg(x, 1.7, 2.0) // 0.3초 스냅
      const alertDown = seg(x, 3.7, 4.3)
      const alert = Math.max(alertUp - alertDown, 0) // 플래토 0..1
      const snap = Math.max(easeOutBack(alertUp) - alertDown, 0) // 뒤돌아봄에 오버슈트
      const calm = 1 - alert

      // 인식 순간(돌아본 직후 ≈2.0s)부터의 경과 — 놀람 비트 구동.
      const s = x - 2.0
      // 놀람 폴짝: 인식 직후 0.5초 동안 한 번 위로 튀었다 착지.
      const hop = s >= 0 && s < 0.5 ? Math.sin((s / 0.5) * Math.PI) : 0
      // 응시하며 파르르: 인식 직후 크게 → 이후 은은하게(완전히 멈추지 않음).
      const jitter = alert * (0.4 + 0.6 * Math.exp(-Math.max(s, 0) * 2.5))
      const quiver = Math.sin(t * 30) * jitter
      const k = CHAR_SCALE

      // 캐릭터: 대기 → 왼쪽(인물) 홱 돌아봄 → 놀라 폴짝 → 응시하며 파르르.
      b.root.position.y = (Math.sin(t * 1.5) * 0.06 * calm + 0.09 * alert + hop * 0.42) * k
      b.root.position.z = (0.28 * alert + hop * 0.15) * k // 흠칫 물러남 + 점프 반동
      // 인물이 다가오면(loom) 스멀스멀 오른쪽으로 비켜서고, 알아채면(alert) 확 물러남.
      // → 인물(좌)·캐릭터(우)로 카드 폭을 채워 왼쪽 쏠림 해소.
      b.root.position.x = loom * 0.45 + alert * 1.25 + quiver * 0.05 * k
      b.char.rotation.y = Math.sin(t * 0.8) * 0.12 * calm - 1.0 * snap + quiver * 0.03
      b.char.rotation.z = quiver * 0.06 // 몸 파르르
      b.pivot.rotation.x = 0.12 * alert + hop * 0.1 // 상체 흠칫 + 점프 시 젖힘

      const sway = Math.sin(t * 1.4) * 0.05 * calm
      b.leftArm.rotation.z = sway + 0.45 * alert
      b.rightArm.rotation.z = -sway - 0.45 * alert
      b.leftArm.rotation.x = -0.5 * alert - hop * 0.35 // 놀라 팔 번쩍
      b.rightArm.rotation.x = -0.5 * alert - hop * 0.35

      // 눈: 경계 중엔 크게 뜸(놀람), 아니면 자연 깜빡임
      b.blink(alert > 0.5 ? 1 : blinkOpen(t))

      // 후드 인물 접근(3D): 왼쪽 뒤 깊은 곳(z-)에서 안쪽·앞으로 커지며. 원근으로도 커짐.
      figure.visible = loom > 0.002
      const figScale = 1.12 + 0.36 * loom
      figMat.opacity = 0.95 * loom
      figure.scale.setScalar(figScale)
      figure.position.set(-3.8 + 0.8 * loom, GROUND, -3.0 + 1.55 * loom) // 더 왼쪽에서(캐릭터와 간격)
      figure.rotation.y = 0.32 + Math.sin(t * 1.1) * 0.05 // 미세한 흔들

      figShadow.material.opacity = 0.5 * loom
      figShadow.position.x = figure.position.x
      figShadow.position.z = figure.position.z
      figShadow.scale.setScalar(figScale)

      // 머리 위 "!" — 작아진 머리 옆(스케일 반영), 폴짝 정점에도 안 잘리게. 함께 튐.
      bang.scale.setScalar(Math.max(easeOutBack(alert) * (0.8 + hop * 0.2), 0.0001))
      bang.position.set(
        1.2 + b.root.position.x,
        1.5 + hop * 0.16 + Math.sin(t * 3) * 0.06 * alert,
        0.6,
      )

      // 발밑 그림자도 캐릭터 이동(x·z)을 따라감. 점프하면 작아짐.
      shadow.position.x = b.root.position.x
      shadow.position.z = b.root.position.z
      shadow.scale.setScalar(k * (1 - b.root.position.y * 0.4) * (1 + 0.15 * alert))
    },
  }
}
