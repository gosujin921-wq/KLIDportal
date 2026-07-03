import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { notices } from '@/mocks/landing'
import { formatDate } from '@/lib/datetime'
import { SectionHeadingKRDS } from './SectionHeadingKRDS'

export function NoticeSectionKRDS() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <SectionHeadingKRDS eyebrow="NOTICE" title="공지사항" />
          </Reveal>
          <Reveal>
            <a
              href="#"
              className="hidden shrink-0 items-center gap-1 text-base font-semibold text-cobalt-700 hover:text-cobalt-800 sm:inline-flex"
            >
              전체 보기
              <ArrowUpRight className="size-4" />
            </a>
          </Reveal>
        </div>

        <ul className="mt-10 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {notices.map((n, i) => (
            <li key={n.id}>
              <Reveal delay={i * 0.06}>
                <a
                  href="#"
                  className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-cobalt-50"
                >
                  <Tag variant="primary" size="md" className="shrink-0 font-semibold">
                    {n.tag}
                  </Tag>
                  <span className="min-w-0 flex-1 truncate text-base font-medium text-slate-800">
                    {n.title}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-slate-400">
                    {formatDate(n.date)}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
