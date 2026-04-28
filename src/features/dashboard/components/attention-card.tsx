import { Icon } from '@shared/layouts/icon';
import type { HrDashboardAttention } from '../hooks/use-hr-dashboard';

const toneBg: Record<string, string> = {
  error: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300',
  warning:
    'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
};

export function AttentionCard({ items }: { items: HrDashboardAttention[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900 dark:text-white">
          Needs attention
        </p>
        <button className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300">
          View all
        </button>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02] dark:text-gray-400">
          Tidak ada notifikasi.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((a, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-gray-200 px-3 py-3 dark:border-gray-800"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneBg[a.tone]}`}
              >
                {Icon.warn}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {a.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {a.subtitle}
                </p>
              </div>
              <button className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/[0.05]">
                Action
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
