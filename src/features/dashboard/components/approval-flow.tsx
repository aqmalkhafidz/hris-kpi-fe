import { Icon } from '@shared/layouts/icon';
import { STATUS_FLOW } from '../constants';

export function ApprovalFlow({ status }: { status: string }) {
  const idx = STATUS_FLOW.findIndex((s) => s.key === status);
  return (
    <ol className="mt-5 space-y-4">
      {STATUS_FLOW.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        return (
          <li key={s.key} className="flex gap-3">
            <div className="relative">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-bold ${
                  done
                    ? 'bg-success-500 text-white'
                    : current
                      ? 'bg-brand-500 text-white ring-4 ring-brand-500/15'
                      : 'border-2 border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900'
                }`}
              >
                {done ? Icon.check : i + 1}
              </span>
              {i < STATUS_FLOW.length - 1 && (
                <span
                  className={`absolute left-1/2 top-8 h-7 w-0.5 -translate-x-1/2 ${done ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-800'}`}
                />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p
                className={`text-sm font-semibold ${current ? 'text-gray-900 dark:text-white' : done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}
              >
                {s.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {s.actor}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
