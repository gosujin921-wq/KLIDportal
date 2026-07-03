// KLID portal — site footer. 원본 Footer.jsx 충실 이식.
type Nav = (screen: 'home' | 'search' | 'apply' | 'login') => void

export function KlidFooter(_props: { onNavigate?: Nav } = {}) {
  const related = ['정부24', '행정안전부', '지방재정365', '공공데이터포털', '위택스(WeTax)']
  const policies = ['개인정보처리방침', '저작권정책', '웹접근성 안내', '이메일무단수집거부']
  return (
    <footer style={{ background: 'var(--krds-color-secondary-80)', color: 'var(--krds-color-gray-20)', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* related sites + policies */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {policies.map((p, i) => (
              <a key={p} href="#" style={{ font: i === 0 ? 'var(--krds-font-weight-bold) var(--krds-font-size-14)/1 var(--krds-font-sans)' : 'var(--krds-detail-medium)', color: i === 0 ? '#fff' : 'var(--krds-color-gray-20)', textDecoration: 'none' }}>{p}</a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.24)', borderRadius: 6, padding: '8px 14px' }}>
            <span style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-gray-20)' }}>관련 사이트</span>
            <span className="material-symbols-rounded" style={{ fontSize: 18, lineHeight: 0 }}>expand_more</span>
          </div>
        </div>
        {/* identity + address */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, padding: '32px 0 40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 36, height: 36, borderRadius: 7, background: '#fff', color: 'var(--krds-color-primary-60)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '800 14px/1 var(--krds-font-sans)' }}>KLID</span>
              <b style={{ font: '700 17px/1 var(--krds-font-sans)', color: '#fff' }}>한국지역정보개발원</b>
            </div>
            <p style={{ margin: 0, font: 'var(--krds-detail-medium)', color: 'var(--krds-color-gray-30)', lineHeight: 1.7 }}>
              (04520) 서울특별시 중구 세종대로 39 상공회의소회관<br />
              대표전화 02-2031-9300 · 평일 09:00 ~ 18:00
            </p>
            <p style={{ margin: '16px 0 0', font: 'var(--krds-detail-small)', color: 'var(--krds-color-gray-40)' }}>
              © Korea Local Information &amp; Development Institute. All rights reserved.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignContent: 'flex-start', maxWidth: 420 }}>
            {related.map((r) => (
              <a key={r} href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid rgba(255,255,255,0.24)', borderRadius: 6, font: 'var(--krds-detail-medium)', color: 'var(--krds-color-gray-20)', textDecoration: 'none' }}>
                {r}<span className="material-symbols-rounded" style={{ fontSize: 14, lineHeight: 0 }}>open_in_new</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
