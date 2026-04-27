import { ReactNode } from 'react'

interface SectionCardProps {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function SectionCard({ title, description, action, children, footer, className = '' }: SectionCardProps) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {(title || description || action) && (
        <div className="card-head flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h3>}
            {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">{footer}</div>}
    </section>
  )
}
