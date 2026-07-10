import './HeroGlassCube.css'

/**
 * 히어로 정적 글래스 큐브 (레퍼런스 frosted 코발트 아크릴 재현).
 * 실시간 3D 없이 CSS 3D transform 합성 정지 화면. 텍스트 가독 위해 우측 배치.
 */
export function HeroGlassCube() {
  return (
    <div className="gcube-stage" aria-hidden>
      <div className="gcube-floor" />
      <div className="gcube-scene">
        <div className="gcube-shadow" />
        <div className="gcube">
          <div className="gcube__face gcube__top" />
          <div className="gcube__face gcube__side">
            <div className="gcube__ribs" />
          </div>
          <div className="gcube__face gcube__front">
            <div className="gcube__ribs" />
            <div className="gcube__label">
              <div className="gcube__label-kicker">데이터 증강률 최대</div>
              <div className="gcube__label-num">200%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
