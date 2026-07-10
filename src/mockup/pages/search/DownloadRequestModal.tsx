import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Info } from 'lucide-react'
import { Modal } from '@/mockup/components/ui/Modal'
import { Button } from '@/mockup/components/ui/Button'
import { EventBadge } from '@/mockup/components/ui/badges'
import { zipParts, type Dataset } from '@/mockup/mocks/datasets'
import { formatNumber } from '@/lib/format'

// 활용 목적 (REQ-007: 학술 연구·기업 R&D·공공 프로젝트 등)
const PURPOSES = ['학술 연구', '기업 R&D', '공공 프로젝트', '기타']
const PLAN_MAX = 200

/** 다운로드 신청 모달. 신청 → 완료 상태 전환, 완료 화면에서 워크스페이스로 연결. */
export function DownloadRequestModal({
  open,
  onClose,
  dataset,
}: {
  open: boolean
  onClose: () => void
  dataset: Dataset
}) {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('')
  const [plan, setPlan] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const close = () => {
    onClose()
    // 다음 열림 대비 초기화 (전환 애니메이션 후)
    setTimeout(() => {
      setSubmitted(false)
      setPurpose('')
      setPlan('')
      setAgreed(false)
    }, 300)
  }

  return (
    <Modal open={open} onClose={close} title={submitted ? '신청 완료' : '다운로드 신청'}>
      {submitted ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="size-14 text-green-500" strokeWidth={1.6} />
          <p className="mt-4 text-xl font-bold text-slate-900">다운로드 신청이 접수되었습니다</p>
          <p className="mt-2 text-base text-slate-500">
            처리 상태는 워크스페이스에서 확인할 수 있습니다.
          </p>
          <div className="mt-7 flex gap-2.5">
            <Button onClick={() => navigate('/workspace')}>워크스페이스로 이동</Button>
            <Button variant="secondary" onClick={close}>
              계속 탐색하기
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          {/* 요청 요약 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <EventBadge type={dataset.type} />
              <p className="truncate text-base font-bold text-slate-900">{dataset.title}</p>
            </div>
            <p className="mt-2 text-sm text-slate-500 tabular-nums">
              영상 {formatNumber(dataset.videoCount)}건 · 이미지{' '}
              {formatNumber(dataset.imageCount)}장 · {dataset.sizeGb} GB
            </p>
            {zipParts(dataset.sizeGb) > 1 && (
              <p className="mt-1.5 text-sm text-cobalt-700">
                대용량 데이터로 ZIP {zipParts(dataset.sizeGb)}개로 분할 제공되며 이어받기를 지원합니다.
              </p>
            )}
          </div>

          {/* 활용 목적 */}
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-800">
              활용 목적 <span className="text-red-500">*</span>
            </span>
            <select
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-800 focus:border-cobalt-400 focus:outline-none"
            >
              <option value="" disabled>
                선택하세요
              </option>
              {PURPOSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>

          {/* 활용 계획 (카운터: textarea 내부 우하단) */}
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-800">활용 계획</span>
            <div className="relative mt-1.5">
              <textarea
                value={plan}
                maxLength={PLAN_MAX}
                onChange={(e) => setPlan(e.target.value)}
                rows={4}
                placeholder="데이터 활용 계획을 간단히 입력해 주세요"
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pb-7 text-base text-slate-800 placeholder:text-slate-400 focus:border-cobalt-400 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-3 bottom-3 font-mono text-xs text-slate-400 tabular-nums">
                {plan.length}/{PLAN_MAX}
              </span>
            </div>
          </label>

          {/* 약관 동의 */}
          <label className="mt-4 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="size-4 accent-cobalt-600"
            />
            <span className="text-sm text-slate-700">
              데이터 이용약관에 동의합니다{' '}
              <button type="button" className="text-cobalt-600 underline underline-offset-2">
                보기
              </button>
            </span>
          </label>

          {/* 기한 안내 */}
          <p className="mt-4 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
            <Info className="mt-0.5 size-4 shrink-0" />
            승인 완료 후 7일 이내 다운로드해야 하며, 기한 경과 시 재신청이 필요합니다.
          </p>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={!purpose || !agreed}>
              신청하기
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
