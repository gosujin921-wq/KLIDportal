import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Download, Heart, Info, MapPin } from 'lucide-react'
import { Container } from '@/mockup/components/ui/Container'
import { Button } from '@/mockup/components/ui/Button'
import { Breadcrumb } from '@/mockup/components/Breadcrumb'
import { DatasetThumb } from '@/mockup/components/DatasetThumb'
import { DatasetCard } from '@/mockup/components/DatasetCard'
import { EventBadge, KindTag } from '@/mockup/components/ui/badges'
import { DownloadRequestModal } from './DownloadRequestModal'
import { EVENT_TYPE_MAP } from '@/mockup/domain/eventTypes'
import { DATASETS, getDataset } from '@/mockup/mocks/datasets'
import { formatNumber } from '@/lib/format'
import { formatDate } from '@/lib/datetime'

/** 학습데이터 상세 */
export function DatasetDetailPage() {
  const { id } = useParams()
  const dataset = getDataset(id ?? '')
  const [liked, setLiked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  if (!dataset) {
    return (
      <Container className="py-32 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">데이터셋을 찾을 수 없습니다</h1>
        <Link to="/search" className="mt-4 inline-block text-cobalt-600 hover:underline">
          학습데이터 검색으로 돌아가기
        </Link>
      </Container>
    )
  }

  const related = DATASETS.filter((d) => d.type === dataset.type && d.id !== dataset.id).slice(0, 3)
  const eventLabel = EVENT_TYPE_MAP[dataset.type].label

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[{ label: '학습데이터', to: '/search' }, { label: dataset.title }]}
      />

      {/* 헤더 */}
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5">
            <EventBadge type={dataset.type} withIcon />
            {dataset.dataKinds.map((k) => (
              <KindTag key={k} label={k} />
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {dataset.title}
          </h1>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {dataset.region}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              수집 {dataset.period}
            </span>
            <span>최종 업데이트 {formatDate(dataset.updatedAt)}</span>
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => setLiked((v) => !v)}
        >
          <Heart className={liked ? 'size-4 fill-red-500 text-red-500' : 'size-4'} />
          즐겨찾기
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* 본문 */}
        <div className="min-w-0 flex-1">
          {/* 미리보기 */}
          <DatasetThumb
            type={dataset.type}
            resolution={dataset.resolution}
            showPlay
            className="rounded-2xl border border-slate-200"
          />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <DatasetThumb
                key={i}
                type={dataset.type}
                className="rounded-xl border border-slate-200 opacity-90"
              />
            ))}
          </div>

          <DetailSection title="데이터셋 소개">
            <p className="leading-relaxed text-slate-600">{dataset.desc}</p>
          </DetailSection>

          <DetailSection title="라벨링 정보">
            <div className="flex flex-wrap gap-2">
              {dataset.classes.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-sm text-slate-600"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-500">
              라벨 포맷: {dataset.labelFormat} · 클래스 {dataset.classes.length}종
            </p>
          </DetailSection>

          <DetailSection title="수집 정보">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              <SpecItem label="수집 지역" value={dataset.region} />
              <SpecItem label="수집 기간" value={dataset.period} />
              <SpecItem label="해상도" value={dataset.resolution} />
              <SpecItem label="프레임레이트" value={`${dataset.fps} fps`} />
              <SpecItem label="이벤트 유형" value={eventLabel} />
              <SpecItem label="총 용량" value={`${dataset.sizeGb} GB`} />
            </dl>
          </DetailSection>
        </div>

        {/* 데이터 구성 카드 (sticky) */}
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-base font-bold text-slate-900">데이터 구성</p>
            <dl className="mt-4 space-y-3">
              <CompositionRow label="영상 클립" value={`${formatNumber(dataset.videoCount)}건`} />
              <CompositionRow label="이미지" value={`${formatNumber(dataset.imageCount)}장`} />
              <CompositionRow label="라벨 포맷" value={dataset.labelFormat} />
              <CompositionRow label="용량" value={`${dataset.sizeGb} GB`} />
              <CompositionRow
                label="누적 다운로드"
                value={`${formatNumber(dataset.downloads)}회`}
              />
            </dl>

            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
              <p className="flex items-start gap-1.5 text-sm text-slate-500">
                <Info className="mt-0.5 size-4 shrink-0 text-cobalt-500" />
                영상과 이미지는 세트로 제공됩니다.
              </p>
              <p className="flex items-start gap-1.5 text-sm text-slate-500">
                <Info className="mt-0.5 size-4 shrink-0 text-cobalt-500" />
                승인 완료 후 7일 이내 다운로드해야 합니다.
              </p>
            </div>

            <Button className="mt-5 w-full" onClick={() => setModalOpen(true)}>
              <Download className="size-4.5" />
              다운로드 신청
            </Button>
          </div>
        </aside>
      </div>

      {/* 같은 유형의 다른 데이터셋 */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              {eventLabel} 유형의 다른 데이터셋
            </h2>
            <Link
              to={`/search?type=${dataset.type}`}
              className="text-sm font-semibold text-cobalt-600 hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((d) => (
              <DatasetCard key={d.id} dataset={d} />
            ))}
          </div>
        </section>
      )}

      <DownloadRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dataset={dataset}
      />
    </Container>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-base font-semibold text-slate-800">{value}</dd>
    </div>
  )
}

function CompositionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-base font-bold text-slate-900 tabular-nums">{value}</dd>
    </div>
  )
}
