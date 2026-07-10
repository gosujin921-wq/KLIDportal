import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'

/** 비로그인 시 워크스페이스 콘텐츠 위에 덮는 잠금 오버레이 (아래 미리보기가 블러로 비침) */
export function LockedOverlay() {
  const navigate = useNavigate()
  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center">
      {/* 블러 스크린 */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-sm" />
      {/* 잠금 카드 */}
      <div className="relative mt-24 flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-cobalt-50 text-cobalt-600">
          <Lock className="size-7" />
        </span>
        <p className="mt-4 text-lg font-bold text-slate-900">로그인이 필요한 서비스입니다</p>
        <p className="mt-1.5 text-base leading-relaxed text-slate-500">
          워크스페이스에서 업로드·저작·AI 데이터 제작을 이용할 수 있습니다.
        </p>
        <div className="mt-6 flex gap-2.5">
          <Button onClick={() => navigate('/login')}>로그인</Button>
          <Button variant="secondary" onClick={() => navigate('/signup')}>
            회원가입
          </Button>
        </div>
      </div>
    </div>
  )
}
