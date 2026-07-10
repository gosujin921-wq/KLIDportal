import { TriangleAlert, UploadCloud } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { uploads } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'

/** 업로드 영상: 업로드 폼 + 업로드 현황 */
export function UploadPage() {
  return (
    <>
      <Breadcrumb items={[{ label: '워크스페이스', to: '/workspace' }, { label: '업로드 영상' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">업로드 영상</h1>
      <p className="mt-1.5 text-base text-slate-500">
        보유한 CCTV 영상을 업로드하고 저작도구에서 학습데이터로 가공하세요.
      </p>

      {/* 개인정보 금지 안내 (상시 노출) */}
      <p className="mt-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
        <TriangleAlert className="mt-0.5 size-4.5 shrink-0" />
        개인정보(얼굴·차량번호 등)가 포함된 영상은 업로드할 수 없습니다. 업로드된 영상은 관리자
        검토 후 정책 위반 시 삭제될 수 있습니다.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        {/* 드롭존 */}
        <button
          type="button"
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-14 text-center transition-colors hover:border-cobalt-400 hover:bg-cobalt-50/40 lg:col-span-3"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-cobalt-50 text-cobalt-600">
            <UploadCloud className="size-7" />
          </span>
          <p className="mt-4 text-lg font-bold text-slate-800">
            파일을 끌어다 놓거나 클릭하여 선택
          </p>
          <p className="mt-1.5 text-sm text-slate-400">mp4 · avi 형식, 파일당 최대 2GB</p>
        </button>

        {/* 영상 정보 폼 */}
        <form className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <p className="text-base font-bold text-slate-900">영상 정보</p>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              제목 <span className="text-red-500">*</span>
            </span>
            <input
              placeholder="예: CCTV-강남대로-005"
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
            />
          </label>
          <label className="mt-3.5 block">
            <span className="text-sm font-semibold text-slate-700">
              이벤트 유형 <span className="text-red-500">*</span>
            </span>
            <select
              defaultValue=""
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-700 focus:border-cobalt-400 focus:outline-none"
            >
              <option value="" disabled>
                선택하세요
              </option>
              {EVENT_TYPES_MAIN.map((t) => (
                <option key={t.key}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="mt-3.5 block">
            <span className="text-sm font-semibold text-slate-700">촬영일</span>
            <input
              type="date"
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-base text-slate-700 focus:border-cobalt-400 focus:outline-none"
            />
          </label>
          <Button type="button" className="mt-5 w-full">
            업로드
          </Button>
        </form>
      </div>

      {/* 업로드 현황 */}
      <section className="mt-9">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">업로드 현황</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">영상</th>
                <th className="px-3 py-3 font-medium">유형</th>
                <th className="px-3 py-3 font-medium">상태</th>
                <th className="px-3 py-3 font-medium">업로드일</th>
                <th className="px-5 py-3 font-medium">보관 기한</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="text-base font-semibold text-slate-800">{u.title}</p>
                    <p className="font-mono text-sm text-slate-400">
                      {u.fileName} · {u.sizeMb} MB
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    <EventBadge type={u.type} />
                  </td>
                  <td className="px-3 py-3.5">
                    {u.status === 'inProgress' && u.progress !== undefined ? (
                      <div className="flex w-36 items-center gap-2.5">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-cobalt-500"
                            style={{ width: `${u.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-cobalt-700 tabular-nums">
                          {u.progress}%
                        </span>
                      </div>
                    ) : (
                      <StatusBadge status={u.status} />
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {formatDate(u.uploadedAt)}
                  </td>
                  <td className="px-5 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {u.expireLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
