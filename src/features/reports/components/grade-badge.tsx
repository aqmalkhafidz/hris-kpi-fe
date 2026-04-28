export function GradeBadge({ g }: { g: string | null }) {
  if (!g) return <span className="text-gray-400">—</span>;
  const tones: Record<string, string> = {
    A: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300',
    'B+': 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300',
    B: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    C: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300',
    D: 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300',
  };
  return (
    <span
      className={`inline-flex h-7 min-w-[36px] items-center justify-center rounded-md text-xs font-bold tabular-nums ${tones[g] ?? tones['B']}`}
    >
      {g}
    </span>
  );
}
