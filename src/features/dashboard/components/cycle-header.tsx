import { Icon } from '@shared/layouts/icon';
import { Badge } from '@shared/ui/badge';
import type {
  HrDashboardCycle,
  HrDashboardPipeline,
} from '../hooks/use-hr-dashboard';

export function CycleHeader({
  cycle,
  pipeline,
}: {
  cycle: HrDashboardCycle;
  pipeline: HrDashboardPipeline;
}) {
  const completionPct =
    pipeline.invited > 0
      ? Math.round(
          ((pipeline.completed +
            pipeline.hodivApproved +
            pipeline.hodApproved) /
            pipeline.invited) *
            100
        )
      : 0;
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-brand-50/40 p-6 dark:border-gray-800 dark:from-white/[0.02] dark:to-brand-500/5">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand">Active cycle</Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Started {cycle.startDate}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {cycle.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {cycle.selfDeadline && (
              <>
                Self-appraisal closes{' '}
                <strong className="text-gray-700 dark:text-gray-200">
                  {cycle.selfDeadline}
                </strong>{' '}
                ·{' '}
              </>
            )}
            Cycle ends{' '}
            <strong className="text-gray-700 dark:text-gray-200">
              {cycle.endDate}
            </strong>
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Cycle progress
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-800"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    className="text-brand-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${completionPct} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-gray-900 dark:text-white">
                  {completionPct}%
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {pipeline.completed +
                    pipeline.hodivApproved +
                    pipeline.hodApproved}
                  /{pipeline.invited}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  past HoD review
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-600">
              {Icon.send}
              <span>Send reminder</span>
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200">
              {Icon.download}
              <span>Export report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
