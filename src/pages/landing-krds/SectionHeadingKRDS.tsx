import type { ReactNode } from 'react'
import { Tag } from '@/components/ui/Tag'

/** KRDS 톤 섹션 헤딩. eyebrow(KRDS Tag) + 제목 + 설명. */
export function SectionHeadingKRDS({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string
  title: ReactNode
  desc?: string
}) {
  return (
    <div className="max-w-2xl">
      <Tag variant="primary" size="lg" className="font-semibold tracking-wide">
        {eyebrow}
      </Tag>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-lg text-slate-600">{desc}</p>}
    </div>
  )
}
