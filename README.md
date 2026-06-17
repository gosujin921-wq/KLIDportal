# AI 영상학습 사용자 포털 (클리드 2차)

한국지역정보개발원(KLID) · 행정안전부 수탁사업 **"AI 기반 지방정부 CCTV 관제지원시스템 구축(2차)"** 중
외부 기업·연구자 대상 **AI 영상학습 사용자 포털**의 프런트엔드 목업.

- 단계: **1차 목업** (7월 초 기업 간담회용 → 7월 말 상세 목업 → 8월 개발 착수)
- 컨셉: 단순 데이터 제공 포털이 아니라 **증강·생성으로 데이터를 확장·활용하는 AI Data Factory**
- 핵심 흐름: **탐색(Explore) → 증강(Enhance) → 생성(Generate) → 활용(Utilize)**

> 상세 작업 규칙은 [CLAUDE.md](CLAUDE.md), 기획·디자인 문서는 [docs/](docs/) 참조.

---

## 기술 스택

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (디자인 토큰은 `src/index.css`의 `@theme` + CSS 변수)
- 3D 히어로: **three · @react-three/fiber · @react-three/drei**
- 모션: **motion**(framer-motion) · 차트: **Recharts** · 아이콘: **lucide-react**
- 라우팅: **react-router-dom**
- 공통 컴포넌트는 직접 최소 구축 (외부 UI 라이브러리 미사용)

---

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | 타입체크만 |

> 환경: Node 20+ 권장. 3D 히어로는 WebGL이 필요합니다.

---

## 라우트

| 경로 | 화면 |
|---|---|
| `/hub` | 랜딩 A/B안 선택 허브 (헤더·푸터 없이 단독) |
| `/` | **랜딩 A안** — 정보형(통계·지역 현황 중심) |
| `/v2` | **랜딩 B안** — 비주얼형(데이터 흐름·캐릭터 강조) |
| `/search` `/authoring` `/genai` `/workspace` | 준비 중(placeholder) |

A/B 두 가지 랜딩 시안을 두고 `/hub`에서 비교합니다.

---

## 폴더 구조

```
src/
  App.tsx, main.tsx, index.css      라우터 · 진입점 · 디자인 토큰
  components/
    brand/      Logo
    layout/     AppHeader, AppFooter, AppLayout
    ui/         Button, Container, CountUp, Mark, Reveal
  domain/       eventTypes (이벤트 유형색·라벨)
  lib/          cn, datetime, format
  mocks/        landing (목업 데이터)
  pages/
    HubPage, PlaceholderPage
    landing/        A안 — Hero(+HeroCubes), EventMarquee, ValueFlow,
                    Wow, Stats, Region, Notice, Cta
    landing-v2/     B안 — HeroSectionV2 외 히어로 실험
                    (HeroDataFlow / HeroGlassCube / HeroIsoCubes /
                     HeroCharacter / HeroVoxelBuddy)
docs/             기획·디자인 문서 (회의록 · 디자인컨셉서 · 원본자료)
```

### 히어로 3D (랜딩 A안)

`pages/landing/HeroCubes.tsx` — three/R3F로 구현한 큐브 클러스터.
**1개 큐브가 바 형태로 길어졌다 둘로 분리되는 재귀 분열(세포분열식 증식)** → 최종 클러스터.
메탈릭 로열블루, 다이아몬드 포즈, 좌우 왕복 회전. `prefers-reduced-motion` 대응.

---

## 코드 컨벤션 (요약)

> 전체는 [CLAUDE.md](CLAUDE.md).

- 타이포 **본문 15px / 최소 13px**(`text-xs`=13px로 재정의, 12px 이하 금지)
- **한국어 노출 문구에 em-dash(—) 금지** (마침표·쉼표·가운뎃점·콜론 대체)
- 날짜·시각은 **`@/lib/datetime`**(`formatDate`/`formatDateTime`)만 사용
- **opacity 색 배경 토큰 금지**(`bg-red-500/10` 류) — 배경은 표면 토큰, 색은 보더·텍스트·아이콘
- 코발트 블루 단일 강조색 + 이벤트 유형색(산불/침수/화재/유괴) 토큰
- 작업 범위는 이 폴더(`klid_2nd`)만
</content>
