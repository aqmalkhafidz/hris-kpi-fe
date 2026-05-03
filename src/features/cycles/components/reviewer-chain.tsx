import type { DistEmployee } from '../types';

function getInitials(name: string | null) {
  if (!name) return '—';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ReviewerChain({ emp }: { emp: DistEmployee }) {
  const steps = [
    { label: 'SL', name: emp.sl },
    { label: 'H', name: emp.hod },
    { label: 'D', name: emp.hodiv },
  ];
  return (
    <div className="flex items-center gap-1 text-[10px]">
      {steps.map((s, i) => (
        <span key={s.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300 dark:text-gray-700">/</span>}
          <span
            title={s.name ?? 'Kosong'}
            className={
              s.name
                ? 'inline-flex items-center gap-1 rounded bg-gray-50 px-1 py-0.5 font-medium text-gray-600 dark:bg-white/[0.03] dark:text-gray-400'
                : 'inline-flex items-center gap-1 rounded bg-error-50 px-1 py-0.5 font-medium text-error-600 dark:bg-error-500/10 dark:text-error-400'
            }
          >
            <span className="opacity-50">{s.label}:</span>
            <span className="font-bold tracking-tighter">
              {getInitials(s.name)}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
