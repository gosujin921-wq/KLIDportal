import type { EventTypeKey } from '@/components/domain/eventTypes'

/** 워크스페이스 목업 데이터 (전부 임의 수치) */

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
  datasetTitle: string
  type: EventTypeKey
  requestedAt: string
  status: StatusKey
  /** 승인 후 다운로드 기한 */
  dueLabel?: string
  sizeGb: number
}

export const exportRequests: ExportRequest[] = [
  {
    id: 'req-0412',
    datasetTitle: '도심 건물 화재 감지 영상 데이터셋',
    type: 'fire',
    requestedAt: '2026-07-06',
    status: 'approved',
    dueLabel: 'D-6 (07.15까지)',
    sizeGb: 84.2,
  },
  {
    id: 'req-0398',
    datasetTitle: '하천변 침수 수위 감시 CCTV 학습데이터',
    type: 'flood',
    requestedAt: '2026-07-08',
    status: 'reviewing',
    sizeGb: 61.8,
  },
  {
    id: 'req-0371',
    datasetTitle: '교차로 교통사고 감지 CCTV 학습데이터',
    type: 'traffic',
    requestedAt: '2026-06-29',
    status: 'expiring',
    dueLabel: 'D-1 (07.10까지)',
    sizeGb: 96.4,
  },
]

/** 진행중 작업 (저작·증강·생성) */
export interface WorkJob {
  id: string
  kind: '저작' | '증강' | '생성'
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
    updatedAt: '2026-07-09',
  },
  {
    id: 'job-117',
    kind: '증강',
    title: '화재 데이터셋 야간·안개 증강',
    type: 'fire',
    status: 'inProgress',
    progress: 38,
    updatedAt: '2026-07-09',
  },
  {
    id: 'job-115',
    kind: '생성',
    title: '침수 상황 영상 생성 (교차로)',
    type: 'flood',
    status: 'waiting',
    updatedAt: '2026-07-08',
  },
  {
    id: 'job-112',
    kind: '저작',
    title: 'CCTV-해운대-002 라벨링',
    type: 'falldown',
    status: 'reviewWait',
    updatedAt: '2026-07-07',
  },
]

/** 업로드 영상 현황 */
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
    uploadedAt: '2026-07-09',
    expireLabel: '2026.10.09까지',
  },
  {
    id: 'up-228',
    fileName: 'haeundae_park_0207.mp4',
    title: 'CCTV-해운대-002',
    type: 'falldown',
    status: 'done',
    sizeMb: 617,
    uploadedAt: '2026-07-05',
    expireLabel: '2026.10.05까지',
  },
  {
    id: 'up-224',
    fileName: 'riverside_flood_0631.mp4',
    title: 'CCTV-탄천변-006',
    type: 'flood',
    status: 'done',
    sizeMb: 1_204,
    uploadedAt: '2026-07-01',
    expireLabel: '2026.10.01까지',
  },
  {
    id: 'up-219',
    fileName: 'market_fire_0118.avi',
    title: 'CCTV-서문시장-001',
    type: 'fire',
    status: 'failed',
    sizeMb: 458,
    uploadedAt: '2026-06-27',
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
  { id: 'at-009', videoName: 'CCTV-강남대로-004', videoId: 'video-0009', type: 'traffic', status: 'inProgress', frames: 48, objects: 214, updatedAt: '2026-07-09' },
  { id: 'at-008', videoName: 'CCTV-해운대-002', videoId: 'video-0008', type: 'falldown', status: 'reviewWait', frames: 36, objects: 128, updatedAt: '2026-07-07' },
  { id: 'at-007', videoName: 'CCTV-탄천변-006', videoId: 'video-0007', type: 'flood', status: 'done', frames: 52, objects: 96, updatedAt: '2026-07-04' },
  { id: 'at-006', videoName: 'CCTV-서문시장-001', videoId: 'video-0006', type: 'fire', status: 'rejected', frames: 41, objects: 175, updatedAt: '2026-07-02' },
  { id: 'at-005', videoName: 'CCTV-우면산-003', videoId: 'video-0005', type: 'landslide', status: 'done', frames: 29, objects: 44, updatedAt: '2026-06-28' },
  { id: 'at-004', videoName: 'CCTV-수성못-001', videoId: 'video-0004', type: 'falldown', status: 'waiting', frames: 0, objects: 0, updatedAt: '2026-06-26' },
]

/** 내 학습데이터 (저작 완료 결과물) */
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
  { id: 'md-031', title: 'CCTV-탄천변-006 침수 라벨링 결과', type: 'flood', frames: 52, objects: 96, finishedAt: '2026-07-04', status: 'done', expireLabel: 'D-25 (08.03까지)' },
  { id: 'md-028', title: 'CCTV-우면산-003 산사태 라벨링 결과', type: 'landslide', frames: 29, objects: 44, finishedAt: '2026-06-28', status: 'done', expireLabel: 'D-19 (07.28까지)' },
  { id: 'md-025', title: 'CCTV-역삼로-002 교통사고 라벨링 결과', type: 'traffic', frames: 44, objects: 187, finishedAt: '2026-06-19', status: 'expiring', expireLabel: 'D-2 (07.11까지)' },
  { id: 'md-021', title: 'CCTV-북항대교-001 화재 라벨링 결과', type: 'fire', frames: 38, objects: 152, finishedAt: '2026-05-30', status: 'expired', expireLabel: '만료 (06.29)' },
]

/** 증강 이력 */
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
  { id: 'ag-014', source: 'CCTV-탄천변-006 침수 라벨링 결과', options: ['야간', '비'], multiple: '4배', status: 'inProgress', requestedAt: '2026-07-09' },
  { id: 'ag-013', source: 'CCTV-우면산-003 산사태 라벨링 결과', options: ['안개'], multiple: '2배', status: 'done', requestedAt: '2026-07-05', expireLabel: 'D-26 (08.04까지)' },
  { id: 'ag-011', source: 'CCTV-역삼로-002 교통사고 라벨링 결과', options: ['야간', '눈'], multiple: '4배', status: 'done', requestedAt: '2026-06-24', expireLabel: 'D-15 (07.24까지)' },
]

/** 생성형 AI 결과 */
export interface GenAiJob {
  id: string
  title: string
  type: EventTypeKey
  length: string
  status: StatusKey
  requestedAt: string
  expireLabel?: string
}

export const genAiJobs: GenAiJob[] = [
  { id: 'gen-022', title: '침수 상황 영상 생성 (교차로)', type: 'flood', length: '10초', status: 'waiting', requestedAt: '2026-07-08' },
  { id: 'gen-021', title: '산불 확산 영상 생성 (능선)', type: 'wildfire', length: '10초', status: 'done', requestedAt: '2026-07-03', expireLabel: 'D-24 (08.02까지)' },
  { id: 'gen-019', title: '야간 화재 영상 생성 (주차장)', type: 'fire', length: '5초', status: 'done', requestedAt: '2026-06-27', expireLabel: 'D-18 (07.27까지)' },
  { id: 'gen-017', title: '폭우 침수 영상 생성 (지하차도)', type: 'flood', length: '5초', status: 'failed', requestedAt: '2026-06-21' },
]

/** 데모 사용자 */
export const demoUser = {
  name: '김연구',
  org: '한국AI연구소',
  email: 'ai.kim@example.re.kr',
}
