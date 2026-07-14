import type { EventTypeKey } from '@/mockup/domain/eventTypes'
import { daysAgo, dDay, expiredAgo, until } from '@/mockup/mocks/dates'

/** 워크스페이스 목업 데이터 (전부 임의 수치, 날짜는 열람 시점 기준 상대 계산) */

export type StatusKey =
  | 'waiting' // 대기
  | 'reviewing' // 심사중
  | 'inProgress' // 진행중·처리중
  | 'reviewWait' // 검수대기
  | 'approved' // 승인완료
  | 'done' // 완료
  | 'expiring' // 기한임박
  | 'rejected' // 반려
  | 'failed' // 실패
  | 'expired' // 만료

/** 다운로드(반출) 요청 현황 */
export interface ExportRequest {
  id: string
  /** 원본 데이터셋 (datasets.ts) 연결. 대시보드에서 상세로 되돌아가는 고리 */
  datasetId: string
  datasetTitle: string
  type: EventTypeKey
  requestedAt: string
  status: StatusKey
  /** 승인 후 다운로드 기한 */
  dueLabel?: string
  sizeGb: number
  /** 다운로드 완료 여부 (완료 시 증강 원본으로 편입) */
  downloaded?: boolean
}

export const exportRequests: ExportRequest[] = [
  {
    id: 'req-0412',
    datasetId: 'ds-2026-0087',
    datasetTitle: '도심 건물 화재 감지 영상 데이터셋',
    type: 'fire',
    requestedAt: daysAgo(5),
    status: 'approved',
    dueLabel: dDay(6),
    sizeGb: 84.2,
  },
  {
    id: 'req-0398',
    datasetId: 'ds-2026-0142',
    datasetTitle: '하천변 침수 수위 감시 CCTV 학습데이터',
    type: 'flood',
    requestedAt: daysAgo(3),
    status: 'reviewing',
    sizeGb: 61.8,
  },
  {
    id: 'req-0371',
    datasetId: 'ds-2026-0119',
    datasetTitle: '교차로 교통사고 감지 CCTV 학습데이터',
    type: 'traffic',
    requestedAt: daysAgo(12),
    status: 'expiring',
    dueLabel: dDay(1),
    sizeGb: 96.4,
  },
]

/** 진행중 작업 (저작·증강) */
export interface WorkJob {
  id: string
  kind: '저작' | '증강'
  title: string
  type: EventTypeKey
  status: StatusKey
  /** 0~100. 진행바 표시용(없으면 상태 뱃지만) */
  progress?: number
  updatedAt: string
}

export const workJobs: WorkJob[] = [
  {
    id: 'job-118',
    kind: '저작',
    title: 'CCTV-강남대로-004 라벨링',
    type: 'traffic',
    status: 'inProgress',
    progress: 62,
    updatedAt: daysAgo(1),
  },
  {
    id: 'job-117',
    kind: '증강',
    title: '화재 데이터셋 야간·안개 증강',
    type: 'fire',
    status: 'inProgress',
    progress: 38,
    updatedAt: daysAgo(1),
  },
  {
    id: 'job-112',
    kind: '저작',
    title: 'CCTV-해운대-002 라벨링',
    type: 'falldown',
    status: 'reviewWait',
    updatedAt: daysAgo(4),
  },
]

/** 업로드 영상 현황 (보관 90일) */
export interface UploadItem {
  id: string
  fileName: string
  title: string
  type: EventTypeKey
  status: StatusKey
  progress?: number
  sizeMb: number
  uploadedAt: string
  /** 보관 만료일 */
  expireLabel: string
}

export const uploads: UploadItem[] = [
  {
    id: 'up-231',
    fileName: 'gangnam_cross_0412.mp4',
    title: 'CCTV-강남대로-004',
    type: 'traffic',
    status: 'inProgress',
    progress: 45,
    sizeMb: 842,
    uploadedAt: daysAgo(1),
    expireLabel: until(89),
  },
  {
    id: 'up-228',
    fileName: 'haeundae_park_0207.mp4',
    title: 'CCTV-해운대-002',
    type: 'falldown',
    status: 'done',
    sizeMb: 617,
    uploadedAt: daysAgo(5),
    expireLabel: until(85),
  },
  {
    id: 'up-224',
    fileName: 'riverside_flood_0631.mp4',
    title: 'CCTV-탄천변-006',
    type: 'flood',
    status: 'done',
    sizeMb: 1_204,
    uploadedAt: daysAgo(9),
    expireLabel: until(81),
  },
  {
    id: 'up-219',
    fileName: 'market_fire_0118.avi',
    title: 'CCTV-서문시장-001',
    type: 'fire',
    status: 'failed',
    sizeMb: 458,
    uploadedAt: daysAgo(13),
    expireLabel: '-',
  },
]

