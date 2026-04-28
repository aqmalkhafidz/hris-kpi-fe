import { Icon } from '@shared/layouts/icon';
import type { KraTemplateV2 } from '../types';
import { StatusBadge } from './status-badge';

export function TemplateCard({
  t,
  active,
  onClick,
}: {
  t: KraTemplateV2;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-brand-500 bg-brand-50/40 shadow-sm dark:border-brand-500 dark:bg-brand-500/10'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {Icon.layers}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {t.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {t.dept} · {t.level}
            </p>
          </div>
        </div>
        <StatusBadge status={t.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
        {t.summary}
      </p>
      <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <code className="rounded bg-gray-100 px-1.5 py-0.5 tabular-nums dark:bg-gray-800 dark:text-gray-300">
          {t.code}
        </code>
        <span>·</span>
        <span>
          <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
            {t.items.length}
          </strong>{' '}
          KRAs
        </span>
        <span>·</span>
        <span>
          used by{' '}
          <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
            {t.usedBy}
          </strong>
        </span>
      </div>
    </button>
  );
}
