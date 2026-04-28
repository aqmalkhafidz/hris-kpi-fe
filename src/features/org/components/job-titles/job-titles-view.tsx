import { usePaginate } from '@shared/hooks/use-paginate';
import { Icon } from '@shared/layouts/icon';
import { useMemo } from 'react';
import type { JobTitle } from '../../types';
import { PaginationBar } from '../shared/pagination-bar';

export function JobTitlesView({
  search,
  jobTitles,
  onEdit,
  onDelete,
}: {
  search: string;
  jobTitles: JobTitle[];
  onEdit: (j: JobTitle) => void;
  onDelete: (id: number) => void;
}) {
  const q = search.toLowerCase();
  const filtered = useMemo(
    () => jobTitles.filter((j) => j.name.toLowerCase().includes(q)),
    [jobTitles, q]
  );
  const { rows, ...pagination } = usePaginate(filtered);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50/60 dark:bg-white/[0.02]">
          <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800">
            <th className="px-6 py-3">Job Title</th>
            <th className="px-3 py-3 max-w-[260px]">Description</th>
            <th className="w-16 px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((j) => (
            <tr
              key={j.id}
              className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-white/[0.02]"
            >
              <td className="px-6 py-3.5 font-semibold text-gray-900 dark:text-white">
                {j.name}
              </td>
              <td className="px-3 py-3.5 max-w-[260px] truncate text-xs text-gray-500 dark:text-gray-400">
                {j.description || '—'}
              </td>
              <td className="px-6 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(j)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                  >
                    {Icon.edit}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete job title ${j.name}?`))
                        onDelete(j.id);
                    }}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    {Icon.trash}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationBar pagination={pagination} />
    </div>
  );
}
