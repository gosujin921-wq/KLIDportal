import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Megaphone, X } from 'lucide-react'
import { noticePosts } from '@/mockup/mocks/news'
import { formatDate } from '@/lib/datetime'

const DISMISS_KEY = 'popupNoticeDismissed'

/**
 * 메인 진입 시 팝업 공지 (기획 v2, DFEAT-055).
 * 관리자가 팝업 설정한 공지를 이미지 배너형 모달로 표시. "오늘 하루 안 보기" 지원.
 * 목업: 세션 1회 노출(sessionStorage), 배너 이미지는 그라데이션 placeholder.
 */
export function PopupNoticeModal() {
  const notice = noticePosts.find((n) => n.popup)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (notice && !sessionStorage.getItem(DISMISS_KEY)) setOpen(true)
  }, [notice])

  if (!notice || !open) return null

  const close = (dismissToday: boolean) => {
    if (dismissToday) sessionStorage.setItem(DISMISS_KEY, '1')
    setOpen(false)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/45" onClick={() => close(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="팝업 공지"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={() => close(false)}
          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-lg bg-slate-900/30 text-white transition-colors hover:bg-slate-900/50"
        >
          <X className="size-5" />
        </button>

        {/* 배너 이미지 (목업 placeholder) */}
        <Link to="/news/notices" onClick={() => close(false)} className="block">
          <div className="band-cobalt relative flex aspect-[4/3] flex-col justify-end p-6">
            <div aria-hidden className="band-dots absolute inset-0" />
            <Megaphone className="relative size-9 text-white/80" />
            <p className="relative mt-3 text-xl leading-snug font-extrabold text-white">
              {notice.title}
            </p>
            <p className="relative mt-1.5 text-sm text-white/70 tabular-nums">
              {formatDate(notice.date)}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between px-5 py-3.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              className="size-4 accent-cobalt-600"
              onChange={(e) => e.target.checked && close(true)}
            />
            오늘 하루 안 보기
          </label>
          <Link
            to="/news/notices"
            onClick={() => close(false)}
            className="text-sm font-semibold text-cobalt-600 hover:underline"
          >
            자세히 보기
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
