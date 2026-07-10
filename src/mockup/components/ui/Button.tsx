import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-cobalt-600 text-white hover:bg-cobalt-700 active:bg-cobalt-800',
  secondary:
    'bg-white text-cobalt-700 border border-cobalt-200 hover:bg-cobalt-50 active:bg-cobalt-100',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-13 px-7 text-lg gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition-colors',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
