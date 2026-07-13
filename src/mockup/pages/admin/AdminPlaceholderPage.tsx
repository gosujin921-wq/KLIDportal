import { Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'

/** 관리자 나머지 메뉴 골격 (목록형 CRUD 패턴 placeholder) */
export function AdminPlaceholderPage({
  title,
  desc,
  withExcel = false,
}: {
  title: string
  desc: string
  withExcel?: boolean
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1.5 text-base text-slate-500">{desc}</p>
        </div>
        {withExcel && (
          <Button variant="secondary">
            <FileSpreadsheet className="size-4.5" />
            엑셀 내보내기
          </Button>
        )}
      </div>

      {/* 필터 바 골격 */}
      <div className="mt-6 flex gap-2.5">
        <div className="h-10 w-64 rounded-lg border border-slate-200 bg-white" />
        <div className="h-10 w-32 rounded-lg border border-slate-200 bg-white" />
        <div className="h-10 w-24 rounded-lg bg-cobalt-600" />
      </div>

      {/* 테이블 골격 */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3">
          <div className="flex gap-6">
            {['항목', '상태', '등록일', '관리'].map((h) => (
              <span key={h} className="text-sm font-medium text-slate-400">
                {h}
              </span>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-slate-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-4 flex-1 rounded bg-slate-100" style={{ maxWidth: `${60 - i * 4}%` }} />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
              <Download className="size-4 text-slate-200" />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-sm text-slate-400">
        상세 화면은 다음 단계에서 디자인됩니다.
      </p>
    </>
  )
}
