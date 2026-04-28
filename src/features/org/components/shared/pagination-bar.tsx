import type { PaginationState } from '@shared/hooks/use-paginate';

export function PaginationBar({ pagination }: { pagination: PaginationState }) {
  const {
    from,
    to,
    total,
    size,
    canPrev,
    canNext,
    prevPage,
    nextPage,
    setSize,
  } = pagination;
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-800">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Rows per page:</span>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="rounded border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        >
          {[10, 25, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {from}–{to} of {total}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevPage}
            disabled={!canPrev}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/[0.05]"
          >
            ‹
          </button>
          <button
            onClick={nextPage}
            disabled={!canNext}
            className="rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-white/[0.05]"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
