import { type HTMLAttributes, type ReactNode, useState } from 'react'
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * KRDS 알림(Alert) 스펙 이식. 변형 4종(info/success/warning/danger).
 * 옅은 솔리드 배경 + 동색 보더. 본문 폰트 KRDS sm(14px) → text-sm.
 * 이모지 아이콘은 lucide 아이콘으로 대체. closable 시 우상단 X.
 */
type Variant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: Variant
  title?: ReactNode
  closable?: boolean
  onClose?: () => void
  /** 기본 아이콘 대체. null 전달 시 아이콘 숨김 */
  icon?: ReactNode | null
}

const variantClass: Record<Variant, string> = {
  info: 'bg-cobalt-50 border-info text-info',
  success: 'bg-green-50 border-success text-success',
  warning: 'bg-amber-50 border-warning text-amber-700',
  danger: 'bg-red-50 border-danger text-danger',
}

const variantIcon: Record<Variant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
}

export function Alert({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  icon,
  className,
  ...props
}: AlertProps) {
  const [closed, setClosed] = useState(false)

  if (closed) return null

  const handleClose = () => {
    setClosed(true)
    onClose?.()
  }

  const DefaultIcon = variantIcon[variant]
  const displayIcon =
    icon === undefined ? <DefaultIcon className="size-4" aria-hidden="true" /> : icon

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {displayIcon && <span className="mt-0.5 shrink-0">{displayIcon}</span>}
      <div className="min-w-0 flex-1">
        {title && <strong className="mb-1 block text-base font-bold">{title}</strong>}
        {children && <p className="m-0 leading-normal">{children}</p>}
      </div>
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="알림 닫기"
          className="shrink-0 p-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
