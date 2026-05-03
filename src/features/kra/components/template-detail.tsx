import { Icon } from '@shared/layouts/icon';
import {
  useDivisions,
  useDepartments,
  usePositions,
} from '../../org/hooks/use-org';
import type { KraTemplateV2 } from '../types';
import { StatusBadge } from './status-badge';
import { WeightStack } from './weight-stack';

export function TemplateDetail({
  t,
  onEdit,
  onPublish,
  onAddKra,
  onEditKra,
  onDeleteKra,
}: {
  t: KraTemplateV2;
  onEdit: () => void;
  onPublish: () => void;
  onAddKra: () => void;
  onEditKra: (kraCode: string) => void;
  onDeleteKra: (kraCode: string) => void;
}) {
  const { data: divisions = [] } = useDivisions();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const division = divisions.find((d) => d.id === t.divId);
  const department = departments.find((d) => d.id === t.deptId);
  const position = positions.find((p) => p.id === t.posId);

  const total = t.items.reduce((s, i) => s + i.weight, 0);
  const balanced = total === 100;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={t.status} />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Version {t.version} · updated {t.updated}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.summary}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {t.status === 'draft' && (
            <button
              onClick={onPublish}
              disabled={!balanced}
              title={!balanced ? 'Total weight must be 100% to publish' : ''}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-200"
            >
              {Icon.send}
              <span>Publish v{parseFloat(t.version.replace('v', '')) + 1}</span>
            </button>
          )}
          <button
            onClick={onEdit}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white hover:bg-brand-600"
          >
            {Icon.edit}
            <span>Edit template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-b border-gray-200 px-6 py-5 dark:border-gray-800 lg:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Applies to
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {division?.name ?? '...'} · {department?.name ?? '...'}
          </p>
          <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
            {position?.title ?? '...'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Used by
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
            {t.usedBy} employees
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            In the active Q1 2026 cycle
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Weight allocation
          </p>
          <div className="mt-2">
            <WeightStack items={t.items} />
          </div>
          <p
            className={`mt-1.5 text-xs ${balanced ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}
          >
            Total {total}% {balanced ? '· balanced' : '· must equal 100%'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th className="w-10 px-6 py-3" />
              <th className="px-3 py-3">Code</th>
              <th className="px-3 py-3">KRA</th>
              <th className="px-3 py-3">KPI / measurement</th>
              <th className="px-3 py-3 text-right">Weight</th>
              <th className="w-16 px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {t.items.map((it) => (
              <tr
                key={it.code}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800/60"
              >
                <td className="px-6 py-4 text-center text-gray-300 dark:text-gray-600">
                  <span className="cursor-grab select-none text-base leading-none">
                    ⋮⋮
                  </span>
                </td>
                <td className="px-3 py-4">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] tabular-nums text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {it.code}
                  </code>
                </td>
                <td className="px-3 py-4">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {it.title}
                  </p>
                </td>
                <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                  {it.kpi}
                </td>
                <td className="px-3 py-4 text-right">
                  <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {it.weight}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEditKra(it.code)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/[0.05]"
                    >
                      {Icon.edit}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${it.code} — ${it.title}?`))
                          onDeleteKra(it.code);
                      }}
                      className="rounded p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                    >
                      {Icon.trash}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={6} className="px-6 py-3">
                <button
                  onClick={onAddKra}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                >
                  {Icon.plus}
                  <span>Add KRA item</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Rating scale
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          5-point scale shared across all templates
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {[
            {
              n: 1,
              label: 'Below',
              desc: 'Did not meet expectations',
              color: '#f04438',
            },
            {
              n: 2,
              label: 'Partial',
              desc: 'Met some expectations',
              color: '#f97066',
            },
            {
              n: 3,
              label: 'Meets',
              desc: 'Met expectations consistently',
              color: '#fdb022',
            },
            {
              n: 4,
              label: 'Exceeds',
              desc: 'Exceeded in most areas',
              color: '#84cc16',
            },
            {
              n: 5,
              label: 'Outstanding',
              desc: 'Exceeded in all areas',
              color: '#12b76a',
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-gray-200 p-3 dark:border-gray-800"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ background: s.color }}
                >
                  {s.n}
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {s.label}
                </p>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-gray-200 px-6 py-5 dark:border-gray-800 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Approval chain
          </p>
          <ol className="mt-2 space-y-1.5 text-sm">
            {[
              'Self appraisal',
              'Squad Leader',
              'Head of Department',
              'Head of Division',
            ].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  {i + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-200">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Evidence required
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li className="flex items-center gap-2">
              <span className="text-success-500">{Icon.check}</span>Per-KRA
              narrative comment
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success-500">{Icon.check}</span>At least 1
              evidence link or file
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success-500">{Icon.check}</span>Final
              reflection
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Cycle defaults
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200">
            <li>Quarterly · 3-month review window</li>
            <li>Self-deadline: cycle end −7 days</li>
            <li>Locked after HoDiv approval</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
