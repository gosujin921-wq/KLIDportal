import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronDown, PartyPopper } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { KakaoAuthButton, KakaoIcon } from './KakaoAuthButton'
import { cn } from '@/lib/cn'

const STEPS = ['약관 동의', '본인인증', '정보 입력', '가입 완료']

const AGREEMENTS = [
  { id: 'service', label: '이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
]

/** 회원가입 4스텝 흐름 */
export function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
          회원가입
        </h1>

        {/* 스텝 인디케이터 */}
        <ol className="mt-8 flex items-center justify-center">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = n < step
            const active = n === step
            return (
              <li key={label} className="flex items-center">
                <button
                  type="button"
                  onClick={() => done && setStep(n)}
                  className={cn('flex flex-col items-center gap-1.5', done && 'cursor-pointer')}
                >
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full text-base font-bold transition-colors',
                      active && 'bg-cobalt-600 text-white',
                      done && 'bg-cobalt-100 text-cobalt-700',
                      !active && !done && 'bg-slate-100 text-slate-400',
                    )}
                  >
                    {done ? <Check className="size-4.5" /> : n}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium whitespace-nowrap',
                      active ? 'text-cobalt-700' : 'text-slate-400',
                    )}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className={cn('mx-2 mb-5 h-px w-10 sm:w-16', done ? 'bg-cobalt-300' : 'bg-slate-200')} />
                )}
              </li>
            )
          })}
        </ol>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          {step === 1 && <StepAgree onNext={() => setStep(2)} />}
          {step === 2 && <StepAuth onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
          {step === 3 && <StepInfo onNext={() => setStep(4)} onPrev={() => setStep(2)} />}
          {step === 4 && <StepDone onLogin={() => navigate('/login')} />}
        </div>
      </div>
    </Container>
  )
}

function StepAgree({ onNext }: { onNext: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const allChecked = AGREEMENTS.every((a) => checked[a.id])
  const requiredOk = AGREEMENTS.filter((a) => a.required).every((a) => checked[a.id])

  const toggleAll = () => {
    const next = !allChecked
    setChecked(Object.fromEntries(AGREEMENTS.map((a) => [a.id, next])))
  }

  return (
    <>
      <p className="text-lg font-bold text-slate-900">약관에 동의해 주세요</p>

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-cobalt-200 bg-cobalt-50/60 px-4 py-3.5">
        <input type="checkbox" checked={allChecked} onChange={toggleAll} className="size-5 accent-cobalt-600" />
        <span className="text-base font-bold text-slate-900">전체 동의</span>
      </label>

      <ul className="mt-3 divide-y divide-slate-200">
        {AGREEMENTS.map((a) => (
          <li key={a.id}>
            <div className="flex items-center gap-2.5 py-3">
              <input
                type="checkbox"
                checked={!!checked[a.id]}
                onChange={(e) => setChecked((p) => ({ ...p, [a.id]: e.target.checked }))}
                className="size-4.5 accent-cobalt-600"
              />
              <span className="flex-1 text-base text-slate-700">
                {a.label}{' '}
                <span className={a.required ? 'text-cobalt-600' : 'text-slate-400'}>
                  ({a.required ? '필수' : '선택'})
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpenId(openId === a.id ? null : a.id)}
                className="text-slate-400 transition-colors hover:text-slate-700"
                aria-label="약관 보기"
              >
                <ChevronDown className={cn('size-5 transition-transform', openId === a.id && 'rotate-180')} />
              </button>
            </div>
            {openId === a.id && (
              <p className="mb-3 rounded-lg bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-500">
                {a.label} 전문입니다. 본 약관은 포털 서비스 이용에 관한 조건을 규정하며, 자세한 내용은 이용안내에서 확인할 수 있습니다.
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <Button disabled={!requiredOk} onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  )
}

function StepAuth({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [verified, setVerified] = useState(false)

  return (
    <>
      <p className="text-lg font-bold text-slate-900">본인인증</p>
      <p className="mt-1.5 text-base text-slate-500">카카오 본인인증으로 가입을 진행합니다.</p>

      <div className="mt-6 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 py-10">
        <span
          className={cn(
            'flex size-16 items-center justify-center rounded-2xl transition-colors',
            verified ? 'bg-green-100 text-green-600' : 'bg-[#FEE500] text-black/85',
          )}
        >
          {verified ? <Check className="size-8" /> : <KakaoIcon className="size-8" />}
        </span>
        <p className="mt-4 text-base font-semibold text-slate-700">
          {verified ? '본인인증이 완료되었습니다' : '카카오톡으로 본인인증을 진행하세요'}
        </p>
        {!verified && <KakaoAuthButton className="mt-5" onClick={() => setVerified(true)} />}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          이전
        </Button>
        <Button disabled={!verified} onClick={onNext}>
          다음
        </Button>
      </div>
    </>
  )
}

function StepInfo({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <>
      <p className="text-lg font-bold text-slate-900">회원정보 입력</p>

      <div className="mt-5 space-y-4">
        <div>
          <span className="text-sm font-semibold text-slate-700">
            아이디 <span className="text-red-500">*</span>
          </span>
          <div className="mt-1.5 flex gap-2">
            <input
              placeholder="아이디 입력"
              className="h-11 flex-1 rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
            />
            <Button variant="secondary" className="shrink-0">
              중복확인
            </Button>
          </div>
          <p className="mt-1 text-xs text-green-600">사용 가능한 아이디입니다.</p>
        </div>

        <Field label="비밀번호" required type="password" placeholder="영문·숫자·특수문자 8자 이상" hint="영문, 숫자, 특수문자를 조합해 8자 이상 입력하세요." />
        <Field label="비밀번호 확인" required type="password" placeholder="비밀번호 재입력" />
        <Field label="이름" required placeholder="이름 입력" />
        <Field label="소속 기관" required placeholder="예: 한국AI연구소" />
        <Field label="연락처" placeholder="010-0000-0000" />
        <Field label="이메일" required type="email" placeholder="name@example.com" />
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          이전
        </Button>
        <Button onClick={onNext}>가입 완료</Button>
      </div>
    </>
  )
}

function Field({
  label,
  required,
  type = 'text',
  placeholder,
  hint,
}: {
  label: string
  required?: boolean
  type?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

function StepDone({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <PartyPopper className="size-8" />
      </span>
      <p className="mt-5 text-xl font-extrabold text-slate-900">회원가입이 완료되었습니다</p>
      <p className="mt-2 text-base text-slate-500">
        로그인 후 학습데이터 검색과 워크스페이스를 이용할 수 있습니다.
      </p>
      <div className="mt-7 flex gap-2.5">
        <Button onClick={onLogin}>로그인하기</Button>
        <Link to="/">
          <Button variant="secondary">메인으로</Button>
        </Link>
      </div>
    </div>
  )
}
