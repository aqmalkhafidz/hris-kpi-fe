import { usePaginate } from '@shared/hooks/use-paginate';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { Department, Division, Employee } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';

export function DivisionsView({
  search,
  divisions,
  employees,
  departments,
  onEdit,
  onDelete,
}: {
  search: string;
  divisions: Division[];
  employees: Employee[];
  departments: Department[];
  onEdit: (d: Division) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () =>
      divisions.filter((d) =>
        (d.name + (d.code ?? '')).toLowerCase().includes(q)
      ),
    [divisions, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        {rows.map((d) => {
          const headcount = employees.filter(
            (e) => e.divId === d.id
          ).length;
          const depts = departments
            .filter((dp) => dp.divId === d.id)
            .map((dp) => dp.name);
          return (
            <div
              key={d.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.02]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                    {Icon.building}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {d.name}
                    </p>
                    {d.code && (
                      <code className="text-[11px] text-gray-400">
                        {d.code}
                      </code>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(d)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                  >
                    {Icon.edit}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete division ${d.name}?`)) onDelete(d.id);
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    {Icon.trash}
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">
                    Headcount
                  </p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                    {headcount}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">
                    Departments
                  </p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                    {depts.length}
                  </p>
                </div>
              </div>
              {depts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {depts.map((name) => (
                    <span
                      key={name}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <PaginationBar pagination={pagination} />
    </>
  );
}
