import { usePaginate } from '@shared/hooks/use-paginate';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { Department, Division, Squad } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';

export function SquadsView({
  search,
  squads,
  divisions,
  departments,
  onEdit,
  onDelete,
}: {
  search: string;
  squads: Squad[];
  divisions: Division[];
  departments: Department[];
  onEdit: (s: Squad) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () => squads.filter((s) => (s.name + s.code).toLowerCase().includes(q)),
    [squads, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Squad</th>
            <th className="px-3 py-3">Code</th>
            <th className="px-3 py-3">Division</th>
            <th className="px-3 py-3">Department</th>
            <th className="px-3 py-3 max-w-[200px]">Description</th>
            <th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const div = divisions.find((d) => d.id === s.divId);
            const dept = departments.find((d) => d.id === s.deptId);
            return (
              <tr
                key={s.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">
                  {s.name}
                </td>
                <td className="px-3 py-3.5">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {s.code}
                  </code>
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {div?.name || '—'}
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {dept?.name || '—'}
                </td>
                <td className="px-3 py-3.5 max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400">
                  {s.description || '—'}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(s)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                    >
                      {Icon.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete squad ${s.name}?`)) onDelete(s.id);
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
