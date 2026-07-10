import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const COLUMNS: { title: string; to?: string; items: { label: string; to: string }[] }[] = [
  {
    title: '학습데이터',
    to: '/search',
    items: [{ label: '데이터 검색', to: '/search' }],
  },
  {
    title: '워크스페이스',
    to: '/workspace',
    items: [
      { label: '대시보드', to: '/workspace' },
      { label: '업로드 영상', to: '/workspace/upload' },
      { label: '저작도구', to: '/workspace/authoring' },
      { label: '내 학습데이터', to: '/workspace/datasets' },
      { label: '데이터 증강', to: '/workspace/augment' },
      { label: '즐겨찾기', to: '/workspace/favorites' },
    ],
  },
  {
    title: '소식&참여',
    to: '/news',
    items: [
      { label: '데이터 현황', to: '/news' },
      { label: '공지사항', to: '/news/notices' },
      { label: 'FAQ', to: '/news/faq' },
      { label: '문의하기', to: '/news/inquiry' },
      { label: '활용사례', to: '/news/cases' },
    ],
  },
  {
    title: '이용안내',
    to: '/guide',
    items: [
      { label: '서비스 소개', to: '/guide' },
      { label: '이용 가이드', to: '/guide/how' },
    ],
  },
  {
    title: '마이페이지',
    to: '/mypage',
    items: [
      { label: '대시보드', to: '/mypage' },
      { label: '이용 내역 조회', to: '/mypage/history' },
      { label: '회원 정보 관리', to: '/mypage/account' },
    ],
  },
]

/** 사이트맵 오버레이 (헤더 ≡ 클릭 시 전체 메뉴) */
export function SitemapOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
            <p className="text-lg font-extrabold text-slate-900">전체 메뉴</p>
            <button
              type="button"
              aria-label="사이트맵 닫기"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="mx-auto max-w-[1200px] px-6 py-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  {col.to ? (
                    <Link
                      to={col.to}
                      onClick={onClose}
                      className="text-lg font-extrabold text-slate-900 hover:text-cobalt-700"
                    >
                      {col.title}
                    </Link>
                  ) : (
                    <p className="text-lg font-extrabold text-slate-900">{col.title}</p>
                  )}
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className="text-base text-slate-500 transition-colors hover:text-cobalt-700"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
