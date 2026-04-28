import type React from 'react';

export function StatCard({
  icon,
  label,
  value,
  sub,
  tone = 'brand',
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning' | 'error';
}) {
  const iconBg = {
    brand:
      'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
    success:
      'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning:
      'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
    error:
      'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-300',
  }[tone];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-[13px] text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[28px] font-bold leading-none tracking-tight text-gray-900 dark:text-white">
          {value}
        </p>
        {sub && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
