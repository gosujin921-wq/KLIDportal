import './HeroCharacter.css'

/**
 * 히어로 캐릭터 — 큐브 로봇 (3D 컬러 큐브 + 흰 얼굴 패널 + 궤도 큐브).
 * 실시간 3D 없이 SVG 그라데이션으로 입체 음영 합성. 색은 브랜드 톤(시안/블루/퍼플).
 */
export function HeroCharacter() {
  return (
    <div className="hero-character" aria-hidden>
      <svg viewBox="0 0 480 460" className="hero-character__svg" role="img">
        <defs>
          {/* 본체 면 그라데이션 */}
          <linearGradient id="hc-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#79E3E9" />
            <stop offset="1" stopColor="#46C7D3" />
          </linearGradient>
          <linearGradient id="hc-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9AB2F9" />
            <stop offset="1" stopColor="#6E8AF0" />
          </linearGradient>
          <linearGradient id="hc-purple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#B79DE6" />
            <stop offset="1" stopColor="#9466D6" />
          </linearGradient>
          {/* 윗면(밝게) */}
          <linearGradient id="hc-cyan-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#A6EEF2" />
            <stop offset="1" stopColor="#74DBE3" />
          </linearGradient>
          <linearGradient id="hc-blue-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BFCEFB" />
            <stop offset="1" stopColor="#93AAF6" />
          </linearGradient>
          <linearGradient id="hc-purple-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D2BEF1" />
            <stop offset="1" stopColor="#B294E4" />
          </linearGradient>
          {/* 오른쪽 면(어둡게) */}
          <linearGradient id="hc-side" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9477CE" />
            <stop offset="1" stopColor="#6E4DB6" />
          </linearGradient>
          {/* 돌출 큐브(로열 블루) */}
          <linearGradient id="hc-royal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6E80F4" />
            <stop offset="1" stopColor="#4453E0" />
          </linearGradient>
          <linearGradient id="hc-royal-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#93A1F8" />
            <stop offset="1" stopColor="#6E80F4" />
          </linearGradient>
          {/* 흰 얼굴 패널 */}
          <linearGradient id="hc-panel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E9EEF9" />
          </linearGradient>
          <radialGradient id="hc-shadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#0b1124" stopOpacity="0.45" />
            <stop offset="1" stopColor="#0b1124" stopOpacity="0" />
          </radialGradient>
          <clipPath id="hc-front-clip">
            <rect x="150" y="178" width="156" height="156" rx="30" />
          </clipPath>
        </defs>

        {/* 바닥 그림자 */}
        <ellipse cx="244" cy="402" rx="120" ry="22" fill="url(#hc-shadow)" />

        {/* 궤도 (링 + 장식 큐브) — 천천히 회전 */}
        <g className="hero-character__orbit">
          <ellipse
            cx="240"
            cy="218"
            rx="216"
            ry="96"
            fill="none"
            stroke="#8aa0d8"
            strokeWidth="1.4"
            strokeOpacity="0.5"
            transform="rotate(-14 240 218)"
          />
          {/* 장식 큐브 */}
          <g transform="translate(40 150)">
            <SmallCube size={26} fill="#7C53D6" topFill="#9A74E6" />
          </g>
          <g transform="translate(430 132)">
            <SmallCube size={20} fill="#4F63EE" topFill="#7384F4" />
          </g>
          <g transform="translate(60 296)">
            <SmallCube size={30} fill="#4F63EE" topFill="#7384F4" />
          </g>
          <rect x="442" y="218" width="34" height="34" rx="8" fill="#5BD6DE" />
          {/* 작은 구체 */}
          <circle cx="22" cy="220" r="6" fill="#5B6FF0" />
          <circle cx="300" cy="300" r="6" fill="#54D3DB" />
          <circle cx="408" cy="296" r="9" fill="#9A74E6" />
          <circle cx="330" cy="318" r="5" fill="#5B6FF0" />
        </g>

        {/* 돌출 큐브 — 본체 뒤로 끼워지는 것들 */}
        <g transform="translate(228 96)">
          <SmallCube size={46} />
        </g>
        <g transform="translate(108 232)">
          <SmallCube size={44} />
        </g>
        <g transform="translate(338 198)">
          <SmallCube size={46} />
        </g>
        <g transform="translate(348 270)">
          <SmallCube size={40} />
        </g>

        {/* 본체 큐브 */}
        {/* 윗면 3색 밴드 */}
        <polygon points="150,178 202,178 250,140 198,140" fill="url(#hc-cyan-top)" />
        <polygon points="202,178 254,178 302,140 250,140" fill="url(#hc-blue-top)" />
        <polygon points="254,178 306,178 354,140 302,140" fill="url(#hc-purple-top)" />
        {/* 오른쪽 면 */}
        <polygon points="306,178 354,140 354,296 306,334" fill="url(#hc-side)" />
        {/* 앞면 3색 밴드 (둥근 사각으로 클립) */}
        <g clipPath="url(#hc-front-clip)">
          <rect x="150" y="178" width="52" height="156" fill="url(#hc-cyan)" />
          <rect x="202" y="178" width="52" height="156" fill="url(#hc-blue)" />
          <rect x="254" y="178" width="52" height="156" fill="url(#hc-purple)" />
        </g>

        {/* 다리 큐브 (앞·아래) */}
        <g transform="translate(168 322)">
          <SmallCube size={42} />
        </g>
        <g transform="translate(244 330)">
          <SmallCube size={40} />
        </g>

        {/* 흰 얼굴 패널 */}
        <rect x="172" y="202" width="112" height="112" rx="24" fill="url(#hc-panel)" />
        {/* 눈 */}
        <rect x="202" y="234" width="15" height="30" rx="7.5" fill="#171C2B" />
        <rect x="240" y="234" width="15" height="30" rx="7.5" fill="#171C2B" />
        {/* 패널 하이라이트 */}
        <rect x="182" y="210" width="40" height="10" rx="5" fill="#ffffff" opacity="0.7" />
      </svg>
    </div>
  )
}

/** 작은 3D 큐브 (좌상단 0,0 기준). 기본은 로열 블루. */
function SmallCube({
  size,
  fill = 'url(#hc-royal)',
  topFill = 'url(#hc-royal-top)',
}: {
  size: number
  fill?: string
  topFill?: string
}) {
  const d = size * 0.34 // 깊이
  return (
    <g>
      {/* 윗면 */}
      <polygon
        points={`0,0 ${size},0 ${size + d},${-d} ${d},${-d}`}
        fill={topFill}
      />
      {/* 오른쪽 면 */}
      <polygon
        points={`${size},0 ${size + d},${-d} ${size + d},${size - d} ${size},${size}`}
        fill="#3f4dc9"
        opacity="0.85"
      />
      {/* 앞면 */}
      <rect x="0" y="0" width={size} height={size} rx={size * 0.18} fill={fill} />
    </g>
  )
}
