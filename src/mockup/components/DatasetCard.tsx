import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Heart, MapPin } from 'lucide-react'
import { datasetSource, type Dataset } from '@/mockup/mocks/datasets'
import { DatasetThumb } from '@/mockup/components/DatasetThumb'
import { EventBadge, KindTag } from '@/mockup/components/ui/badges'
import { formatNumber } from '@/lib/format'

/** 데이터셋 카드 (검색 결과·메인 인기 데이터셋 공용) */
export function DatasetCard({ dataset }: { dataset: Dataset }) {
  const [liked, setLiked] = useState(false)

  return (
    <Link
      to={`/search/${dataset.id}`}
      className="card-soft flex flex-col overflow-hidden rounded-2xl bg-white"
    >
      <DatasetThumb type={dataset.type} resolution={dataset.resolution} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <EventBadge type={dataset.type} />
          {dataset.dataKinds.map((k) => (
            <KindTag key={k} label={k} />
          ))}
          {/* AI 증강 데이터셋 배지 (DFEAT-002) */}
          {datasetSource(dataset.id) === 'AI증강' && (
            <span className="inline-flex items-center whitespace-nowrap rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
              AI 증강
            </span>
          )}
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-base leading-snug font-bold text-slate-900">
          {dataset.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="size-3.5" />
          {dataset.region} · {dataset.period}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5 text-sm text-slate-500">
          <span className="min-w-0 tabular-nums">
            <span className="whitespace-nowrap">영상 {formatNumber(dataset.videoCount)}건</span> ·{' '}
            <span className="whitespace-nowrap">이미지 {formatNumber(dataset.imageCount)}장</span>
          </span>
          <span className="flex shrink-0 items-center gap-2.5">
            <span className="flex items-center gap-1 tabular-nums">
              <Download className="size-3.5" />
              {formatNumber(dataset.downloads)}
            </span>
            <button
              type="button"
              aria-label={liked ? '즐겨찾기 해제' : '즐겨찾기'}
              onClick={(e) => {
                e.preventDefault()
                setLiked((v) => !v)
              }}
              className="text-slate-400 transition-colors hover:text-red-500"
            >
              <Heart className={liked ? 'size-4 fill-red-500 text-red-500' : 'size-4'} />
            </button>
          </span>
        </div>
      </div>
    </Link>
  )
}
