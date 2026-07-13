import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Container } from '@/mockup/components/ui/Container'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { notices } from '@/mockup/mocks/landing'
import { formatDate } from '@/lib/datetime'

/** 공지 태그별 색 (아기자기 + 식별성) */
const TAG_STYLE: Record<string, string> = {
  공지: 'bg-cobalt-50 text-cobalt-700',
  데이터: 'bg-emerald-50 text-emerald-700',
  점검: 'bg-amber-50 text-amber-700',
  안내: 'bg-sky-50 text-sky-700',
}

export function NoticeSection() {
  return (
    <section className="bg-slate-50/70 py-20">
      <Container>
        <Reveal className="card-soft rounded-2xl bg-white p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">공지사항</h2>
            <Link
              to="/news/notices"
              className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:text-cobalt-800"
            >
              전체보기 <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-5 divide-y divide-slate-100">
            {notices.map((n, i) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px 0px' }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              >
                <Link to="/news/notices" className="flex items-center gap-4 py-3.5 hover:bg-slate-50">
                  <span
                    className={`w-14 shrink-0 rounded-md py-1 text-center text-[13px] font-semibold ${
                      TAG_STYLE[n.tag] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {n.tag}
                  </span>
                  <span className="flex-1 truncate font-medium text-slate-700">{n.title}</span>
                  <span className="shrink-0 text-sm tabular-nums text-slate-400">
                    {formatDate(n.date)}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
