import * as THREE from 'three'
import {
  FEET_BOTTOM,
  YSCALE,
  blinkOpen,
  easeOutBack,
  radialTex,
  roundedBox,
  smoothstep,
  type SceneContext,
  type SceneModule,
} from '../core'

/**
 * 교통사고 — 작은 복셀 자동차가 옆(오른쪽)에서 쓱 들어와 캐릭터와 만화적으로 살짝 쿵,
 * 캐릭터가 붕 떴다가 별(💫) 뿅 → 복귀. 반복.
 *
 * 겹침(클리핑)은 순간적으로만: 자동차를 캐릭터보다 앞(z+)에 두어 접촉을 가리고,
 * 그 순간 먼지 퍼프로 덮으며 캐릭터는 즉시 위로 이탈시킨다. 자동차는 톡 치고 바로 후진 퇴장.
 */
export function buildTraffic(ctx: SceneContext): SceneModule {
  const { scene, camera, track, plastic } = ctx
  const S = 0.74 // 캐릭터·자동차 공통 축소(카드에 둘 다 담기)
  const GROUND = FEET_BOTTOM * S + 0.02 // 발바닥·바퀴가 닿는 바닥 y
  const HEAD_Y = S * 2.26 // root 기준 머리 꼭대기 높이(별 궤도 기준)
  const REST_X = -0.7 // 캐릭터 정위치
  const START_X = 6.8 // 자동차 대기(화면 밖 오른쪽)
  const CONTACT_X = 1.05 // 톡 닿는 순간의 차 중심 x(앞코가 캐릭터 몸통 안까지 들이받게)

  const b = ctx.makeBuddy()
  b.root.scale.setScalar(S)
  b.root.position.set(REST_X, 0, 0)
  scene.add(b.root)
  const shadow = ctx.makeShadow(S)
  shadow.position.set(REST_X, GROUND, 0)

  camera.position.set(0.2, -0.15, 11.5)
  camera.lookAt(0, -0.3, 0)

  // ---------- 복셀 자동차(차체+캐빈+바퀴+헤드라이트) ----------
  // 로컬 원점 = 바퀴 바닥(y=0). 진행 방향은 -x(왼쪽), 그쪽이 앞면.
  const car = new THREE.Group()
  const bodyGeo = track(roundedBox(2.5, 0.8, 1.3, 0.3, 5))
  const cabinGeo = track(roundedBox(1.3, 0.62, 1.14, 0.26, 5))
  const wheelGeo = track(roundedBox(0.52, 0.52, 0.44, 0.2, 4))
  const lampGeo = track(roundedBox(0.16, 0.22, 0.14, 0.06, 3))

  const body = new THREE.Mesh(bodyGeo, plastic(0x0d9488)) // 교통 유형색
  body.position.y = 0.72
  const cabin = new THREE.Mesh(cabinGeo, plastic(0x14b8a6)) // 밝은 테일
  cabin.position.set(0.12, 1.28, 0) // 뒤쪽으로 살짝
  car.add(body, cabin)

  const wheelMat = plastic(0x262b3a)
  for (const wx of [-0.78, 0.78])
    for (const wz of [-0.5, 0.5]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat)
      w.position.set(wx, 0.26, wz)
      car.add(w)
    }
  const lampMat = plastic(0xffe9a8) // 헤드라이트(앞면 -x)
  for (const lz of [-0.42, 0.42]) {
    const l = new THREE.Mesh(lampGeo, lampMat)
    l.position.set(-1.26, 0.72, lz)
    car.add(l)
  }
  car.scale.setScalar(S)
  car.position.set(START_X, GROUND, 0.3) // 캐릭터보다 앞(z+)에서 지나가 접촉 은폐
  scene.add(car)
  const carShadow = ctx.makeShadow(S * 0.85)
  carShadow.position.set(START_X, GROUND, 0.05)

  // ---------- 충돌 별(💫) — violence 의 starTex 패턴 ----------
  const starTex = track(radialTex('rgba(255,224,130,0.95)', 'rgba(245,158,11,0)'))
  const stars = Array.from({ length: 5 }, () => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: starTex, transparent: true, depthWrite: false })),
    )
    sp.scale.setScalar(0.0001)
    scene.add(sp)
    return sp
  })

  // ---------- 접촉 먼지 퍼프(쿵 순간만) ----------
  const puffTex = track(radialTex('rgba(236,240,247,0.94)', 'rgba(202,209,224,0)'))
  const puffBase: [number, number][] = [
    [0, 0.05],
    [0.34, 0.24],
    [-0.32, 0.2],
    [0.12, -0.16],
  ]
  const puffs = puffBase.map(([px, py]) => {
    const sp = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false })),
    )
    sp.position.set(0.3 + px, GROUND + 0.7 + py, 0.5)
    sp.scale.setScalar(0.0001)
    scene.add(sp)
    return sp
  })

  const CYCLE = 3.3
  const IMPACT = 1.0 // 자동차가 톡 닿는 순간
  const SQUASH_END = 1.1 // 압축 텐션 끝(살짝 버틴 뒤 곧바로 스프링 방출)
  const LAUNCH_TOP = 1.28 // 붕 튕겨 오른 정점
  const FALL_START = 1.48 // 체공 끝, 낙하 시작
  const LAND = 2.05 // 착지
  const RECOVER_END = 2.6 // 착지 후 부르르 정신 차리는 회복 비트 끝
  const seg = (x: number, s: number, e: number) => smoothstep((x - s) / (e - s))

  return {
    update(t) {
      const x = t % CYCLE

      // 충돌 텐션(스쿼시&스트레치): 차에 눌려 납작 압축→버팀→스프링처럼 늘어나며 솟구침→낙하.
      // 공중(hop) 구간은 반드시 [IMPACT, LAND] 안에서만. (그 밖에서는 hop=0, 지상)
      let hop = 0
      let squash = 0 // +면 압축(납작), −면 신장(길쭉)
      if (x >= IMPACT && x < LAND) {
        if (x < SQUASH_END) {
          squash = smoothstep(seg(x, IMPACT, IMPACT + 0.07)) // 빠르게 눌린 뒤 잠깐 버팀(텐션)
        } else if (x < LAUNCH_TOP) {
          const s = seg(x, SQUASH_END, LAUNCH_TOP)
          hop = easeOutBack(s) // 스프링 방출 → 솟구침
          squash = -0.55 * (1 - s) // 압축 풀리며 길쭉(스트레치)하게 늘어남
        } else if (x < FALL_START) hop = 1 // 체공
        else hop = 1 - seg(x, FALL_START, LAND) ** 2 // 중력 낙하(가속)
      }
      const lift = hop * 0.95 // 부양 높이(프레임 헤드룸에 맞춤)

      // 브레이스(다가올 때 힐끗) → 공중에서도 조금 유지
      const glance =
        x < IMPACT ? seg(x, 0.5, IMPACT) : x < LAND ? 1 - seg(x, IMPACT, LAND) * 0.5 : 0

      // 착지 후 부르르 정신 차림(회복). 1→0 감쇠.
      const recover = x > LAND && x < RECOVER_END ? 1 - seg(x, LAND, RECOVER_END) : 0

      // 캐릭터: 부양 + 살짝 뒤로 밀림 + 기울임/버둥. 압축 땐 주저앉으며 뒤로 밀리고 기욺.
      const press = Math.max(squash, 0) // 압축(양수)만
      b.root.position.x = REST_X - hop * 0.3 - press * 0.14
      b.root.position.y = lift - press * 0.18 + Math.sin(t * 1.6) * 0.05 * (1 - hop) * (1 - press)
      b.char.rotation.z =
        hop * 0.5 + press * 0.12 + Math.sin(t * 13) * 0.12 * hop + Math.sin(t * 22) * 0.11 * recover
      b.char.rotation.x = -hop * 0.22 - press * 0.1
      b.char.rotation.y = -0.34 * glance + Math.sin(t * 0.8) * 0.07 * (1 - glance) * (1 - hop)

      // 스쿼시&스트레치: 충돌 압축/신장(squash) + 착지 압축(land)을 합쳐 한 번에 적용
      const land = x > LAND && x < LAND + 0.3 ? Math.sin(seg(x, LAND, LAND + 0.3) * Math.PI) : 0
      const deform = squash + land
      b.char.scale.set(1 + deform * 0.2, YSCALE * (1 - deform * 0.22), 1 + deform * 0.2)

      // 팔: 솟구칠 때 위로 버둥, 평시 잔잔
      const sway = Math.sin(t * 1.4) * 0.05 * (1 - hop)
      const flail = Math.sin(t * 15) * 0.3 * hop
      b.leftArm.rotation.z = sway + hop * 1.3
      b.rightArm.rotation.z = -sway - hop * 1.3
      b.leftArm.rotation.x = -hop * 0.7 + flail
      b.rightArm.rotation.x = -hop * 0.7 - flail

      // 눈: 정점·착지 직후 어질(×), 정신 차리면 깜빡임
      const dazed = hop > 0.5 || recover > 0.6
      b.setKO(dazed)
      if (!dazed) b.blink(blinkOpen(t))

      // 자동차: 들이받아 ARRIVE 에 먼저 닿음 → 파고들어 누르고 버팀(캐릭터 압축과 함께=텐션)
      //  → 방출과 함께 튕겨 빠르게 오른쪽으로 사라짐. 체공 중엔 차가 빠져 오독을 막는다.
      const ARRIVE = 0.95
      const PRESS_END = 1.12
      let carX = START_X
      if (x < 0.3) carX = START_X
      else if (x < ARRIVE)
        carX = START_X + (CONTACT_X - START_X) * Math.pow(seg(x, 0.3, ARRIVE), 1.15) // 속도 유지하며 들이받음
      else if (x < PRESS_END)
        carX = CONTACT_X - smoothstep(seg(x, ARRIVE, ARRIVE + 0.08)) * 0.22 // 파고들어 눌러 버팀(텐션)
      else if (x < 1.8)
        carX = CONTACT_X + (START_X - CONTACT_X) * (1 - Math.pow(1 - seg(x, PRESS_END, 1.8), 2)) // 방출과 함께 빠르게 퇴장
      const shake =
        x > IMPACT && x < IMPACT + 0.28 ? Math.sin(seg(x, IMPACT, IMPACT + 0.28) * Math.PI) : 0
      car.position.x = carX
      car.position.y = GROUND + shake * 0.12
      car.rotation.z = shake * -0.06
      carShadow.position.x = carX
      carShadow.scale.setScalar(S * 0.85 * (1 - shake * 0.15))

      // 그림자: 공중이면 작고 옅게, x 는 캐릭터 따라감
      shadow.position.x = b.root.position.x
      shadow.scale.setScalar(S * (1 - hop * 0.5))

      // 별: 공중에서 머리 주변 궤도
      const cx = b.root.position.x
      const cy = b.root.position.y + HEAD_Y - 0.35
      stars.forEach((sp, i) => {
        const ang = (i / stars.length) * Math.PI * 2 + t * 3.2
        const r = 0.98 + Math.sin(t * 7 + i) * 0.12
        sp.position.set(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.5, 0.6)
        const s = hop * (0.44 + (i % 2) * 0.08)
        sp.scale.setScalar(Math.max(s, 0.0001))
        sp.material.opacity = hop
      })

      // 먼지 퍼프: 눌러 파고드는 순간 뭉게 → 소멸(접촉 은폐, 텐션 강조)
      const dust =
        x > IMPACT - 0.02 && x < IMPACT + 0.38
          ? Math.sin(seg(x, IMPACT - 0.02, IMPACT + 0.38) * Math.PI)
          : 0
      puffs.forEach((sp, i) => {
        sp.scale.setScalar(Math.max(dust * (0.8 + i * 0.06), 0.0001))
        sp.material.opacity = dust * 0.9
      })
    },
  }
}
