import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Download } from 'lucide-react'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { Button } from '@/mockup/components/ui/Button'
import { Select } from '@/mockup/components/ui/Select'
import { StatusBadge } from '@/mockup/components/ui/badges'
import { augmentConditions } from '@/mockup/mocks/landing'
import { useDemoWorkspace } from '@/mockup/demoWorkspace'
import { formatDate } from '@/lib/datetime'
import { cn } from '@/lib/cn'

const MULTIPLES = ['2배', '4배', '8배']

/**
 * 데이터 증강 (기획 v2: 시간·계절·날씨 조건 반영 증강 실행 + 증강 이력).
 */
export function AugmentPage() {
  const { augmentSources, augmentJobs, runAugment } = useDemoWorkspace()
  const [multiple, setMultiple] = useState('2배')
  const [sourceId, setSourceId] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [requested, setRequested] = useState(false)

  const toggleOption = (c: string) =>
    setOptions((prev) => (prev.includes(c) ? prev.filter((o) => o !== c) : [...prev, c]))

  return (
    <>
      <Breadcrumb items={[{ label: '워크스페이스', to: '/workspace' }, { label: '데이터 증강' }]} />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">데이터 증강</h1>
      <p className="mt-1.5 text-base text-slate-500">
        시간·계절·날씨 조건을 반영해 학습데이터를 다양하게 늘려 보세요.
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-5">
        {/* 증강 설정 */}
        <form
          className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3"
          onSubmit={(e) => {
            e.preventDefault()
            const src = augmentSources.find((s) => s.id === sourceId)
            if (!src) return
            runAugment({ sourceTitle: src.title, sourceType: src.type, options, multiple })
            setRequested(true)
          }}
        >
          <p className="text-base font-bold text-slate-900">증강 실행</p>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">
              원본 데이터 <span className="text-red-500">*</span>
            </span>
            <Select
              value={sourceId}
              onChange={setSourceId}
              wrapperClassName="mt-1.5 w-full"
              className="h-11 w-full text-base"
            >
              <option value="" disabled>
                반출 데이터·저작 결과물에서 선택하세요
              </option>
              {augmentSources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.origin} · {s.title}
                </option>
              ))}
            </Select>
          </label>

          <div className="mt-4">
            <span className="text-sm font-semibold text-slate-700">증강 배수</span>
            <div className="mt-1.5 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
              {MULTIPLES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMultiple(m)}
                  className={cn(
                    'rounded-full px-4.5 py-1.5 text-sm font-semibold transition-colors',
                    m === multiple ? 'bg-cobalt-600 text-white' : 'text-slate-600 hover:text-slate-900',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm font-semibold text-slate-700">증강 조건</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {augmentConditions.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors has-checked:border-cobalt-300 has-checked:bg-cobalt-50 has-checked:text-cobalt-700"
                >
                  <input
                    type="checkbox"
                    checked={options.includes(c)}
                    onChange={() => toggleOption(c)}
                    className="size-4 accent-cobalt-600"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {requested && (
            <p className="mt-4 flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm text-green-700">
              <CheckCircle2 className="size-4 shrink-0" />
              증강 작업이 시작되었습니다.{' '}
              <Link to="/workspace" className="font-semibold underline underline-offset-2">
                대시보드에서 진행 상황 보기
              </Link>
            </p>
          )}

          <Button type="submit" className="mt-5" disabled={!sourceId}>
            증강 실행
          </Button>
        </form>

        {/* 일일 사용량·기여도 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <p className="text-base font-bold text-slate-900">오늘 사용량</p>

          {/* 일일 제한 (REQ-033) */}
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-slate-500">증강 실행</span>
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                <strong className="text-lg text-cobalt-700">4</strong> / 10회
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-cobalt-500" style={{ width: '40%' }} />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              하루 최대 사용량은 기여도 등급에 따라 늘어납니다.
            </p>
          </div>

          <dl className="mt-5 space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-end justify-between">
              <dt className="text-sm text-slate-500">이번 달 누적 증강</dt>
              <dd className="text-xl font-extrabold text-slate-900 tabular-nums">
                12<span className="text-sm font-bold text-slate-400">회</span>
              </dd>
            </div>
            <div className="flex items-end justify-between">
              <dt className="text-sm text-slate-500">
                데이터 기여도 <span className="text-slate-400">(사용권한 기준)</span>
              </dt>
              <dd className="text-xl font-extrabold text-gradient-cobalt tabular-nums">340점</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            기여도가 높을수록 일일 사용 한도가 확대됩니다.
          </p>
        </div>
      </div>

      {/* 증강 이력 */}
      <section className="mt-9">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">증강 이력</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-400">
                <th className="px-5 py-3 font-medium">원본 데이터</th>
                <th className="px-3 py-3 font-medium">조건</th>
                <th className="px-3 py-3 font-medium">배수</th>
                <th className="px-3 py-3 font-medium">상태</th>
                <th className="px-3 py-3 font-medium">요청일</th>
                <th className="px-5 py-3 text-right font-medium">결과</th>
              </tr>
            </thead>
            <tbody>
              {augmentJobs.map((j) => (
                <tr key={j.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3.5 text-base font-semibold text-slate-800">{j.source}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600">{j.options.join(' · ')}</td>
                  <td className="px-3 py-3.5 text-sm text-slate-600 tabular-nums">{j.multiple}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-3 py-3.5 text-sm whitespace-nowrap text-slate-500 tabular-nums">
                    {formatDate(j.requestedAt)}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {j.status === 'done' ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-sm text-slate-500 tabular-nums">{j.expireLabel}</span>
                        <Button size="sm" className="h-8 px-3.5 text-sm">
                          <Download className="size-3.5" />
                          다운로드
                        </Button>
                      </span>
                    ) : (
                      <span className="text-sm text-slate-300">-</span>
                    )}
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
