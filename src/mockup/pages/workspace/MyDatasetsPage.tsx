import { Download } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { myDatasets } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'
import { formatNumber } from '@/lib/format'

/** 내 학습데이터: 저작 완료 결과물 목록 */
export function MyDatasetsPage() {
  return (
    <>
      <Breadcrumb
        items={[{ label: '워크스페이스', to: '/workspace' }, { label: '내 학습데이터' }]}
      />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">내 학습데이터</h1>
      <p className="mt-1.5 text-base text-slate-500">
        저작도구로 만든 학습데이터입니다. 보관 기한 내에 다운로드하세요.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-400">
              <th className="px-5 py-3 font-medium">데이터명</th>
              <th className="px-3 py-3 font-medium">이벤트</th>
              <th className="px-3 py-3 text-right font-medium">프레임</th>
              <th className="px-3 py-3 text-right font-medium">객체</th>
              <th className="px-3 py-3 font-medium">완료일</th>
              <th className="px-3 py-3 font-medium">상태</th>
              <th className="px-3 py-3 font-medium">보관 기한</th>
              <th className="px-5 py-3 text-right font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {myDatasets.map((d) => {
              const downloadable = d.status === 'done' || d.status === 'expiring'
              return (
                <tr key={d.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5 text-base font-semibold text-slate-800">{d.title}</td>
                  <td className="px-3 py-3.5">
                    <EventBadge type={d.type} />
                  </td>
                  <td className="px-3 py-3.5 text-right text-base text-slate-600 tabular-nums">
                    {formatNumber(d.frames)}
                  </td>
                  <td className="px-3 py-3.5 text-right text-base text-slate-600 tabular-nums">
                    {formatNumber(d.objects)}
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {formatDate(d.finishedAt)}
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap tabular-nums">
                    <span
                      className={
                        d.status === 'expiring'
                          ? 'font-semibold text-amber-600'
                          : d.status === 'expired'
                            ? 'text-slate-400'
                            : 'text-slate-600'
                      }
                    >
                      {d.expireLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <Button size="sm" className="h-8 px-3.5 text-sm" disabled={!downloadable}>
                      <Download className="size-3.5" />
                      다운로드
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
