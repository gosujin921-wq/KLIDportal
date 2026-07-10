import './HeroIsoCubes.css'

/**
 * 히어로 아이소메트릭 큐브 그리드 (레퍼런스 다크 + 블루 하이라이트 재현).
 * 실시간 3D 없이 CSS 3D transform 합성 정지 화면.
 */

const TILE_X = 150
const TILE_Y = 86

// 다이아몬드 격자 좌표(col,row). hl=true 한 칸만 블루 하이라이트.
const CELLS: { col: number; row: number; hl?: boolean }[] = [
  { col: 0, row: 0 },
  { col: 2, row: 0 },
  { col: -2, row: 1 },
  { col: 1, row: 1, hl: true },
  { col: -1, row: 2 },
  { col: 3, row: 1 },
  { col: 0, row: 2 },
  { col: 2, row: 2 },
  { col: -2, row: 3 },
  { col: 1, row: 3 },
]

export function HeroIsoCubes() {
  return (
    <div className="iso-stage" aria-hidden>
      <div className="iso-field">
        {CELLS.map((c, i) => {
          const x = (c.col - c.row) * TILE_X
          const y = (c.col + c.row) * TILE_Y
          return (
            <div key={i} style={{ position: 'absolute', transform: `translate(${x}px, ${y}px)` }}>
              <div className={`iso-cube${c.hl ? ' iso-cube--hl' : ''}`}>
                <div className="iso-cube__face iso-cube__top" />
                <div className="iso-cube__face iso-cube__left" />
                <div className="iso-cube__face iso-cube__right" />
                {c.hl && (
                  <div className="iso-cube__label">
                    <span>
                      AI 영상학습
                      <br />
                      데이터 포털
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
