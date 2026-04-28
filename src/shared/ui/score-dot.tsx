export function ScoreDot({ value }: { value: number }) {
  const tone =
    value >= 5
      ? 'bg-success-500'
      : value >= 4
        ? 'bg-brand-500'
        : value >= 3
          ? 'bg-warning-500'
          : 'bg-error-500';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      {value}/5
    </span>
  );
}
