export interface BellBucket {
  label: string
  count: number
}

export function BellCurve({ buckets }: { buckets: BellBucket[] }) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0) || 1
  const max = Math.max(...buckets.map(bucket => bucket.count), 1)
  return (
    <div className="flex h-56 items-end gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      {buckets.map(bucket => {
        const height = Math.max(12, (bucket.count / max) * 100)
        return (
          <div key={bucket.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="text-[11px] font-medium text-gray-500">{Math.round((bucket.count / total) * 100)}%</div>
            <div className="flex w-full items-end justify-center">
              <div className="w-full max-w-10 rounded-t-xl bg-brand-500/80" style={{ height: `${height}%`, minHeight: 12 }} />
            </div>
            <div className="text-[11px] text-gray-500">{bucket.label}</div>
          </div>
        )
      })}
    </div>
  )
}
