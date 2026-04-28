interface BucketDatum {
  label: string;
  count: number;
}

const palette: Record<string, string> = {
  '1.0–1.9': '#f04438',
  '2.0–2.9': '#f97066',
  '3.0–3.9': '#fdb022',
  '4.0–4.4': '#84cc16',
  '4.5–5.0': '#12b76a',
};

export function BellCurve({ data }: { data: BucketDatum[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((d) => {
        const h = (d.count / max) * 100;
        return (
          <div
            key={d.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className="flex w-full flex-col items-center justify-end"
              style={{ height: '160px' }}
            >
              <span className="mb-1 text-[11px] font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                {d.count}
              </span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${h}%`,
                  minHeight: d.count > 0 ? '4px' : '0',
                  background: palette[d.label] ?? '#465fff',
                }}
              />
            </div>
            <p className="text-[11px] font-semibold tabular-nums text-gray-600 dark:text-gray-400">
              {d.label}
            </p>
            <p className="text-[10px] text-gray-400">
              {Math.round((d.count / total) * 100)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
