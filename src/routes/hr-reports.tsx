import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useEmployees } from '../hooks/use-org'
import { PageShell } from '../components/shell/page-shell'
import { Badge } from '../components/shell/badge'

type ReportRow = {
  id: string
  name: string
  dept: string
  selfScore: number
  finalScore: number
  status: string
}

const MOCK_SCORES: Record<string, { selfScore: number; finalScore: number; status: string }> = {
  u1: { selfScore: 4, finalScore: 3, status: 'completed' },
  u2: { selfScore: 3, finalScore: 4, status: 'completed' },
  u3: { selfScore: 5, finalScore: 4, status: 'completed' },
  u4: { selfScore: 3, finalScore: 3, status: 'completed' },
  u5: { selfScore: 4, finalScore: 4, status: 'completed' },
}

const SCORE_LABEL: Record<number, string> = { 1: 'Far Below', 2: 'Below', 3: 'Meet', 4: 'Exceed', 5: 'Far Exceed' }

const col = createColumnHelper<ReportRow>()

const columns = [
  col.accessor('name', {
    header: 'Employee',
    cell: info => <span className="text-sm font-medium text-gray-800 dark:text-white">{info.getValue()}</span>,
  }),
  col.accessor('dept', {
    header: 'Department',
    cell: info => <span className="text-sm text-gray-500">{info.getValue()}</span>,
  }),
  col.accessor('selfScore', {
    header: 'Self Score',
    cell: info => (
      <span className="text-sm text-gray-600">{info.getValue()} — {SCORE_LABEL[info.getValue()]}</span>
    ),
  }),
  col.accessor('finalScore', {
    header: 'Final Score',
    cell: info => (
      <Badge tone={info.getValue() >= 4 ? 'success' : info.getValue() === 3 ? 'brand' : 'warning'}>
        {info.getValue()} — {SCORE_LABEL[info.getValue()]}
      </Badge>
    ),
  }),
  col.accessor('status', {
    header: 'Status',
    cell: info => (
      <span className="rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-700 capitalize">
        {info.getValue()}
      </span>
    ),
  }),
]

export function HrReportsPage() {
  const { data: employees = [], isLoading } = useEmployees()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const data = useMemo<ReportRow[]>(
    () =>
      employees
        .filter(e => MOCK_SCORES[e.id])
        .map(e => ({ id: e.id, name: e.name, dept: e.dept, ...MOCK_SCORES[e.id] })),
    [employees]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <PageShell breadcrumb="Reports">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 600, fontSize: '24px', color: 'var(--text-strong,#14182a)' }}>
            Reports
          </h1>
          <input
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search…"
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-brand-300 focus:outline-none w-56"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} className="border-b border-gray-100 dark:border-gray-800">
                    {hg.headers.map(header => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 cursor-pointer select-none hover:text-gray-600"
                      >
                        <span className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400">{table.getFilteredRowModel().rows.length} record(s) · Q1 2026</p>
      </div>
    </PageShell>
  )
}
