import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

/**
 * 브랜드 로고 락업 — "큐브 증식" 마크 + 투톤 워드마크 + 태그라인.
 * 마크: 큰 큐브에서 작은 큐브들이 갈라져 나가는 형상 (히어로 3D 모티프와 동일 아이덴티티).
 * 호버 시 작은 큐브들이 바깥으로 살짝 벌어진다 (증식 모션).
 */
export function Logo({
  inverted = false,
  markTo,
  className,
}: {
  /** 다크 배경용 (푸터 등) */
  inverted?: boolean
  /** 지정 시 심볼(큐브 마크)만 해당 경로로 이동하는 링크가 된다 */
  markTo?: string
  className?: string
}) {
  const mark = (
    <svg viewBox="0 0 32 32" aria-hidden className="size-9 shrink-0">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a61e8" />
            <stop offset="1" stopColor="#2336b8" />
          </linearGradient>
        </defs>
        {/* 원본(큰 큐브) */}
        <rect x="2" y="11" width="14" height="14" rx="4" fill="url(#logo-grad)" />
        {/* 증식된 큐브들 — 호버 시 바깥으로 벌어짐 */}
        <rect
          x="18"
          y="7"
          width="9.5"
          height="9.5"
          rx="2.8"
          fill="#4a61e8"
          className="transition-transform duration-300 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]"
        />
        <rect
          x="20"
          y="19"
          width="7"
          height="7"
          rx="2.2"
          fill="#6e84f1"
          className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[1.5px]"
        />
        <rect
          x="12.5"
          y="2"
          width="5"
          height="5"
          rx="1.6"
          fill="#9daef7"
          className="transition-transform duration-300 group-hover:-translate-y-[2px]"
        />
      </svg>
  )

  return (
    <span className={cn('group flex items-center gap-2.5', className)}>
      {/* 마크 — markTo 지정 시 심볼만 링크 */}
      {markTo ? (
        <Link to={markTo} aria-label="메인으로" className="shrink-0">
          {mark}
        </Link>
      ) : (
        mark
      )}

      {/* 워드마크 */}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            'text-[17px] font-extrabold tracking-tight',
            inverted ? 'text-white' : 'text-slate-900',
          )}
        >
          AI 영상학습{' '}
          <span className={inverted ? 'text-cobalt-300' : 'text-gradient-cobalt'}>사용자 포털</span>
        </span>
      </span>
    </span>
  )
}
