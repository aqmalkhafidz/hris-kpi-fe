import { Badge } from '@shared/ui/badge';
import type {
  HrDashboardCycle,
  HrDashboardPipeline,
} from '../hooks/use-hr-dashboard';

export function PipelineCard({
  cycle,
  pipeline,
}: {
  cycle: HrDashboardCycle;
  pipeline: HrDashboardPipeline;
}) {
  const stages = [
    {
      id: 'invited',
      label: 'Invited',
      val: pipeline.invited,
      color: '#94a3b8',
    },
    {
      id: 'draft',
      label: 'Draft started',
      val: pipeline.draftStarted,
      color: '#7592ff',
    },
    {
      id: 'self',
      label: 'Self submitted',
      val: pipeline.selfSubmitted,
      color: '#465fff',
    },
    {
      id: 'sl',
      label: 'SL approved',
      val: pipeline.slApproved,
      color: '#7c5cff',
    },
    {
      id: 'hod',
      label: 'HoD approved',
      val: pipeline.hodApproved,
      color: '#10b981',
    },
    {
      id: 'hodiv',
      label: 'HoDiv approved',
      val: pipeline.hodivApproved,
      color: '#059669',
    },
    {
      id: 'completed',
      label: 'Completed',
      val: pipeline.completed,
      color: '#047857',
    },
  ];
  const total = pipeline.invited || 1;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            Cycle pipeline
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {cycle.name} · {cycle.startDate} – {cycle.endDate}
          </p>
        </div>
        <Badge tone="brand">Active</Badge>
      </div>
      <div className="mt-6 space-y-3">
        {stages.map((s, i) => {
          const pct = (s.val / total) * 100;
          const next = stages[i + 1];
          const drop = next ? s.val - next.val : 0;
          return (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {s.label}
                </span>
                <span className="tabular-nums text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {s.val}
                  </span>
                  <span className="ml-1">/ {pipeline.invited}</span>
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: s.color }}
                />
              </div>
              {next && drop > 0 && (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  −{drop} dropped to next stage
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
