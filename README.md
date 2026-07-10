# AI 영상학습 사용자 포털 (클리드 2차)

한국지역정보개발원(KLID) · 행정안전부 수탁사업 **"AI 기반 지방정부 CCTV 관제지원시스템 구축(2차)"** 중
외부 기업·연구자 대상 **AI 영상학습 사용자 포털**의 프런트엔드 목업.

- 단계: **1차 목업 완료** (기획 v2 반영, 전 화면 구현) → 7월 말 상세 목업·룩앤필 → 8월 개발 착수
- 목적: 전체 플로우로 "서비스가 무엇인지" 보여주고 디자인 스타일을 확인받는 것 (디테일 기능 X)
- 핵심 흐름: **검색·반출(다운로드) / 데이터 제작(저작도구·증강·생성형 AI) / 워크스페이스**

> 작업 규칙은 [CLAUDE.md](CLAUDE.md), 기획 정본은 [docs/02_기획/작성/기획정리_최종.md](docs/02_기획/작성/기획정리_최종.md) 참조.

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

> Node 20+ 권장. 히어로 캐릭터는 WebGL 필요.

---

## 기술 스택

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** — 디자인 토큰은 `src/mockup/styles/index.css`의 `@theme`(코발트 블루, 이벤트 유형색 8종, 시맨틱 4색)
- 3D 히어로: **three · @react-three/fiber** / 모션: **motion** / 차트: **Recharts** / 아이콘: **lucide-react**
- 라우팅: **react-router-dom** / 공통 컴포넌트 직접 최소 구축 (외부 UI 라이브러리 미사용)

---

## 목업 원칙

- **이동은 진짜, 데이터는 가짜**: 페이지 간 라우팅·필터·모달은 실동작, 콘텐츠는 mock 고정
- **성공 시나리오만**: 폼 제출·신청은 성공 케이스만
- **데모 로그인**: 실제 인증 없음. 로그인 버튼 → 상태 전환(헤더가 로그아웃·마이페이지로), 워크스페이스 비로그인 잠금 동작
- 기획 v2(2026-07-10) 정합: 워크스페이스 즐겨찾기, 증강+생성형 통합, 이용안내 2탭, 카카오 인증, 팝업 공지 등

### 추천 데모 동선

```
메인(팝업 공지·히어로 검색·유형 칩) → 칩 클릭 → 검색(상단 필터바, 필터 적용 진입)
  → 데이터셋 상세 → 다운로드 신청 모달 → "워크스페이스로 이동"
  → 워크스페이스 대시보드(진행중 허브) → 저작도구(작업 목록 → 라벨링 툴) → 데이터 증강(증강|생성형 AI 탭)
  → 소식&참여 > 데이터 현황(차트) → 관리자(/admin)
```

---

## 라우트

| 경로 | 화면 |
|---|---|
| `/` | 메인 랜딩 (히어로 캐릭터 + 검색 진입 + 통계 + 쇼케이스 + 인기 데이터셋 + 공지, 팝업 공지 모달) |
| `/style` | 디자인 스타일 가이드 |
| `/search` · `/search/:id` | 학습데이터 검색(상단 필터바: 유형 8종 칩 + 지역·시간대·구성·출처) · 상세(+다운로드 신청 모달) |
| `/workspace` | 대시보드(진행중 허브). 하위: `upload` `authoring`(작업 목록) `authoring/:taskId`(라벨링 툴) `datasets` `augment`(증강\|생성형 AI 탭) `favorites`(데이터·검색조건 즐겨찾기) |
| `/news` | 소식&참여 탭: 데이터 현황(기본) · `notices` · `faq` · `inquiry` · `cases` |
| `/guide` | 이용안내 탭: 서비스 소개(기본) · `how` |
| `/terms` · `/privacy` | 이용약관 · 개인정보처리방침 (푸터 전용 접근) |
| `/login` `/signup` `/find-id` `/find-password` | 회원 (가입 4스텝, 카카오 인증 목업) |
| `/mypage` | 마이페이지: 대시보드(완료 이력, 기본) · `history` · `account` |
| `/admin` | 관리자 콘솔(별도 다크 사이드바 레이아웃): 대시보드 + 공지 관리(팝업 설정) + 6개 골격 |

