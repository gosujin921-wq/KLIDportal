/** 소식&참여 목업 데이터 */

export interface NoticePost {
  id: number
  category: '공지' | '안내' | '업데이트' | '점검'
  title: string
  date: string
  views: number
  pinned?: boolean
  /** 팝업 공지 (기획 v2, DFEAT-055): 메인 진입 시 이미지 배너형 모달 노출 */
  popup?: boolean
  body: string
}

export const noticePosts: NoticePost[] = [
  {
    id: 12,
    category: '공지',
    title: '2026년 하반기 학습데이터 신규 공개 안내',
    date: '2026-07-01',
    views: 1842,
    pinned: true,
    popup: true,
    body: '2026년 하반기 재난·안전 분야 학습데이터셋이 신규 공개됩니다. 산불·산사태 유형을 중심으로 총 340여 건의 데이터셋이 추가되며, 자세한 목록은 학습데이터 검색에서 확인하실 수 있습니다.',
  },
  {
    id: 11,
    category: '점검',
    title: '포털 시스템 정기점검 안내 (7/15 02:00~06:00)',
    date: '2026-06-28',
    views: 964,
    pinned: true,
    body: '안정적인 서비스 제공을 위해 정기 시스템 점검을 실시합니다. 점검 시간 동안 데이터 검색·다운로드·워크스페이스 이용이 일시 중단됩니다. 이용에 참고하시기 바랍니다.',
  },
  {
    id: 10,
    category: '안내',
    title: '데이터 활용 사례 공모전 접수 안내',
    date: '2026-06-25',
    views: 731,
    body: '포털의 학습데이터를 활용한 우수 사례를 공모합니다. 재난·안전 분야 AI 모델 개발 사례를 대상으로 하며, 선정된 사례는 활용사례 페이지에 소개됩니다.',
  },
  {
    id: 9,
    category: '업데이트',
    title: '저작도구 기능 업데이트 안내 (v2.1)',
    date: '2026-06-20',
    views: 588,
    body: '저작도구에 폴리곤 라벨링과 프레임 일괄 복사 기능이 추가되었습니다. 라벨링 작업 효율을 높일 수 있으며, 자세한 사용법은 이용 가이드에서 확인하세요.',
  },
  {
    id: 8,
    category: '공지',
    title: '개인정보처리방침 개정 안내 (시행일: 2026.07.01)',
    date: '2026-06-15',
    views: 442,
    body: '개인정보처리방침이 일부 개정되어 2026년 7월 1일부터 시행됩니다. 개정 내용은 이용안내 > 개인정보처리방침에서 확인하실 수 있습니다.',
  },
  {
    id: 7,
    category: '안내',
    title: '개인정보 포함 영상 업로드 제한 정책 안내',
    date: '2026-05-28',
    views: 617,
    body: '얼굴·차량번호 등 개인정보가 포함된 영상은 업로드가 제한됩니다. 업로드된 영상은 관리자 검토를 거치며, 정책 위반 시 삭제될 수 있습니다.',
  },
]

export interface FaqItem {
  id: number
  category: string
  q: string
  a: string
  top?: boolean
}

export const faqCategories = ['전체', '회원·계정', '데이터 이용', '저작도구', 'AI 기능', '기타']

export const faqItems: FaqItem[] = [
  {
    id: 1,
    category: '데이터 이용',
    q: '학습데이터는 어떻게 다운로드하나요?',
    a: '데이터셋 상세 페이지에서 다운로드를 신청하면 관리자 승인 후 워크스페이스에서 내려받을 수 있습니다. 승인 완료 후 7일 이내에 다운로드해야 하며, 기한 경과 시 재신청이 필요합니다.',
    top: true,
  },
  {
    id: 2,
    category: '데이터 이용',
    q: '데이터는 어떤 단위로 제공되나요?',
    a: '학습데이터는 영상과 이미지가 세트로 제공됩니다. 라벨은 JSON(BBOX·POLYGON) 형식으로 함께 제공됩니다.',
    top: true,
  },
  {
    id: 3,
    category: '회원·계정',
    q: '회원가입은 어떻게 하나요?',
    a: '약관 동의, 카카오 본인인증, 회원정보 입력의 순서로 가입할 수 있습니다. 한 계정당 하나의 워크스페이스가 제공됩니다.',
    top: true,
  },
  {
    id: 4,
    category: '저작도구',
    q: '업로드한 영상은 얼마나 보관되나요?',
    a: '업로드한 영상과 저작·생성 결과물은 유효기간이 설정되며, 기한이 지나면 자동 삭제됩니다. 보관 기한은 각 목록에서 확인할 수 있습니다.',
  },
  {
    id: 5,
    category: '저작도구',
    q: '개인정보가 포함된 영상도 업로드할 수 있나요?',
    a: '얼굴·차량번호 등 개인정보가 포함된 영상은 업로드할 수 없습니다. 업로드 전 반드시 비식별 처리를 완료해 주세요.',
  },
  {
    id: 6,
    category: 'AI 기능',
    q: '데이터 증강과 생성형 AI는 어떻게 다른가요?',
    a: '데이터 증강은 보유한 학습데이터에 시간·계절·날씨 조건을 반영해 데이터를 늘리는 기능이며, 생성형 AI는 기준 이미지로 새로운 재난 상황 영상을 만드는 기능입니다.',
  },
]

export interface UseCase {
  id: number
  title: string
  org: string
  summary: string
  category: string
}

export const useCases: UseCase[] = [
  {
    id: 1,
    title: '도심 화재 조기감지 모델 고도화',
    org: 'A 소방안전 연구원',
    summary: '화재 학습데이터셋으로 연기 발생 초기 감지 정확도를 12% 향상시킨 사례입니다.',
    category: '화재',
  },
  {
    id: 2,
    title: '교차로 사고 예측 AI 실증',
    org: 'B 모빌리티 스타트업',
    summary: '교통사고 데이터셋을 활용해 사고 전조 패턴을 학습한 실시간 경보 모델을 개발했습니다.',
    category: '교통사고',
  },
  {
    id: 3,
    title: '하천 침수 단계 자동 판별',
    org: 'C 방재기술 기업',
    summary: '침수 수위 데이터셋으로 CCTV 영상만으로 침수 단계를 판별하는 모델을 구축했습니다.',
    category: '침수',
  },
  {
    id: 4,
    title: '지하철 역사 쓰러짐 감지 실증',
    org: 'D 대학 산학협력단',
    summary: '쓰러짐 데이터셋을 활용해 역사 내 응급상황 자동 감지 시스템을 실증했습니다.',
    category: '쓰러짐',
  },
]
