import { Badge } from '@shared/ui/badge';
import type { HrDashboardScoreBucket } from '../hooks/use-hr-dashboard';

const BUCKET_COLORS: Record<string, string> = {
  '1.0–1.9': '#f04438',
  '2.0–2.9': '#f97066',
  '3.0–3.9': '#fdb022',
  '4.0–4.4': '#84cc16',
  '4.5–5.0': '#12b76a',
};
const BUCKET_MIDS = [1.5, 2.5, 3.5, 4.2, 4.75];

export function ScoreDistributionCard({
  buckets,
}: {
  buckets: HrDashboardScoreBucket[];
}) {
  const total = buckets.reduce((s, b) => s + b.count, 0);
  const max = Math.max(...buckets.map((b) => b.count), 1);
  const avg =
    total === 0
      ? 0
      : buckets.reduce(
          (sum, bucket, idx) => sum + bucket.count * (BUCKET_MIDS[idx] ?? 0),
          0
        ) / total;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            Score distribution
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Final scores · {total} appraisals reviewed
          </p>
        </div>
        <Badge tone="neutral">5-pt scale</Badge>
      </div>
      <div
        className="mt-6 flex items-end justify-between gap-3 px-1"
        style={{ height: 160 }}
      >
        {buckets.map((b) => {
          const h = (b.count / max) * 140;
          return (
            <div
              key={b.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-[11px] font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                {b.count}
              </span>
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: h,
                  background: BUCKET_COLORS[b.label] ?? '#465fff',
                }}
              />
              <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Avg score</p>
          <p className="mt-0.5 font-semibold tabular-nums text-gray-900 dark:text-white">
            {avg.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Total reviewed</p>
          <p className="mt-0.5 font-semibold tabular-nums text-gray-900 dark:text-white">
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}
