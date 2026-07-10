import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { demoUser } from '@/mockup/mocks/workspace'

/** 회원 정보 관리 (진입 시 비밀번호 재확인 게이트) */
export function AccountPage() {
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return (
      <>
        <Breadcrumb items={[{ label: '마이페이지', to: '/mypage' }, { label: '회원 정보 관리' }]} />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">회원 정보 관리</h1>

        <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-cobalt-50 text-cobalt-600">
            <Lock className="size-7" />
          </span>
          <p className="mt-4 text-lg font-bold text-slate-900">비밀번호를 다시 확인해 주세요</p>
          <p className="mt-1.5 text-sm text-slate-500">
            회원 정보 보호를 위해 비밀번호를 한 번 더 입력합니다.
          </p>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="mt-5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
          />
          <Button className="mt-4 w-full" onClick={() => setUnlocked(true)}>
            확인
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: '마이페이지', to: '/mypage' }, { label: '회원 정보 관리' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">회원 정보 관리</h1>

      <form className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-base font-bold text-slate-900">기본 정보</p>
        <div className="mt-4 space-y-4">
          <ReadonlyField label="아이디" value="ai_kim2026" />
          <EditField label="이름" defaultValue={demoUser.name} />
          <EditField label="소속 기관" defaultValue={demoUser.org} />
          <EditField label="연락처" defaultValue="010-1234-5678" />
          <EditField label="이메일" defaultValue={demoUser.email} />
        </div>

        <p className="mt-8 text-base font-bold text-slate-900">비밀번호 변경</p>
        <div className="mt-4 space-y-4">
          <EditField label="현재 비밀번호" type="password" placeholder="현재 비밀번호" />
          <EditField label="새 비밀번호" type="password" placeholder="영문·숫자·특수문자 8자 이상" />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button">변경 사항 저장</Button>
        </div>
      </form>

      <div className="mt-4 max-w-2xl text-right">
        <button type="button" className="text-sm text-slate-400 underline underline-offset-2 hover:text-slate-600">
          회원 탈퇴
        </button>
      </div>
    </>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <p className="mt-1.5 flex h-11 items-center rounded-lg bg-slate-50 px-3.5 text-base text-slate-500">
        {value}
      </p>
    </div>
  )
}

function EditField({
  label,
  defaultValue,
  type = 'text',
  placeholder,
}: {
  label: string
  defaultValue?: string
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
      />
    </label>
  )
}
