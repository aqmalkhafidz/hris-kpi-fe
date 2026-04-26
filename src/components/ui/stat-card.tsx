import { ReactNode } from 'react'

type StatTone = 'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'info'

interface StatCardProps {
  label: ReactNode
  value: ReactNode
  icon?: ReactNode
  trend?: ReactNode
  footer?: ReactNode
  tone?: StatTone
}

export function StatCard({ label, value, icon, trend, footer, tone = 'brand' }: StatCardProps) {
  const tones: Record<StatTone, string> = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error: 'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
        {trend && <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">{trend}</div>}
      </div>
      <p className="mt-4 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-serif text-3xl font-semibold italic text-gray-900 dark:text-white">{value}</p>
      {footer && <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{footer}</p>}
    </section>
  )
}
