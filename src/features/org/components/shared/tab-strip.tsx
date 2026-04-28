import type { TabId } from '../../constants';

export function TabStrip({
  value,
  onChange,
  tabs,
}: {
  value: TabId;
  onChange: (v: TabId) => void;
  tabs: { id: TabId; label: string; count: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/[0.02]">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === t.id
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {t.label}
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              value === t.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {t.count}
          </span>
        </button>
      ))}
    </div>
  );
}