구 라우트는 리다이렉트 유지: `/genai`→증강, `/mypage/favorites`→워크스페이스 즐겨찾기, `/guide/terms`→`/terms`.

---

## 폴더 구조

```
src/
  main.tsx                          진입점
  app/App.tsx                       라우터 (포털 셸 / 관리자 분리)
  krds/krds-tokens.css              KRDS 토큰 (components/krds + Storybook 전용)
  lib/                              cn · datetime · format
  mocks/klid.ts                     기관정보 샘플
  components/
    krds/                           ★ 본작업 정본 디자인시스템 (Button, TextField, Table … + Storybook)
    domain/eventTypes.ts            이벤트 유형 8종 (색·아이콘·라벨)
  mockup/                           ★ 1차 목업 (전 화면)
    styles/index.css                Tailwind 토큰 (코발트·유형색·시맨틱) + 비주얼 유틸
    demoAuth.tsx                    데모 로그인 상태
    components/
      layout/                       AppHeader(GNB·사이트맵·로그아웃 경고) · AppFooter · AppLayout
      ui/                           Container · Button(캡슐) · Modal · badges(Event/Status/Kind) · CountUp · Reveal · Mark
      DatasetCard · DatasetThumb · Breadcrumb · TabNav · SitemapOverlay
    mocks/                          landing · datasets · workspace · news · mypage
    pages/
      landing/                      히어로(복셀 캐릭터)·통계·쇼케이스·인기·공지 + PopupNoticeModal
      search/                       SearchPage · DatasetDetailPage · DownloadRequestModal
      workspace/                    Layout(LNB·잠금) · Dashboard · Upload · Authoring(목록/툴) · MyDatasets · Augment(+GenAiSection) · WsFavorites
      news/                         Layout(탭) · DataStatus · Notices · Faq · Inquiry · Cases
      guide/                        Layout(2탭) · ServiceIntro · HowTo · Legal(약관·방침)
      auth/                         Login · Signup(4스텝) · FindAccount
      mypage/                       Layout(3메뉴) · MyDashboard · History · Account
      admin/                        Layout(다크 사이드바) · Dashboard · Notices · Placeholder
      StyleGuide

docs/
  00_회의록/260611.md               회의 1차 정리본 (기능 범위·검색 기준 근거)
  01_디자인컨셉서/                  히어로·캐릭터 브랜드 가이드
  02_기획/
    README.md                       폴더 안내
    수신/2026-07-09_v1 · 2026-07-10_v2   기획 수신 원본 (design-request + 저작도구 레퍼런스)
    작성/기획정리_최종.md            ★ 기획 정본 통합 (v2 요구사항 + 검색 기준 + 열린 결정 + 결정 로그)
    작성/화면정의서_1차목업.md       목업 작업 기록 (+ v2 델타)
  98_아카이브/                      작업 히스토리 (mockup_hero 랜딩 A/B 원본 · hero_v2 캐릭터 프로토타입)
  99_source/                        RFP 등 원본자료
```

---

## 코드 컨벤션 (요약)

> 전체는 [CLAUDE.md](CLAUDE.md).

- 타이포 **본문 15px / 최소 13px** (`text-xs`=13px 재정의, 12px 이하 금지)
- **한국어 노출 문구에 em-dash(—) 금지** (마침표·쉼표·가운뎃점·콜론 대체)
- 날짜·시각은 **`@/lib/datetime`**(`formatDate`/`formatDateTime`)만 사용
- **opacity 색 배경 토큰 금지** — 배경은 표면 토큰, 색은 보더·텍스트·아이콘
- 코발트 블루 단일 강조 + **이벤트 유형색 8종**(쓰러짐·폭력·화재·교통사고·유괴·침수·산불·산사태) 토큰
- 뱃지류는 `whitespace-nowrap`(내부 줄바꿈 금지), Modal 푸터 "닫기" 금지
- 작업 범위는 이 폴더(`klid_2nd`)만
