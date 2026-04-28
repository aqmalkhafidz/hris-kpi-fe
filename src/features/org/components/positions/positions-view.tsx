import { usePaginate } from '@shared/hooks/use-paginate';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { Employee, Position } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';

export function PositionsView({
  search,
  positions,
  employees,
  onEdit,
  onDelete,
}: {
  search: string;
  positions: Position[];
  employees: Employee[];
  onEdit: (p: Position) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () =>
      positions.filter((p) =>
        (p.title + p.code + p.dept).toLowerCase().includes(q)
      ),
    [positions, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Position</th>
            <th className="px-3 py-3">Code</th>
            <th className="px-3 py-3">Department</th>
            <th className="px-3 py-3">KRA Template</th>
            <th className="px-3 py-3 text-right">Filled</th>
            <th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const filled = employees.filter(
              (e) => e.position === p.title
            ).length;
            return (
              <tr
                key={p.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">
                  {p.title}
                </td>
                <td className="px-3 py-3.5">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {p.code}
                  </code>
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {p.dept}
                </td>
                <td className="px-3 py-3.5 max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400">
                  {p.template || '—'}
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums font-semibold text-gray-900 dark:text-white">
                  {filled}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                    >
                      {Icon.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete position ${p.title}?`))
                          onDelete(p.id);
                      }}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      {Icon.trash}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationBar pagination={pagination} />
    </div>
  );
}
