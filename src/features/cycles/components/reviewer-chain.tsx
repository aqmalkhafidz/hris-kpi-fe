import type { DistEmployee } from '../types';

export function ReviewerChain({ emp }: { emp: DistEmployee }) {
  const steps = [
    { label: 'SL', name: emp.sl },
    { label: 'HoD', name: emp.hod },
    { label: 'HoDiv', name: emp.hodiv },
  ];
  return (
    <div className="flex items-center gap-1 text-[11px]">
      {steps.map((s, i) => (
        <span key={s.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300 dark:text-gray-600">→</span>}
          <span
            className={
              s.name
                ? 'inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                : 'inline-flex items-center gap-1 rounded bg-error-50 px-1.5 py-0.5 text-error-700 dark:bg-error-500/10 dark:text-error-400'
            }
          >
            <strong className="font-semibold uppercase tracking-wider opacity-60">
              {s.label}
            </strong>
            <span>{s.name ?? '—'}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
