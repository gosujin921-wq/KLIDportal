import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { Logo } from '@/mockup/components/Logo'
import { useDemoAuth } from '@/mockup/demoAuth'

/** 로그인 (목업: 로그인 버튼 → 데모 로그인 상태 전환 + 워크스페이스로 이동) */
export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useDemoAuth()

  return (
    <Container className="flex justify-center py-24">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-9 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-3 text-center text-sm text-slate-500">
          AI 영상학습 사용자 포털에 로그인하세요
        </p>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault()
            login()
            navigate('/workspace')
          }}
        >
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">아이디</span>
            <input
              placeholder="아이디 입력"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
            />
          </label>
          <Button type="submit" className="mt-6 w-full">
            로그인
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500">
          <Link to="/find-id" className="transition-colors hover:text-slate-800">
            아이디 찾기
          </Link>
          <span className="h-3 w-px bg-slate-200" />
          <Link to="/find-password" className="transition-colors hover:text-slate-800">
            비밀번호 찾기
          </Link>
          <span className="h-3 w-px bg-slate-200" />
          <Link to="/signup" className="font-semibold text-cobalt-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </Container>
  )
}
