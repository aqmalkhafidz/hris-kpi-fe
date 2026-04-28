import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?:
    | 'gray'
    | 'success'
    | 'warning'
    | 'error'
    | 'brand'
    | 'info'
    | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, tone = 'gray', size = 'sm' }: BadgeProps) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success:
      'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
    warning:
      'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
    error:
      'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
    brand:
      'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  };
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizes[size]} ${tones[tone] ?? tones.gray}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeProps['tone'] {
  const map: Record<string, BadgeProps['tone']> = {
    draft: 'gray',
    sl_review: 'warning',
    hod_review: 'warning',
    hodiv_review: 'warning',
    acknowledge: 'info',
    completed: 'success',
    active: 'success',
    inactive: 'error',
  };
  return map[status] ?? 'gray';
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: 'Draft',
    sl_review: 'SL Review',
    hod_review: 'HoD Review',
    hodiv_review: 'HoDiv Review',
    acknowledge: 'Pending Acknowledge',
    completed: 'Completed',
  };
  return map[status] ?? status;
}
