# 문서

AI 영상학습 사용자 포털(클리드 2차) 기획·디자인 문서.
프로젝트 개요는 루트 [../README.md](../README.md), 작업 규칙은 [../CLAUDE.md](../CLAUDE.md).

## 구성

- `00_회의록/` — 회의 정리 (예: `260611.md` 6/11 포털 구축방향 회의)
- `01_디자인컨셉서/` — 룩앤필·히어로 디자인 컨셉서(HTML), 캐릭터 포즈, 레퍼런스 이미지(`reference/`)
- `02_기획/` — 기획 자료. 수신 원본(`수신/날짜_v버전/`)과 우리 작성물(`작성/` — ★ `기획정리_최종.md`, `화면정의서_1차목업.md`)
- `98_아카이브/` — 작업 히스토리 (실행·참조 대상 아님, node_modules 제거됨)
  - `mockup_hero/` — 랜딩 A/B 시안 실험 프로젝트 원본. 현 `src/mockup/pages/landing/`은 여기 B안(landing-v2)을 정본화한 것. 실행하려면 `npm install` 필요 (launch.json `mockup-hero-dev`)
  - `hero_v2/` — 복셀 캐릭터(HeroVoxelBuddy) 프로토타입 작업장 (voxel_buddy*.html, 세션 로그)
- `99_source/` — 원본 발주·조사 자료
  - 제안요청서(RFP) `hwpx`
  - 사례조사 `pptx`
  - `아카이브/` (백업·중복본)

> 컨셉 요지: AI Data Factory(증강·생성으로 데이터 확장), 흐름 = 탐색 → 증강 → 생성 → 활용.
</content>
