import { useState } from 'react'
import { cn } from '@/lib/cn'

const GUIDES = {
  search: {
    label: '데이터 검색·다운로드',
    steps: [
      { title: '학습데이터 검색', desc: '이벤트 유형·지역·기간 조건으로 원하는 데이터셋을 찾습니다.' },
      { title: '상세 확인', desc: '미리보기와 데이터 구성, 라벨링 정보를 확인합니다.' },
      { title: '다운로드 신청', desc: '활용 목적을 입력하고 이용약관에 동의해 신청합니다.' },
      { title: '워크스페이스에서 다운로드', desc: '승인 완료 후 7일 이내에 내려받습니다.' },
    ],
  },
  authoring: {
    label: '저작도구',
    steps: [
      { title: '영상 업로드', desc: '개인정보가 제거된 CCTV 영상을 업로드합니다.' },
      { title: '프레임 추출', desc: '라벨링할 프레임을 선택합니다.' },
      { title: '객체 라벨링', desc: '바운딩박스·폴리곤으로 객체를 직접 표시합니다.' },
      { title: '검수·완료', desc: '라벨링 결과를 저장하고 내 학습데이터로 만듭니다.' },
    ],
  },
  ai: {
    label: 'AI 증강·생성',
    steps: [
      { title: '원본 선택', desc: '증강할 내 학습데이터를 선택합니다.' },
      { title: '조건 설정', desc: '시간·계절·날씨 조건과 증강 배수를 지정합니다.' },
      { title: '실행', desc: '증강 또는 생성 작업을 실행합니다.' },
      { title: '결과 다운로드', desc: '완료된 결과물을 보관 기한 내에 다운로드합니다.' },
    ],
  },
}

type GuideKey = keyof typeof GUIDES

/** 이용 가이드: 단계별 안내 */
export function HowToPage() {
  const [guide, setGuide] = useState<GuideKey>('search')
  const current = GUIDES[guide]

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(GUIDES) as GuideKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setGuide(k)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              k === guide
                ? 'bg-cobalt-600 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:text-cobalt-700',
            )}
          >
            {GUIDES[k].label}
          </button>
        ))}
      </div>

      <ol className="mt-8 space-y-4">
        {current.steps.map((s, i) => (
          <li key={i} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cobalt-600 text-lg font-bold text-white">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-slate-900">{s.title}</p>
              <p className="mt-1 text-base leading-relaxed text-slate-600">{s.desc}</p>
              {/* 스크린샷 placeholder */}
              <div className="mt-3 flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                화면 예시 이미지
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