/** 저작 작업 목록 (참고 스크린샷 정보 구조 준용) */
export interface AuthoringTask {
  id: string
  videoName: string
  videoId: string
  type: EventTypeKey
  status: StatusKey
  frames: number
  objects: number
  updatedAt: string
}

export const authoringTasks: AuthoringTask[] = [
  { id: 'at-009', videoName: 'CCTV-강남대로-004', videoId: 'video-0009', type: 'traffic', status: 'inProgress', frames: 48, objects: 214, updatedAt: daysAgo(1) },
  { id: 'at-008', videoName: 'CCTV-해운대-002', videoId: 'video-0008', type: 'falldown', status: 'reviewWait', frames: 36, objects: 128, updatedAt: daysAgo(3) },
  { id: 'at-007', videoName: 'CCTV-탄천변-006', videoId: 'video-0007', type: 'flood', status: 'done', frames: 52, objects: 96, updatedAt: daysAgo(6) },
  { id: 'at-006', videoName: 'CCTV-서문시장-001', videoId: 'video-0006', type: 'fire', status: 'rejected', frames: 41, objects: 175, updatedAt: daysAgo(8) },
  { id: 'at-005', videoName: 'CCTV-우면산-003', videoId: 'video-0005', type: 'landslide', status: 'done', frames: 29, objects: 44, updatedAt: daysAgo(12) },
  { id: 'at-004', videoName: 'CCTV-수성못-001', videoId: 'video-0004', type: 'falldown', status: 'waiting', frames: 0, objects: 0, updatedAt: daysAgo(14) },
]

/** 내 학습데이터 (저작 완료 결과물, 보관 30일) */
export interface MyDataset {
  id: string
  title: string
  type: EventTypeKey
  frames: number
  objects: number
  finishedAt: string
  status: StatusKey
  expireLabel: string
}

export const myDatasets: MyDataset[] = [
  { id: 'md-031', title: 'CCTV-탄천변-006 침수 라벨링 결과', type: 'flood', frames: 52, objects: 96, finishedAt: daysAgo(5), status: 'done', expireLabel: dDay(25) },
  { id: 'md-028', title: 'CCTV-우면산-003 산사태 라벨링 결과', type: 'landslide', frames: 29, objects: 44, finishedAt: daysAgo(11), status: 'done', expireLabel: dDay(19) },
  { id: 'md-025', title: 'CCTV-역삼로-002 교통사고 라벨링 결과', type: 'traffic', frames: 44, objects: 187, finishedAt: daysAgo(28), status: 'expiring', expireLabel: dDay(2) },
  { id: 'md-021', title: 'CCTV-북항대교-001 화재 라벨링 결과', type: 'fire', frames: 38, objects: 152, finishedAt: daysAgo(42), status: 'expired', expireLabel: expiredAgo(12) },
]

/** 증강 이력 (결과물 보관 30일) */
export interface AugmentJob {
  id: string
  source: string
  options: string[]
  multiple: string
  status: StatusKey
  requestedAt: string
  expireLabel?: string
}

export const augmentJobs: AugmentJob[] = [
  { id: 'ag-014', source: 'CCTV-탄천변-006 침수 라벨링 결과', options: ['야간', '비'], multiple: '4배', status: 'inProgress', requestedAt: daysAgo(1) },
  { id: 'ag-013', source: 'CCTV-우면산-003 산사태 라벨링 결과', options: ['안개'], multiple: '2배', status: 'done', requestedAt: daysAgo(4), expireLabel: dDay(26) },
  { id: 'ag-011', source: 'CCTV-역삼로-002 교통사고 라벨링 결과', options: ['야간', '눈'], multiple: '4배', status: 'done', requestedAt: daysAgo(15), expireLabel: dDay(15) },
]

/** 데모 사용자 */
export const demoUser = {
  name: '김연구',
  org: '한국AI연구소',
  email: 'ai.kim@example.re.kr',
}
