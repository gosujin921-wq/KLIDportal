import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS Pagination 스펙 이식. prev/next + 번호 + 말줄임(...) 로직 유지.
 * 글리프(« ‹ › »)는 lucide 아이콘으로 대체(컨벤션). aria-current/aria-label 유지.
 */
interface PaginationProps {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  siblingCount?: number
  showFirstLast?: boolean
  className?: string
}

const btnBase = cn(
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-600/40 focus-visible:ring-offset-2',
)

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange?.(page)
  }

  const getPages = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    const left = Math.max(1, currentPage - siblingCount)
    const right = Math.min(totalPages, currentPage + siblingCount)

    for (let i = left; i <= right; i++) pages.push(i)

    if (left > 2) pages.unshift('...')
    if (left > 1) pages.unshift(1)
    if (right < totalPages - 1) pages.push('...')
    if (right < totalPages) pages.push(totalPages)

    return pages
  }

  const navClass = cn(
    btnBase,
    'border-slate-300 bg-white font-semibold text-slate-600',
    'hover:not-disabled:border-slate-400 hover:not-disabled:bg-slate-100',
    'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400',
  )

  return (
    <nav className={cn('inline-flex items-center gap-1', className)} aria-label="페이지 이동">
      {showFirstLast && (
        <button
          type="button"
          className={navClass}
          onClick={() => goTo(1)}
          disabled={currentPage === 1}
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="size-4" />
        </button>
      )}
      <button
        type="button"
        className={navClass}
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="size-4" />
      </button>

      {getPages().map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 min-w-9 select-none items-center justify-center text-sm text-slate-600"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={cn(
              btnBase,
              currentPage === page
                ? 'pointer-events-none border-cobalt-600 bg-cobalt-600 font-bold text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-100',
            )}
            onClick={() => goTo(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`${page} 페이지`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className={navClass}
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight className="size-4" />
      </button>
      {showFirstLast && (
        <button
          type="button"
          className={navClass}
          onClick={() => goTo(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="size-4" />
        </button>
      )}
    </nav>
  )
}
