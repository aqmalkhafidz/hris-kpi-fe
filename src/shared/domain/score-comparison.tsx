import { type Kra } from '@shared/lib/types/appraisal';

const ROLE_LABEL: Record<string, string> = {
  self: 'Self',
  sl: 'SL',
  hod: 'HoD',
  hodiv: 'HoDiv',
};

type Role = 'self' | 'sl' | 'hod' | 'hodiv';

const KEY_MAP: Record<Role, keyof Kra> = {
  self: 'self_score',
  sl: 'sl_score',
  hod: 'hod_score',
  hodiv: 'hodiv_score',
};

export function ScoreComparison({ kra, roles }: { kra: Kra; roles: Role[] }) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${roles.length}, minmax(0, 1fr))` }}
    >
      {roles.map((role) => {
        const value = kra[KEY_MAP[role]] as number | undefined;
        const filled = typeof value === 'number' && value > 0;
        return (
          <div
            key={role}
            className={`rounded-xl border px-3 py-2 text-center ${
              filled
                ? 'border-brand-200 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/10'
                : 'border-dashed border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]'
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {ROLE_LABEL[role]}
            </p>
            <p
              className={`mt-0.5 text-lg font-bold ${filled ? 'text-brand-700 dark:text-brand-300' : 'text-gray-300 dark:text-gray-600'}`}
            >
              {filled ? value : '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
