interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: 'brand' | 'success' | 'warning' | 'error' | 'gray' | 'info'
}

export function Avatar({ initials, size = 'sm', tone = 'brand' }: AvatarProps) {
  const sz = size === 'xl' ? 'h-16 w-16 text-xl' : size === 'lg' ? 'h-11 w-11 text-sm' : size === 'md' ? 'h-9 w-9 text-xs' : 'h-8 w-8 text-[11px]'
  const tones: Record<string, string> = {
    brand:   'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error:   'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
    info:    'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    gray:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  }
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sz} ${tones[tone] ?? tones.gray}`}>
      {initials}
    </div>
  )
}
