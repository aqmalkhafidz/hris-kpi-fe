export function ProgressBar({
  completed,
  inReview,
  draft,
  total,
}: {
  completed: number;
  inReview: number;
  draft: number;
  total: number;
}) {
  const t = total || 1;
  const pending = Math.max(0, total - completed - inReview - draft);
  const bars = [
    { value: completed, color: '#12b76a', label: `${completed} completed` },
    { value: inReview, color: '#465fff', label: `${inReview} in review` },
    { value: draft, color: '#fdb022', label: `${draft} draft` },
    { value: pending, color: '#e2dccb', label: `${pending} pending` },
  ];
  return (
    <div className="mt-4 space-y-2">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {bars.map((b) => (
          <div
            key={b.label}
            style={{ width: `${(b.value / t) * 100}%`, background: b.color }}
            title={b.label}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
        {bars.slice(0, 3).map((b) => (
          <span key={b.label}>
            <span
              className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: b.color }}
            />
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}
