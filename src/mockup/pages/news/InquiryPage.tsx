import { useState } from 'react'
import { Select } from '@/mockup/components/ui/Select'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/datetime'

const INQUIRY_TYPES = ['데이터 이용', '저작도구', 'AI 기능', '회원·계정', '기타']
const CONTENT_MAX = 500

const myInquiries = [
  { id: 3, type: '데이터 이용', title: '다운로드 승인 소요 기간 문의', date: '2026-07-07', status: 'done' as const },
  { id: 2, type: '저작도구', title: '폴리곤 라벨 저장 오류 문의', date: '2026-07-02', status: 'reviewing' as const },
  { id: 1, type: 'AI 기능', title: '증강 배수별 결과 차이 문의', date: '2026-06-24', status: 'done' as const },
]

/** 문의하기: 작성 / 내 문의 내부 탭 (로그인 필요 화면) */
export function InquiryPage() {
  const [tab, setTab] = useState<'write' | 'list'>('write')
  const [content, setContent] = useState('')

  return (
    <>
      <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
        {(
          [
            ['write', '문의 작성'],
            ['list', '내 문의 내역'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'rounded-full px-5 py-1.5 text-base font-semibold transition-colors',
              tab === key ? 'bg-white text-cobalt-700 shadow-sm' : 'text-slate-500 hover:text-slate-800',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'write' ? (
        <form className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              문의 유형 <span className="text-red-500">*</span>
            </span>
            <Select defaultValue="" wrapperClassName="mt-1.5 w-full" className="h-11 w-full text-base">
              <option value="" disabled>
                선택하세요
              </option>
              {INQUIRY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              제목 <span className="text-red-500">*</span>
            </span>
            <input
              placeholder="제목을 입력하세요"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3.5 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              내용 <span className="text-red-500">*</span>
            </span>
            <div className="relative mt-1.5">
              <textarea
                value={content}
                maxLength={CONTENT_MAX}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="문의 내용을 자세히 입력해 주세요"
                className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-3 pb-8 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3.5 bottom-3 font-mono text-xs text-slate-400 tabular-nums">
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
          </label>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="rounded-full bg-cobalt-600 px-6 py-2.5 text-base font-semibold text-white transition-colors hover:bg-cobalt-700"
            >
              문의 등록
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="w-32 px-5 py-3 font-medium">유형</th>
                <th className="px-3 py-3 font-medium">제목</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">등록일</th>
                <th className="px-5 py-3 font-medium whitespace-nowrap">상태</th>
              </tr>
            </thead>
            <tbody>
              {myInquiries.map((q) => (
                <tr
                  key={q.id}
                  className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
                >
                  <td className="px-5 py-3.5 text-sm text-slate-500">{q.type}</td>
                  <td className="px-3 py-3.5 font-medium text-slate-800">{q.title}</td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {formatDate(q.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        q.status === 'done'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-cobalt-50 text-cobalt-700',
                      )}
                    >
                      {q.status === 'done' ? '답변완료' : '접수'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
