import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { cn } from '@/lib/cn'

/** 아이디 찾기 / 비밀번호 재설정 (동일 좁은 카드 템플릿) */
export function FindAccountPage({ kind }: { kind: 'id' | 'password' }) {
  const isId = kind === 'id'
  const [step, setStep] = useState(1)

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
          {isId ? '아이디 찾기' : '비밀번호 재설정'}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          {isId
            ? '카카오 본인인증 후 가입한 아이디를 확인할 수 있습니다.'
            : '본인인증 후 새 비밀번호를 설정할 수 있습니다.'}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          {/* 비밀번호는 아이디 입력 단계 추가 */}
          {!isId && step === 1 && (
            <>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">아이디</span>
                <input
                  placeholder="가입한 아이디 입력"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
                />
              </label>
              <Button className="mt-5 w-full" onClick={() => setStep(2)}>
                다음
              </Button>
            </>
          )}

          {((isId && step === 1) || (!isId && step === 2)) && (
            <div className="flex flex-col items-center py-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-cobalt-100 text-cobalt-600">
                <ShieldCheck className="size-7" />
              </span>
              <p className="mt-4 text-base font-semibold text-slate-700">
                카카오 본인인증
              </p>
              <Button className="mt-5" onClick={() => setStep(isId ? 2 : 3)}>
                카카오로 인증하기
              </Button>
            </div>
          )}

          {/* 결과 */}
          {isId && step === 2 && (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="size-7" />
              </span>
              <p className="mt-4 text-base text-slate-500">회원님의 아이디는</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">ai_kim***</p>
              <Link to="/login" className="mt-6 w-full">
                <Button className="w-full">로그인하기</Button>
              </Link>
            </div>
          )}

          {!isId && step === 3 && (
            <>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">새 비밀번호</span>
                <input
                  type="password"
                  placeholder="영문·숫자·특수문자 8자 이상"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  영문, 숫자, 특수문자를 조합해 8자 이상 입력하세요.
                </span>
              </label>
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-slate-700">새 비밀번호 확인</span>
                <input
                  type="password"
                  placeholder="비밀번호 재입력"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
                />
              </label>
              <Link to="/login" className="mt-5 block">
                <Button className="w-full">비밀번호 변경</Button>
              </Link>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link to="/login" className={cn('font-semibold text-cobalt-600 hover:underline')}>
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </Container>
  )
}
