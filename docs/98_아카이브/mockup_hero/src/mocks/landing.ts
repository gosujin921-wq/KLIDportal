import type { EventTypeKey } from '@/domain/eventTypes'

/** 랜딩 목업 데이터 (전부 임의 수치) */

/**
 * 포털 보유 현황 (목업 수치)
 * 단위 기준: 데이터셋 = 영상+이미지 세트 / 영상 = 건 / 이미지 = 장
 */
export const portalStats = {
  datasetCount: 1_240, // 누적 학습 데이터셋 (세트) — 이벤트별·월별 누적 합계와 일치해야 함
  videoCount: 7_400, // 누적 영상 (건)
  imageCount: 86_000, // 누적 학습 이미지 (장) — RFP 구축 목표 10만장 이내로 유지
}

/**
 * 사업 구축 목표 (출처: 제안요청서)
 * - 이미지 학습데이터 10만장 구축 (수집 영상 정제·가공·라벨링)
 * - 상황 설명문 5천개 이상 (멀티모달 학습데이터)
 */
export const rfpGoals = {
  trainingImages: 100_000,
  captions: 5_000,
}

/** 증강 조건 (출처: 제안요청서 SFR-06/07. 시간·계절·날씨 조건 반영) */
export const augmentConditions = ['주간·야간', '계절 변화', '안개', '비', '눈']

/** 생성형 AI 생성 대상 (출처: 제안요청서. 침수 이미지 생성, 산불 학습데이터 생성 등) */
export const generateExamples = ['침수 이미지 생성', '산불 학습데이터 생성', '시간·날씨 조건 반영']

export const eventStats: { key: EventTypeKey; count: number }[] = [
  { key: 'wildfire', count: 412 },
  { key: 'flood', count: 356 },
  { key: 'fire', count: 287 },
  { key: 'abduction', count: 118 },
  { key: 'etc', count: 67 },
]

/** 월별 누적 데이터 증가 (최근 6개월) */
export const monthlyGrowth = [
  { month: '1월', count: 720 },
  { month: '2월', count: 845 },
  { month: '3월', count: 968 },
  { month: '4월', count: 1054 },
  { month: '5월', count: 1162 },
  { month: '6월', count: 1240 },
]

/** 시·도별 데이터셋 보유 현황 (목업). 합계 = 1,240 (누적 데이터셋과 일치) */
export const regionStats: { name: string; count: number }[] = [
  { name: '서울', count: 147 },
  { name: '경기', count: 176 },
  { name: '인천', count: 77 },
  { name: '강원', count: 113 },
  { name: '충북', count: 62 },
  { name: '충남', count: 70 },
  { name: '대전', count: 43 },
  { name: '세종', count: 17 },
  { name: '전북', count: 58 },
  { name: '전남', count: 73 },
  { name: '광주', count: 38 },
  { name: '경북', count: 107 },
  { name: '경남', count: 89 },
  { name: '대구', count: 46 },
  { name: '울산', count: 31 },
  { name: '부산', count: 65 },
  { name: '제주', count: 28 },
]

export const notices: { id: number; tag: string; title: string; date: string }[] = [
  { id: 1, tag: '공지', title: 'AI 영상학습 사용자 포털 1차 오픈 안내', date: '2026-06-10' },
  { id: 2, tag: '데이터', title: '산불 학습데이터셋 신규 412건 추가', date: '2026-06-05' },
  { id: 3, tag: '점검', title: '정기 시스템 점검 안내 (6/15 02:00~04:00)', date: '2026-06-03' },
  { id: 4, tag: '안내', title: '개인정보 포함 영상 업로드 제한 정책 안내', date: '2026-05-28' },
]
