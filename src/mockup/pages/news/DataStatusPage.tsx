import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Database, Film, Images, MapPin } from 'lucide-react'
import { EVENT_TYPE_MAP } from '@/components/domain/eventTypes'
import { portalStats, monthlyGrowth, eventStats, regionStats } from '@/mockup/mocks/landing'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/cn'

/** 4×5 컴팩트 타일맵 (RegionSection과 동일 배치) */
const TILES: Record<string, { c: number; r: number }> = {
  인천: { c: 1, r: 1 }, 서울: { c: 2, r: 1 }, 경기: { c: 3, r: 1 }, 강원: { c: 4, r: 1 },
  충남: { c: 1, r: 2 }, 세종: { c: 2, r: 2 }, 충북: { c: 3, r: 2 }, 경북: { c: 4, r: 2 },
  전북: { c: 1, r: 3 }, 대전: { c: 2, r: 3 }, 대구: { c: 3, r: 3 }, 울산: { c: 4, r: 3 },
  광주: { c: 1, r: 4 }, 전남: { c: 2, r: 4 }, 경남: { c: 3, r: 4 }, 부산: { c: 4, r: 4 },
  제주: { c: 1, r: 5 },
}
const regionMax = Math.max(...regionStats.map((r) => r.count))

function regionIntensity(count: number): string {
  const ratio = count / regionMax
  if (ratio > 0.8) return 'bg-cobalt-800 text-white'
  if (ratio > 0.55) return 'bg-cobalt-600 text-white'
  if (ratio > 0.35) return 'bg-cobalt-500 text-white'
  if (ratio > 0.2) return 'bg-cobalt-200 text-cobalt-900'
  return 'bg-cobalt-100 text-cobalt-800'
}

function RegionTileMap() {
  return (
    <div>
      <div
        className="mx-auto grid w-fit gap-2"
        style={{ gridTemplateColumns: 'repeat(4, 60px)', gridTemplateRows: 'repeat(5, 60px)' }}
      >
        {regionStats.map((region) => {
          const pos = TILES[region.name]
          if (!pos) return null
          return (
            <div
              key={region.name}
              style={{ gridColumn: pos.c, gridRow: pos.r }}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg transition-transform hover:scale-105',
                regionIntensity(region.count),
              )}
              title={`${region.name} ${formatNumber(region.count)}건`}
            >
              <span className="text-[13px] leading-none font-bold">{region.name}</span>
              <span className="mt-1 text-[13px] leading-none font-semibold opacity-90 tabular-nums">
                {region.count}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-[13px] text-slate-500">
        <span>적음</span>
        <span className="h-3 w-5 rounded bg-cobalt-100" />
        <span className="h-3 w-5 rounded bg-cobalt-200" />
        <span className="h-3 w-5 rounded bg-cobalt-500" />
        <span className="h-3 w-5 rounded bg-cobalt-600" />
        <span className="h-3 w-5 rounded bg-cobalt-800" />
        <span>많음</span>
      </div>
    </div>
  )
}

const KPIS = [
  { label: '학습 데이터셋', value: monthlyGrowth[monthlyGrowth.length - 1].count, unit: '세트', icon: Database },
  { label: '누적 영상', value: portalStats.videoCount, unit: '건', icon: Film },
  { label: '학습 이미지', value: portalStats.imageCount, unit: '장', icon: Images },
  { label: '참여 시·도', value: 17, unit: '곳', icon: MapPin },
]

const eventBarData = eventStats.map((e) => ({
  key: e.key,
  label: EVENT_TYPE_MAP[e.key].label,
  count: e.count,
}))

/** 데이터 현황: 서비스 규모 시각화 대시보드 */
export function DataStatusPage() {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-cobalt-50 text-cobalt-600">
              <k.icon className="size-4.5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums">
              {formatNumber(k.value)}
              <span className="ml-1 text-base font-bold text-slate-400">{k.unit}</span>
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* 지역별 현황 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-base font-bold text-slate-900">지역별 데이터셋 현황</p>
          <div className="mt-5">
            <RegionTileMap />
          </div>
        </div>

        {/* 이벤트 유형별 분포 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-base font-bold text-slate-900">이벤트 유형별 분포</p>
          <div className="mt-4 h-[320px]">
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
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18} isAnimationActive={false}>
                  {eventBarData.map((d) => (
                    <Cell key={d.key} fill={`var(--color-event-${d.key})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 월별 구축 추이 */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-base font-bold text-slate-900">월별 데이터셋 구축 추이</p>
        <div className="mt-4 h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="statusFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2e45dc" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2e45dc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef0f4" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 13 }} width={48} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(v) => [formatNumber(Number(v)), '누적 데이터셋']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2e45dc"
                strokeWidth={2.5}
                fill="url(#statusFill)"
                dot={{ r: 3, fill: '#2e45dc' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
