import { Select } from '@/mockup/components/ui/Select'

/** 이용약관·개인정보처리방침 문서 뷰어 (목차 + 본문) */

const TERMS_SECTIONS = [
  { id: 'ch1', title: '제1장 총칙', body: '이 약관은 AI 영상학습 사용자 포털(이하 "포털")이 제공하는 학습데이터 검색·다운로드 및 데이터 제작 서비스의 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.' },
  { id: 'ch2', title: '제2장 서비스 이용', body: '이용자는 포털이 제공하는 학습데이터를 활용 목적에 맞게 사용해야 하며, 다운로드한 데이터는 승인된 목적 범위 내에서만 활용할 수 있습니다. 데이터의 재배포·재판매는 금지됩니다.' },
  { id: 'ch3', title: '제3장 데이터 업로드', body: '이용자가 업로드하는 영상에는 얼굴·차량번호 등 개인정보가 포함되어서는 안 됩니다. 업로드된 자료는 유효기간이 경과하면 자동으로 삭제됩니다.' },
  { id: 'ch4', title: '제4장 책임과 의무', body: '포털은 안정적인 서비스 제공을 위해 노력하며, 이용자는 관계 법령과 이 약관을 준수할 의무가 있습니다.' },
  { id: 'ch5', title: '제5장 기타', body: '이 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.' },
]

const PRIVACY_SECTIONS = [
  { id: 'p1', title: '1. 수집하는 개인정보 항목', body: '포털은 회원가입 및 서비스 제공을 위해 아이디, 비밀번호, 이름, 소속, 연락처, 이메일을 수집합니다.' },
  { id: 'p2', title: '2. 개인정보의 수집·이용 목적', body: '수집한 개인정보는 회원 관리, 서비스 제공, 데이터 다운로드 승인 및 이용 내역 관리를 위해 이용됩니다.' },
  { id: 'p3', title: '3. 개인정보의 보유·이용 기간', body: '회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관합니다.' },
  { id: 'p4', title: '4. 개인정보의 제3자 제공', body: '포털은 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.' },
  { id: 'p5', title: '5. 이용자의 권리', body: '이용자는 언제든지 자신의 개인정보를 조회·수정·삭제할 수 있으며, 회원 정보 관리에서 처리할 수 있습니다.' },
]

export function DocumentPage({ kind }: { kind: 'terms' | 'privacy' }) {
  const sections = kind === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS
  const title = kind === 'terms' ? '이용약관' : '개인정보처리방침'

  return (
    <div className="flex gap-8">
      {/* 목차 */}
      <nav className="sticky top-24 hidden h-fit w-52 shrink-0 lg:block">
        <p className="mb-3 text-sm font-bold text-slate-400">목차</p>
        <ul className="space-y-1 border-l border-slate-200">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-sm text-slate-500 transition-colors hover:border-cobalt-400 hover:text-cobalt-700"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 본문 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">시행일: 2026.07.01</p>
          </div>
          <Select aria-label="개정 이력" className="text-slate-600">
            <option>2026.07.01 (현행)</option>
            <option>2025.09.01</option>
          </Select>
        </div>

        <div className="mt-2 divide-y divide-slate-200">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 py-6">
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
