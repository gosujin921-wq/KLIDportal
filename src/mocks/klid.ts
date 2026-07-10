// KLID portal — shared sample data (claude.ai/design "KRDS / KLID Design System" 이식)
// 원본 ui_kits/klid_portal/data.js 의 window.KLID_DATA 를 ES 모듈로 전환. 내용 동일.
export const KLID_DATA = {
  gnb: [
    { id: 'civil', label: '민원서비스', items: ['주민등록', '가족관계', '지방세 납부', '건축·토지', '자동차'] },
    { id: 'open', label: '정보공개', items: ['사전정보공표', '행정정보공개', '공공데이터', '재정정보'] },
    { id: 'news', label: '알림소식', items: ['공지사항', '보도자료', '채용정보', '고시·공고'] },
    { id: 'about', label: '기관소개', items: ['인사말', '조직도', '찾아오시는 길', '주요사업'] },
  ],
  quickServices: [
    { icon: 'description', label: '주민등록등본', desc: '발급·열람' },
    { icon: 'family_restroom', label: '가족관계증명서', desc: '발급' },
    { icon: 'home_work', label: '전입신고', desc: '온라인 신고' },
    { icon: 'payments', label: '지방세 납부', desc: '조회·납부' },
    { icon: 'directions_car', label: '자동차 등록', desc: '이전·말소' },
    { icon: 'apartment', label: '건축물대장', desc: '발급·열람' },
    { icon: 'badge', label: '주민등록증', desc: '재발급' },
    { icon: 'verified_user', label: '본인인증', desc: '간편인증' },
  ],
  notices: {
    공지사항: [
      { tag: '공지', title: '2026년 지방세 정기분 납부 안내', date: '2026.06.24.', isNew: true },
      { tag: '안내', title: '여름철 민원실 운영시간 변경 안내', date: '2026.06.23.', isNew: true },
      { tag: '공지', title: '전자증명서 발급 시스템 정기점검 안내', date: '2026.06.20.', isNew: false },
      { tag: '안내', title: '주민등록 사실조사 기간 운영 안내', date: '2026.06.18.', isNew: false },
    ],
    보도자료: [
      { tag: '보도', title: 'KLID, 차세대 지방행정 공통시스템 개통', date: '2026.06.22.', isNew: true },
      { tag: '보도', title: '지역정보화 우수사례 경진대회 수상작 발표', date: '2026.06.19.', isNew: false },
      { tag: '보도', title: '공공 마이데이터 연계 서비스 확대 추진', date: '2026.06.16.', isNew: false },
    ],
    채용정보: [
      { tag: '채용', title: '2026년도 제2차 일반직 신규채용 공고', date: '2026.06.21.', isNew: true },
      { tag: '채용', title: '정보보안 분야 경력직 채용 안내', date: '2026.06.17.', isNew: false },
    ],
  },
  searchResults: [
    { category: '민원서비스', title: '주민등록표 등본(초본) 발급', desc: '세대주 및 세대원의 인적사항이 기재된 주민등록표 등본을 발급받을 수 있습니다.', fee: '수수료 무료', tags: ['즉시발급', '공동인증서'] },
    { category: '민원서비스', title: '가족관계증명서 발급', desc: '본인 및 가족의 가족관계를 증명하는 서류를 온라인으로 발급합니다.', fee: '수수료 무료', tags: ['즉시발급'] },
    { category: '정보공개', title: '주민등록 관련 행정정보 공개 목록', desc: '주민등록 업무 관련 사전정보공표 및 공개 항목을 확인할 수 있습니다.', fee: null, tags: ['정보공개'] },
    { category: '알림소식', title: '주민등록 사실조사 기간 운영 안내', desc: '2026년 주민등록 사실조사 기간 및 비대면 조사 참여 방법을 안내합니다.', fee: null, tags: ['공지'] },
  ],
} as const

export type KlidData = typeof KLID_DATA
