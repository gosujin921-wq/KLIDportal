import type { EventTypeKey } from '@/components/domain/eventTypes'

/** 학습데이터셋 목업 데이터. 전부 임의 수치(실운영 데이터 무관). */

export type DataKind = '영상' | '이미지' | '라벨'

export interface Dataset {
  id: string
  title: string
  type: EventTypeKey
  /** 수집 지역 (시·도) */
  region: string
  /** 수집 기간 */
  period: string
  videoCount: number
  imageCount: number
  labelFormat: string
  sizeGb: number
  downloads: number
  /** 최종 업데이트 (정렬용 ISO) */
  updatedAt: string
  dataKinds: DataKind[]
  desc: string
  classes: string[]
  resolution: string
  fps: number
}

export const DATASETS: Dataset[] = [
  {
    id: 'ds-2026-0119',
    title: '교차로 교통사고 감지 CCTV 학습데이터',
    type: 'traffic',
    region: '경기',
    period: '2025.03 ~ 2025.12',
    videoCount: 1_840,
    imageCount: 21_600,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 96.4,
    downloads: 1_523,
    updatedAt: '2026-06-24',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '경기도 내 주요 교차로 CCTV에서 수집한 차량 추돌·접촉 사고 영상을 정제·가공한 학습데이터셋입니다. 사고 전후 구간을 포함해 사고 판단 모델 학습에 활용할 수 있으며, 차량·이륜차·보행자 객체에 대한 바운딩박스 라벨을 제공합니다.',
    classes: ['car', 'truck', 'bus', 'two-wheeler', 'person', 'vehicle-accident'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0087',
    title: '도심 건물 화재 감지 영상 데이터셋',
    type: 'fire',
    region: '서울',
    period: '2025.01 ~ 2025.11',
    videoCount: 1_420,
    imageCount: 18_200,
    labelFormat: 'JSON (BBOX·POLYGON)',
    sizeGb: 84.2,
    downloads: 1_842,
    updatedAt: '2026-06-20',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '서울시 도심 CCTV에서 수집한 건물 화재 발생 영상 기반 학습데이터셋입니다. 화염·연기 발생 초기 구간이 포함되어 조기 감지 모델 학습에 적합하며, 화염 영역은 폴리곤 라벨로 제공합니다.',
    classes: ['fire', 'smoke', 'person', 'building'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0142',
    title: '하천변 침수 수위 감시 CCTV 학습데이터',
    type: 'flood',
    region: '서울',
    period: '2025.06 ~ 2025.09',
    videoCount: 980,
    imageCount: 14_800,
    labelFormat: 'JSON (POLYGON)',
    sizeGb: 61.8,
    downloads: 987,
    updatedAt: '2026-06-28',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '집중호우 기간 하천변 CCTV에서 수집한 수위 상승·범람 영상입니다. 수면 영역 폴리곤 라벨과 수위 단계 속성을 제공해 침수 단계 판별 모델 학습에 활용할 수 있습니다.',
    classes: ['water', 'person', 'car', 'guardrail'],
    resolution: '1920×1080',
    fps: 15,
  },
  {
    id: 'ds-2026-0056',
    title: '산림 인접 CCTV 산불 감지 학습데이터',
    type: 'wildfire',
    region: '강원',
    period: '2025.02 ~ 2025.05',
    videoCount: 1_260,
    imageCount: 16_400,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 78.5,
    downloads: 1_204,
    updatedAt: '2026-06-15',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '강원도 산림 인접 감시 CCTV에서 수집한 산불 발생·확산 영상입니다. 원거리 연기 발생 시점부터 라벨링되어 있어 조기 탐지 모델 학습에 적합합니다.',
    classes: ['fire', 'smoke', 'tree'],
    resolution: '2560×1440',
    fps: 15,
  },
  {
    id: 'ds-2026-0173',
    title: '지하철 역사 쓰러짐 감지 학습데이터',
    type: 'falldown',
    region: '서울',
    period: '2025.04 ~ 2025.12',
    videoCount: 1_080,
    imageCount: 12_900,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 54.1,
    downloads: 1_105,
    updatedAt: '2026-07-02',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '지하철 역사 내 CCTV에서 수집한 보행자 쓰러짐 상황 학습데이터셋입니다. 쓰러짐 전 보행 구간과 쓰러짐 이후 구간이 함께 포함되어 행동 변화 기반 모델 학습에 활용할 수 있습니다.',
    classes: ['person', 'fallen-person', 'object'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0064',
    title: '골목길 폭력행위 감지 CCTV 학습데이터',
    type: 'violence',
    region: '부산',
    period: '2025.01 ~ 2025.10',
    videoCount: 860,
    imageCount: 10_300,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 47.6,
    downloads: 632,
    updatedAt: '2026-05-30',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '주택가 골목·유흥가 주변 CCTV에서 수집한 폭력 상황 학습데이터셋입니다. 다중 인물 상호작용 구간에 행위 속성 라벨이 부여되어 있습니다.',
    classes: ['person', 'violence-action', 'object'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0098',
    title: '어린이보호구역 유괴의심 행동 학습데이터',
    type: 'abduction',
    region: '경기',
    period: '2025.03 ~ 2025.11',
    videoCount: 540,
    imageCount: 7_800,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 32.4,
    downloads: 415,
    updatedAt: '2026-06-08',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '어린이보호구역·통학로 CCTV에서 수집한 유괴 의심 상황 연출 데이터 기반 학습데이터셋입니다. 아동·성인 동반 이동 패턴에 대한 속성 라벨을 제공합니다.',
    classes: ['person', 'child', 'car', 'abduction-action'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0031',
    title: '절개지 산사태 전조 감시 영상 데이터셋',
    type: 'landslide',
    region: '강원',
    period: '2025.06 ~ 2025.09',
    videoCount: 620,
    imageCount: 9_100,
    labelFormat: 'JSON (POLYGON)',
    sizeGb: 43.9,
    downloads: 756,
    updatedAt: '2026-06-11',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '도로 절개지·급경사지 감시 CCTV에서 수집한 토사 유출·낙석 영상입니다. 사면 변형 영역 폴리곤 라벨을 제공해 산사태 전조 감지 모델 학습에 활용할 수 있습니다.',
    classes: ['soil-flow', 'rock', 'tree', 'road'],
    resolution: '2560×1440',
    fps: 15,
  },
  {
    id: 'ds-2026-0155',
    title: '지하차도 침수 감지 영상 데이터셋',
    type: 'flood',
    region: '부산',
    period: '2025.07 ~ 2025.09',
    videoCount: 720,
    imageCount: 9_600,
    labelFormat: 'JSON (POLYGON)',
    sizeGb: 40.2,
    downloads: 548,
    updatedAt: '2026-06-30',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '지하차도 진입부 CCTV에서 수집한 침수 진행 영상입니다. 수면 상승 단계별 속성과 차량 고립 상황 라벨이 포함되어 있습니다.',
    classes: ['water', 'car', 'person'],
    resolution: '1920×1080',
    fps: 15,
  },
  {
    id: 'ds-2026-0110',
    title: '전통시장 화재 조기감지 학습데이터',
    type: 'fire',
    region: '대구',
    period: '2025.02 ~ 2025.12',
    videoCount: 890,
    imageCount: 11_700,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 52.8,
    downloads: 693,
    updatedAt: '2026-05-22',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '전통시장 밀집 점포 구역 CCTV에서 수집한 화재·연기 발생 영상입니다. 야간 저조도 구간 비중이 높아 저조도 환경 모델 학습에 적합합니다.',
    classes: ['fire', 'smoke', 'person'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0203',
    title: '고속화도로 추돌사고 영상 데이터셋',
    type: 'traffic',
    region: '인천',
    period: '2025.05 ~ 2025.12',
    videoCount: 1_120,
    imageCount: 13_400,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 68.7,
    downloads: 812,
    updatedAt: '2026-07-01',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '고속화도로 구간 CCTV에서 수집한 추돌·정차 사고 영상 학습데이터셋입니다. 고속 주행 환경의 사고 전조(급정거·차로 이탈) 구간 라벨을 포함합니다.',
    classes: ['car', 'truck', 'bus', 'vehicle-accident'],
    resolution: '2560×1440',
    fps: 30,
  },
  {
    id: 'ds-2026-0188',
    title: '공원 보행자 쓰러짐 영상 데이터셋',
    type: 'falldown',
    region: '광주',
    period: '2025.03 ~ 2025.10',
    videoCount: 640,
    imageCount: 8_200,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 35.6,
    downloads: 402,
    updatedAt: '2026-06-05',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '도시공원 산책로 CCTV에서 수집한 보행자 쓰러짐 학습데이터셋입니다. 노년층 보행 패턴 비중이 높아 고위험군 감지 모델 학습에 활용할 수 있습니다.',
    classes: ['person', 'fallen-person', 'bicycle'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0072',
    title: '야간 유흥가 폭력 상황 영상 데이터셋',
    type: 'violence',
    region: '대전',
    period: '2025.04 ~ 2025.12',
    videoCount: 580,
    imageCount: 7_100,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 31.2,
    downloads: 377,
    updatedAt: '2026-05-18',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '야간 유흥가 밀집 지역 CCTV에서 수집한 폭력 상황 학습데이터셋입니다. 저조도·군중 환경에서의 행위 식별 모델 학습에 적합합니다.',
    classes: ['person', 'violence-action'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0045',
    title: '급경사지 토사유출 감지 학습데이터',
    type: 'landslide',
    region: '경남',
    period: '2025.06 ~ 2025.08',
    videoCount: 460,
    imageCount: 6_400,
    labelFormat: 'JSON (POLYGON)',
    sizeGb: 29.8,
    downloads: 341,
    updatedAt: '2026-05-27',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '급경사지 상시 감시 CCTV에서 수집한 토사 유출 영상입니다. 강우량 속성 정보가 함께 제공되어 기상 조건 결합 모델 학습에 활용할 수 있습니다.',
    classes: ['soil-flow', 'rock', 'road'],
    resolution: '1920×1080',
    fps: 15,
  },
  {
    id: 'ds-2026-0126',
    title: '도로변 차량 화재 감지 영상 데이터셋',
    type: 'fire',
    region: '경북',
    period: '2025.01 ~ 2025.09',
    videoCount: 510,
    imageCount: 6_800,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 28.4,
    downloads: 289,
    updatedAt: '2026-04-30',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '도로변·주차장 CCTV에서 수집한 차량 화재 발생 영상입니다. 엔진룸 발화 초기 연기 구간부터 라벨링되어 있습니다.',
    classes: ['fire', 'smoke', 'car'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0091',
    title: '통학로 아동 이상행동 감지 학습데이터',
    type: 'abduction',
    region: '울산',
    period: '2025.03 ~ 2025.12',
    videoCount: 380,
    imageCount: 5_200,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 22.6,
    downloads: 264,
    updatedAt: '2026-06-02',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '통학로 CCTV에서 수집한 아동 대상 이상행동 연출 데이터 학습데이터셋입니다. 동반자 관계 추정을 위한 이동 궤적 속성을 포함합니다.',
    classes: ['person', 'child', 'abduction-action'],
    resolution: '1920×1080',
    fps: 30,
  },
  {
    id: 'ds-2026-0037',
    title: '야간 산불 확산 감시 열영상 데이터셋',
    type: 'wildfire',
    region: '경북',
    period: '2025.03 ~ 2025.04',
    videoCount: 340,
    imageCount: 4_900,
    labelFormat: 'JSON (BBOX)',
    sizeGb: 25.1,
    downloads: 486,
    updatedAt: '2026-05-12',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '야간 산림 감시용 열영상 CCTV에서 수집한 산불 확산 영상입니다. 가시광 영상과 열영상이 쌍으로 제공되어 멀티모달 학습에 활용할 수 있습니다.',
    classes: ['fire', 'smoke', 'hotspot'],
    resolution: '1280×720',
    fps: 10,
  },
  {
    id: 'ds-2026-0164',
    title: '반지하 주거지 침수 감지 학습데이터',
    type: 'flood',
    region: '서울',
    period: '2025.07 ~ 2025.08',
    videoCount: 420,
    imageCount: 5_600,
    labelFormat: 'JSON (POLYGON)',
    sizeGb: 24.3,
    downloads: 312,
    updatedAt: '2026-06-18',
    dataKinds: ['영상', '이미지', '라벨'],
    desc: '반지하 주거 밀집 지역 골목 CCTV에서 수집한 노면수 상승 영상입니다. 배수구 역류 시점 속성 라벨을 포함합니다.',
    classes: ['water', 'person', 'building'],
    resolution: '1920×1080',
    fps: 15,
  },
]

/** 다운로드 상위 6건 (메인 인기 데이터셋·상세 추천에서 사용) */
export const POPULAR_DATASETS = [...DATASETS].sort((a, b) => b.downloads - a.downloads).slice(0, 6)

export const REGIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

/** 시간대 (회의록 §5 보조 검색조건: 주간/야간/새벽) */
export type TimeOfDay = '주간' | '야간' | '새벽'
export const TIME_OF_DAY: TimeOfDay[] = ['주간', '야간', '새벽']

/** 데이터셋별 시간대 태그(목업: id 순서 기반 결정적 배정) */
const TIME_CYCLE: TimeOfDay[][] = [
  ['주간'],
  ['야간'],
  ['주간', '야간'],
  ['야간', '새벽'],
  ['주간'],
  ['새벽', '야간'],
]
export function datasetTimes(id: string): TimeOfDay[] {
  const idx = DATASETS.findIndex((d) => d.id === id)
  return TIME_CYCLE[(idx < 0 ? 0 : idx) % TIME_CYCLE.length]
}

/** 대용량 다운로드 ZIP 분할 개수 (회의/REQ-009: 분할·이어받기). ~40GB당 1분할 */
export function zipParts(sizeGb: number): number {
  return Math.max(1, Math.ceil(sizeGb / 40))
}

/** 데이터 출처 (DFEAT-001 출처 필터: 시스템 제공 데이터셋 대상) */
export type DataSource = '원본' | '수동라벨링' | 'AI증강'
export const DATA_SOURCES: DataSource[] = ['원본', '수동라벨링', 'AI증강']

const SOURCE_CYCLE: DataSource[] = ['원본', '원본', '수동라벨링', 'AI증강', '원본', 'AI증강', '수동라벨링']
export function datasetSource(id: string): DataSource {
  const idx = DATASETS.findIndex((d) => d.id === id)
  return SOURCE_CYCLE[(idx < 0 ? 0 : idx) % SOURCE_CYCLE.length]
}

export function getDataset(id: string): Dataset | undefined {
  return DATASETS.find((d) => d.id === id)
}
