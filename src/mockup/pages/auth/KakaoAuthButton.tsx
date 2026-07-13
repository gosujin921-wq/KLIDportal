import { cn } from '@/lib/cn'

/** 카카오 말풍선 심벌 (브랜드 로고) */
export function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 3C6.477 3 2 6.463 2 10.735c0 2.716 1.806 5.103 4.544 6.47-.15.522-.965 3.356-.997 3.58 0 0-.02.164.088.226.107.062.234.017.234.017.32-.045 3.71-2.428 4.297-2.844.53.075 1.075.114 1.634.114 5.522 0 9.999-3.463 9.999-7.735C22 6.463 17.523 3 12 3z" />
    </svg>
  )
}

/**
 * 카카오 본인인증 버튼 (브랜드 가이드: 옐로우 #FEE500 + 라벨 검정 85%).
 * 회원가입 Step2·아이디 찾기·비밀번호 재설정 공통 사용.
 */
export function KakaoAuthButton({
  onClick,
  className,
  label = '카카오로 본인인증',
}: {
  onClick?: () => void
  className?: string
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-5 text-base font-bold text-black/85 transition hover:brightness-95',
        className,
      )}
    >
      <KakaoIcon className="size-5" />
      {label}
    </button>
  )
}
