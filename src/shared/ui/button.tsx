import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  icon?: ReactNode
}

export function Button({ children, variant = 'primary', size = 'md', icon, className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'border-transparent bg-brand-500 text-white shadow-sm shadow-brand-500/25 hover:bg-brand-600 disabled:bg-brand-400',
    secondary: 'border-gray-200 bg-white text-gray-700 hover:border-brand-200 hover:text-brand-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200',
    ghost: 'border-transparent bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.05]',
    danger: 'border-transparent bg-error-50 text-error-700 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-300',
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
