import { Icon } from '@shared/layouts/icon';
import type { Appraisal } from '@shared/lib/types/appraisal';
import { Link } from '@tanstack/react-router';

export function KRARow({
  kra,
  expanded,
  onToggle,
  canEditSelfAppraisal = true,
}: {
  kra: Appraisal['kras'][number];
  expanded: boolean;
  onToggle: () => void;
  canEditSelfAppraisal?: boolean;
}) {
  const filled = kra.self_score > 0;
  const pct = filled ? (kra.self_score / 5) * 100 : 0;
  const bar = !filled
    ? 'bg-gray-200 dark:bg-gray-700'
    : kra.self_score >= 4
      ? 'bg-success-500'
      : kra.self_score >= 3
        ? 'bg-warning-500'
        : 'bg-error-500';

  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
      >
        <span className="grid h-9 w-12 shrink-0 place-items-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {kra.weight}%
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
              {kra.title}
            </p>
            {filled ? (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${kra.self_score >= 4 ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400'}`}
              >
                Self {kra.self_score}/5
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
                Score required
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {kra.evidence.length} evidence
            </span>
          </div>
          {kra.target && (
            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              Target:{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {kra.target}
              </span>
            </p>
          )}
        </div>
        <div className="hidden w-44 shrink-0 sm:block">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Self score</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {filled ? `${kra.self_score}/5` : '—'}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={`h-full transition-all ${bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span
          className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
        >
          {Icon.chev}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-dashed border-gray-200 bg-gray-50/50 px-5 py-4 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {kra.description}
              </p>
              {filled && kra.self_comment && (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Your comment
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {kra.self_comment}
                  </p>
                </>
              )}
              {canEditSelfAppraisal && (
                <div className="mt-4">
                  <Link
                    to="/self-appraisal"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                  >
                    {filled ? 'Edit in self-appraisal' : 'Score & comment'}
                  </Link>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Evidence ({kra.evidence.length})
              </p>
              {kra.evidence.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No evidence yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {kra.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-gray-400">{Icon.paper}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800 dark:text-white/90">
                          {e.name}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {e.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
