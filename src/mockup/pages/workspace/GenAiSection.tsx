import { useState } from 'react'
import { Download, ImagePlus, Sparkles } from 'lucide-react'
import { Button } from '@/mockup/components/ui/Button'
import { DatasetThumb } from '@/mockup/components/DatasetThumb'
import { EventBadge, StatusBadge } from '@/mockup/components/ui/badges'
import { EVENT_TYPES_MAIN } from '@/components/domain/eventTypes'
import { genAiJobs } from '@/mockup/mocks/workspace'
import { formatDate } from '@/lib/datetime'
import { cn } from '@/lib/cn'

const LENGTHS = ['5초', '10초']
const DESC_MAX = 150

/** 생성형 AI 영상 생성 (기획 v2: 데이터 증강 메뉴에 통합된 섹션, DFEAT-053) */
export function GenAiSection() {
  const [length, setLength] = useState('5초')
  const [desc, setDesc] = useState('')

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-slate-500">
          이미지 한 장으로 재난 상황 학습용 영상을 생성합니다.
        </p>
        {/* 일일 사용량 제한 (REQ-033) */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-right">
          <p className="text-xs font-medium text-slate-400">오늘 생성</p>
          <p className="text-base font-bold text-slate-800 tabular-nums">
            <span className="text-cobalt-700">2</span> / 5회
          </p>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-5">
        {/* 입력 */}
        <form className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <p className="text-base font-bold text-slate-900">영상 생성 요청</p>

          <button
            type="button"
            className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-9 transition-colors hover:border-cobalt-400 hover:bg-cobalt-50/40"
          >
            <ImagePlus className="size-7 text-slate-400" />
            <p className="mt-2.5 text-sm font-semibold text-slate-600">기준 이미지 업로드</p>
            <p className="mt-0.5 text-xs text-slate-400">jpg · png, 최대 20MB</p>
          </button>

          <label className="mt-4 block">
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

          <div className="mt-4">
            <span className="text-sm font-semibold text-slate-700">영상 길이</span>
            <div className="mt-1.5 inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
              {LENGTHS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLength(l)}
                  className={cn(
                    'rounded-full px-4.5 py-1.5 text-sm font-semibold transition-colors',
                    l === length ? 'bg-cobalt-600 text-white' : 'text-slate-600 hover:text-slate-900',
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700">상황 설명</span>
            <div className="relative mt-1.5">
              <textarea
                value={desc}
                maxLength={DESC_MAX}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="예: 폭우로 교차로가 서서히 잠기는 상황"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 pb-7 text-base placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 bottom-3 font-mono text-xs text-slate-400 tabular-nums">
                {desc.length}/{DESC_MAX}
              </span>
            </div>
          </label>

          <Button type="button" className="mt-4 w-full">
            <Sparkles className="size-4" />
            영상 생성 요청
          </Button>
        </form>

        {/* 결과 */}
        <div className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {genAiJobs.map((j) => (
              <div
                key={j.id}
                className="card-soft overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <DatasetThumb type={j.type} showPlay={j.status === 'done'} />
                <div className="p-4">
                  <div className="flex items-center gap-1.5">
                    <EventBadge type={j.type} />
                    <StatusBadge status={j.status} />
                  </div>
                  <p className="mt-2 line-clamp-1 text-base font-bold text-slate-900">{j.title}</p>
                  <p className="mt-1 text-sm text-slate-400 tabular-nums">
                    {j.length} · {formatDate(j.requestedAt)} 요청
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    {j.expireLabel ? (
                      <span className="text-sm text-slate-500 tabular-nums">{j.expireLabel}</span>
                    ) : (
                      <span className="text-sm text-slate-300">-</span>
                    )}
                    <Button size="sm" className="h-8 px-3.5 text-sm" disabled={j.status !== 'done'}>
                      <Download className="size-3.5" />
                      다운로드
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
