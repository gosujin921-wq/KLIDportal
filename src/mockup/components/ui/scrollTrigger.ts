/**
 * 메인 페이지 공통 스크롤 트리거 margin.
 *
 * 요소가 뷰포트 "중앙쯤"(위에서 약 55%)에 도달하면 애니메이션을 시작한다.
 * 하단 45%를 감지 영역에서 제외(`-45%`)해, 요소가 화면 아래 가장자리에 걸칠 때가 아니라
 * 중앙 부근까지 올라왔을 때 트리거된다. 상단은 자르지 않아(0px) 위로 지나간 요소도
 * 사라질 때까지 계속 감지 → 루프 애니메이션은 화면에 보이는 동안 유지된다.
 *
 * motion 의 `useInView`/`viewport` margin 과 IntersectionObserver 의 rootMargin 에 공용.
 * (형식은 CSS margin: `top right bottom left`)
 */
export const SCROLL_TRIGGER_MARGIN = '0px 0px -45% 0px'
