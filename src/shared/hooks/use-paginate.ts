import { useState, useMemo, useEffect } from 'react';

export interface PaginationState {
  page: number;
  size: number;
  total: number;
  from: number;
  to: number;
  canPrev: boolean;
  canNext: boolean;
  prevPage: () => void;
  nextPage: () => void;
  setSize: (s: number) => void;
}

export function usePaginate<T>(
  items: T[],
  pageSize = 10
): { rows: T[] } & PaginationState {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);

  const totalPages = Math.ceil(items.length / size) || 1;

  // reset to page 0 when filtered item count changes (search)
  useEffect(() => {
    setPage(0);
  }, [items.length]);

  const safePage = Math.min(page, totalPages - 1);

  const rows = useMemo(
    () => items.slice(safePage * size, (safePage + 1) * size),
    [items, safePage, size]
  );

  const total = items.length;
  const from = total === 0 ? 0 : safePage * size + 1;
  const to = Math.min((safePage + 1) * size, total);

  return {
    rows,
    page: safePage,
    size,
    total,
    from,
    to,
    canPrev: safePage > 0,
    canNext: safePage < totalPages - 1,
    prevPage: () => setPage((p) => Math.max(0, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
    setSize: (s: number) => {
      setSize(s);
      setPage(0);
    },
  };
}
