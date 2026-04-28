import type { KraItem } from '../types';

export function WeightStack({ items }: { items: KraItem[] }) {
  const palette = [
    '#465fff',
    '#7c5cff',
    '#10b981',
    '#fdb022',
    '#f97066',
    '#34d399',
  ];
  const total = items.reduce((s, i) => s + i.weight, 0) || 1;
  return (
    <div className="overflow-hidden rounded-full">
      <div className="flex h-3 w-full">
        {items.map((it, i) => (
          <div
            key={it.code}
            title={`${it.title} · ${it.weight}%`}
            style={{
              width: `${(it.weight / total) * 100}%`,
              background: palette[i % palette.length],
            }}
          />
        ))}
      </div>
    </div>
  );
}
