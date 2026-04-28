import { ReactNode } from 'react';

export interface TabOption<T extends string> {
  value: T;
  label: ReactNode;
}

export function TabStrip<T extends string>({
  options,
  value,
  onChange,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-white/[0.03]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
            value === option.value
              ? 'bg-white text-brand-700 shadow-sm dark:bg-gray-900 dark:text-brand-300'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export const SegmentedControl = TabStrip;
