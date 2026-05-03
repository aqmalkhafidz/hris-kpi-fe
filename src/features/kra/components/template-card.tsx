import { Icon } from '@shared/layouts/icon';
import {
  useDivisions,
  useDepartments,
  usePositions,
} from '../../org/hooks/use-org';
import type { KraTemplateV2 } from '../types';
import { StatusBadge } from './status-badge';

export function TemplateCard({
  t,
  active,
  onClick,
  versionMeta,
}: {
  t: KraTemplateV2;
  active: boolean;
  onClick: () => void;
  versionMeta?: {
    totalVersions: number;
    hiddenVersions: number;
  };
}) {
  const { data: divisions = [] } = useDivisions();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const division = divisions.find((d) => d.id === t.divId);
  const department = departments.find((d) => d.id === t.deptId);
  const position = positions.find((p) => p.id === t.posId);

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
              {division?.name ?? 'Unknown'} · {department?.name ?? 'Unknown'}
            </p>
          </div>
        </div>
        <StatusBadge status={t.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="rounded-md bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {t.version}
        </span>
        {versionMeta && versionMeta.totalVersions > 1 && (
          <span>
            {versionMeta.totalVersions} versions
            {versionMeta.hiddenVersions > 0
              ? ` · ${versionMeta.hiddenVersions} hidden`
              : ''}
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
        {t.summary}
      </p>
      <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="font-medium text-brand-600 dark:text-brand-400">
          {position?.title ?? 'No Position'}
        </span>
        <span>·</span>
        <span>
          <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
            {t.items.length}
          </strong>{' '}
          KRAs
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span>
          Used in{' '}
          <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
            {t.usage.usedInCycles}
          </strong>{' '}
          cycles
        </span>
        <span>·</span>
        <span>
          <strong className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
            {t.usage.lastUsedEmployeeCount}
          </strong>
          <span className="ml-1">
            employees in {t.usage.lastUsedCycle ?? 'no cycle yet'}
          </span>
        </span>
      </div>
    </button>
  );
}
