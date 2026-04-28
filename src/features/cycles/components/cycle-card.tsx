import { Icon } from '@shared/layouts/icon';
import { Link } from '@tanstack/react-router';
import type { Cycle } from '../types';
import { CycleStatusBadge } from './cycle-status-badge';
import { ProgressBar } from './progress-bar';

export function CycleCard({
  c,
  onEdit,
  onActivate,
  onClose,
  onDelete,
}: {
  c: Cycle;
  onEdit: (c: Cycle) => void;
  onActivate: (id: number) => void;
  onClose: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const completionPct =
    c.totalAppraisals > 0
      ? Math.round((c.completed / c.totalAppraisals) * 100)
      : 0;
  const inProgress = c.status === 'active' && c.totalAppraisals > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CycleStatusBadge status={c.status} />
            <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
              {c.startDate} → {c.endDate}
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold tracking-tight text-gray-900 dark:text-white">
            {c.name}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {c.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {c.status === 'draft' && (
            <button
              onClick={() => onActivate(c.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-success-600 px-3 text-xs font-semibold text-white hover:bg-success-700"
            >
              {Icon.send}
              <span>Aktifkan</span>
            </button>
          )}
          {c.status === 'active' && (
            <button
              onClick={() => onClose(c.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            >
              {Icon.check}
              <span>Tutup cycle</span>
            </button>
          )}
          <button
            onClick={() => onEdit(c)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
          >
            {Icon.edit}
            <span>Edit</span>
          </button>
          {c.status === 'draft' && c.totalAppraisals === 0 && (
            <button
              onClick={() => onDelete(c.id)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-error-300 hover:bg-error-50 hover:text-error-600 dark:border-gray-800 dark:bg-white/[0.02]"
            >
              {Icon.trash}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Distribusi', value: c.distributedAt ?? '—' },
          { label: 'Deadline self', value: c.selfDeadline ?? '—' },
          { label: 'Appraisal', value: String(c.totalAppraisals) },
          { label: 'Selesai', value: `${completionPct}%` },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {inProgress && (
        <ProgressBar
          completed={c.completed}
          inReview={c.inReview}
          draft={c.draft}
          total={c.totalAppraisals}
        />
      )}

      {c.status === 'active' && c.totalAppraisals === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-warning-300 bg-warning-50 px-4 py-3 text-xs text-warning-700 dark:border-warning-500/40 dark:bg-warning-500/10 dark:text-warning-300">
          Cycle aktif tapi belum ada appraisal. Buka detail untuk jalankan
          distribusi.
        </div>
      )}

      <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
        <Link
          to="/hr/cycles/$cycleId"
          params={{ cycleId: String(c.id) }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Lihat detail &amp; distribusi →
        </Link>
      </div>
    </div>
  );
}
