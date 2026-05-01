import { usePaginate } from '@shared/hooks/use-paginate';
import { Avatar } from '@shared/layouts/avatar';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { Department, Division, Employee, Squad } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';
import { StatusPill } from '../shared/status-pill';

export function EmployeesView({
  search,
  employees,
  divisions,
  departments,
  squads,
  onEdit,
  onDelete,
}: {
  search: string;
  employees: Employee[];
  divisions: Division[];
  departments: Department[];
  squads: Squad[];
  onEdit: (e: Employee) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () =>
      employees.filter((e) =>
        (e.name + e.nip + e.position + e.manager).toLowerCase().includes(q)
      ),
    [employees, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Employee</th>
            <th className="px-3 py-3">NIP</th>
            <th className="px-3 py-3">Position</th>
            <th className="px-3 py-3">Department</th>
            <th className="px-3 py-3">Squad</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Joined</th>
            <th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const div = divisions.find((d) => d.id === e.divId);
            const dept = departments.find((d) => d.id === e.deptId);
            const squad = e.squadId
              ? squads.find((s) => s.id === e.squadId)
              : null;
            return (
              <tr
                key={e.id}
                className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={e.initials} size="md" tone="brand" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {e.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {div?.name || '—'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {e.nip}
                  </code>
                </td>
                <td className="px-3 py-3.5 text-gray-700 dark:text-gray-200">
                  {e.position}
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {dept?.name || '—'}
                </td>
                <td className="px-3 py-3.5 text-gray-500 dark:text-gray-400">
                  {squad?.name || '—'}
                </td>
                <td className="px-3 py-3.5">
                  <StatusPill status={e.status} />
                </td>
                <td className="px-3 py-3.5 tabular-nums text-gray-400">
                  {e.joined}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(e)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                    >
                      {Icon.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${e.name}?`)) onDelete(e.id);
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
