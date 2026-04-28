import { usePaginate } from '@shared/hooks/use-paginate';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { Department, Employee, Position } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';

export function DepartmentsView({
  search,
  departments,
  employees,
  positions,
  onEdit,
  onDelete,
}: {
  search: string;
  departments: Department[];
  employees: Employee[];
  positions: Position[];
  onEdit: (d: Department) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () =>
      departments.filter((d) =>
        (d.name + d.division + d.hod).toLowerCase().includes(q)
      ),
    [departments, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Department</th>
            <th className="px-3 py-3">Division</th>
            <th className="px-3 py-3">Head of Department</th>
            <th className="px-3 py-3 text-right">Positions</th>
            <th className="px-3 py-3 text-right">Headcount</th>
            <th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const headcount = employees.filter((e) => e.deptId === d.id).length;
            const posCount = positions.filter((p) => p.deptId === d.id).length;
            return (
              <tr
                key={d.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800">
                      {Icon.layers}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {d.name}
                    </p>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {d.division}
                </td>
                <td className="px-3 py-3.5">
                  {d.hod ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        initials={d.hod
                          .split(' ')
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join('')}
                        size="sm"
                        tone="brand"
                      />
                      <span className="text-gray-700 dark:text-gray-200">
                        {d.hod}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums text-gray-600 dark:text-gray-300">
                  {posCount}
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums font-semibold text-gray-900 dark:text-white">
                  {headcount}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(d)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                    >
                      {Icon.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete department ${d.name}?`))
                          onDelete(d.id);
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
