import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/mockup/components/ui/Button'
import { useDemoAuth } from '@/mockup/demoAuth'

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

function MenuColumn({ col, onClose }: { col: (typeof COLUMNS)[number]; onClose: () => void }) {
  return (
    <div>
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
  )
}

/** 사이트맵 오버레이 (헤더 ≡ 클릭 시 전체 메뉴) */
export function SitemapOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { loggedIn } = useDemoAuth()

  const go = (to: string) => {
    onClose()
    navigate(to)
  }

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
        <>
          {/* GNB 아래 영역만 딤 처리 (헤더는 위에 유지) */}
          <motion.div
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-900/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* 헤더 바로 아래로 펼쳐지는 드롭다운 패널 */}
          <motion.div
            className="fixed inset-x-0 top-16 z-50 overflow-hidden border-b border-slate-200 bg-white shadow-xl"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-8">
              <div className="flex gap-10">
                {/* 주요 메뉴 4섹션 (GNB와 대응) */}
                <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
                  {COLUMNS.slice(0, 4).map((col) => (
                    <MenuColumn key={col.title} col={col} onClose={onClose} />
                  ))}
                </div>

                {/* 계정 영역 (헤더 우측 로그인/마이페이지와 대응) */}
                <div className="w-56 shrink-0 border-l border-slate-200 pl-10">
                  {loggedIn ? (
                    <MenuColumn col={COLUMNS[4]} onClose={onClose} />
                  ) : (
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">마이페이지</p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-500">
                        로그인하면 데이터 반출과 워크스페이스, 저작도구를 이용할 수 있습니다.
                      </p>
                      <div className="mt-5 flex flex-col gap-2">
                        <Button size="sm" className="w-full" onClick={() => go('/login')}>
                          <LogIn className="size-4" />
                          로그인
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={() => go('/signup')}
                        >
                          회원가입
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
