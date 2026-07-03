import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * KRDS Table 스펙 이식. striped / bordered / hoverable / compact 변형.
 * 본문 폰트는 KRDS sm(14px) → text-sm. 헤더 상단 굵은 보더(slate-800) 유지.
 * hover 색은 opacity 배경 토큰 미사용 — cobalt-50 솔리드 틴트로 대체(컨벤션).
 */
export interface TableColumn<T> {
  key: string
  label: ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  caption?: ReactNode
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  emptyText?: ReactNode
  loading?: boolean
  className?: string
}

const alignClass: Record<NonNullable<TableColumn<unknown>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
  striped = false,
  bordered = false,
  hoverable = true,
  compact = false,
  emptyText = '데이터가 없습니다.',
  loading = false,
  className,
}: TableProps<T>) {
  const cellPad = compact ? 'px-3 py-[7px]' : 'px-4 py-3'

  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse border-t-2 border-slate-800 text-sm text-slate-900',
          className,
        )}
      >
        {caption && (
          <caption className="mb-3 text-left text-base font-bold text-slate-900">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ width: col.width }}
                className={cn(
                  'whitespace-nowrap bg-slate-100 font-medium text-slate-900',
                  'border-b border-slate-200',
                  bordered && 'border border-slate-200',
                  cellPad,
                  alignClass[col.align ?? 'left'],
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn('p-10 text-center text-slate-600', bordered && 'border border-slate-200')}
              >
                로딩 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn('p-10 text-center text-slate-600', bordered && 'border border-slate-200')}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  'group',
                  striped && rowIdx % 2 === 1 && 'bg-slate-50',
                  hoverable && 'hover:bg-cobalt-50',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'border-b border-slate-200 align-middle leading-normal',
                      'group-last:border-b-slate-300',
                      bordered && 'border border-slate-200',
                      cellPad,
                      alignClass[col.align ?? 'left'],
                    )}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
