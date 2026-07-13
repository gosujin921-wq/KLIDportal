import { useRef, type ReactNode } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { useInView, useReducedMotion } from 'motion/react'
import { Film, Images, MapPin } from 'lucide-react'
import { EVENT_TYPE_MAP } from '@/mockup/domain/eventTypes'
import { DATASET_ICON, DATASET_ICON_CHIP } from '@/mockup/domain/dataset'
import { portalStats, monthlyGrowth, eventStats, regionStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'
import { RegionBubbleMap } from '@/mockup/components/ui/RegionBubbleMap'
import { Reveal } from '@/mockup/components/ui/Reveal'
import { CountUp } from '@/mockup/components/ui/CountUp'

const KPIS = [
  { label: '학습 데이터셋', value: monthlyGrowth[monthlyGrowth.length - 1].count, unit: '세트', icon: DATASET_ICON },
  { label: '누적 영상', value: portalStats.videoCount, unit: '건', icon: Film },
  { label: '학습 이미지', value: portalStats.imageCount, unit: '장', icon: Images },
  { label: '참여 시·도', value: 17, unit: '곳', icon: MapPin },
]

const eventBarData = eventStats.map((e) => ({
  key: e.key,
  label: EVENT_TYPE_MAP[e.key].label,
  count: e.count,
}))

/**
 * 차트 카드: 뷰 진입 시점에 차트를 마운트해 Recharts 그로우/드로우 애니메이션이
 * 화면 안에서 재생되게 한다(스크롤 전 미리 재생돼 버리는 것 방지). 카드 자체는 Reveal 로 등장.
 */
function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <Reveal className="rounded-2xl border border-slate-200 bg-white p-6">
      <div ref={ref}>
        <p className="text-base font-bold text-slate-900">{title}</p>
        <div className="mt-4 h-[320px]">{inView ? children : null}</div>
      </div>
    </Reveal>
  )
}

/** 데이터 현황: 서비스 규모 시각화 대시보드 */
export function DataStatusPage() {
  const reduce = useReducedMotion()
  const anim = !reduce

  return (
    <>
      {/* KPI (스태거 등장 + 수치 카운트업) */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map((k, i) => (
          <Reveal
            key={k.label}
            delay={i * 0.08}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <span className={`flex size-9 items-center justify-center rounded-xl ${DATASET_ICON_CHIP}`}>
              <k.icon className="size-4.5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums">
              <CountUp value={k.value} format={formatNumber} />
              <span className="ml-1 text-base font-bold text-slate-400">{k.unit}</span>
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">{k.label}</p>
          </Reveal>
        ))}
      </div>

      {/* 지역별 현황 (남한 시·도 지도) */}
      <Reveal className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-base font-bold text-slate-900">지역별 데이터셋 현황</p>
          <p className="text-[13px] text-slate-400">전국 17개 시·도</p>
        </div>
        <div className="mt-5">
          <RegionBubbleMap data={regionStats} />
        </div>
      </Reveal>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* 이벤트 유형별 분포 */}
        <ChartCard title="이벤트 유형별 분포">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={eventBarData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="#eef0f4" />
              <XAxis
                type="number"
                domain={[0, 'dataMax']}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 13 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                tickLine={false}
                axisLine={false}
                width={64}
                tick={{ fill: '#475569', fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v) => [formatNumber(Number(v)), '데이터셋']}
              />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                barSize={18}
                isAnimationActive={anim}
                animationDuration={900}
                animationBegin={150}
                animationEasing="ease-out"
              >
                {eventBarData.map((d) => (
                  <Cell key={d.key} fill={`var(--color-event-${d.key})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 월별 구축 추이 (막대: 월 신규 · 선: 누적) */}
        <ChartCard title="월별 데이터셋 구축 추이">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyGrowth} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef0f4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
              <YAxis
                yAxisId="added"
                domain={[0, 260]}
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fill: '#94a3b8', fontSize: 13 }}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                domain={[0, 1400]}
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: '#94a3b8', fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v, name) => [`${formatNumber(Number(v))}건`, name]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 13, paddingBottom: 10 }}
              />
              <Bar
                yAxisId="added"
                dataKey="added"
                name="월 신규"
                fill="var(--color-cobalt-400)"
                radius={[5, 5, 0, 0]}
                barSize={24}
                isAnimationActive={anim}
                animationDuration={800}
                animationBegin={150}
                animationEasing="ease-out"
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="count"
                name="누적"
                stroke="#2e45dc"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#2e45dc' }}
                isAnimationActive={anim}
                animationDuration={1200}
                animationBegin={500}
                animationEasing="ease-in-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  )
}
