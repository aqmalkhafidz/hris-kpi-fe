import { Icon } from '@shared/layouts/icon';
import { PageShell } from '@shared/layouts/page-shell';
import { AttentionCard } from '../components/attention-card';
import { CycleHeader } from '../components/cycle-header';
import { DivisionTable } from '../components/division-table';
import { PipelineCard } from '../components/pipeline-card';
import { RecentSubmissions } from '../components/recent-submissions';
import { ScoreDistributionCard } from '../components/score-distribution-card';
import { StatCard } from '../components/stat-card';
import {
  useHrDashboard,
  type HrDashboardStats,
} from '../hooks/use-hr-dashboard';

function StatCards({ stats }: { stats: HrDashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Icon.team}
        label="Active employees"
        value={stats.activeEmployees}
        sub="in this cycle"
        tone="brand"
      />
      <StatCard
        icon={Icon.check}
        label="Self-appraisal done"
        value={stats.selfDone}
        sub={stats.activeEmployees ? `of ${stats.activeEmployees}` : ''}
        tone="success"
      />
      <StatCard
        icon={Icon.clock}
        label="Awaiting review"
        value={stats.awaitingReview}
        sub="across SL/HoD/HoDiv"
        tone="warning"
      />
      <StatCard
        icon={Icon.warn}
        label="Overdue"
        value={stats.overdue}
        sub="past self deadline"
        tone="error"
      />
    </div>
  );
}

export function HrDashboardPage() {
  const { data, isLoading, error } = useHrDashboard();

  if (isLoading) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </PageShell>
    );
  }
  if (error || !data) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-error-200 bg-error-50 p-6 text-sm text-error-700 dark:border-error-800/50 dark:bg-error-500/10 dark:text-error-300">
          Gagal memuat dashboard.
        </div>
      </PageShell>
    );
  }
  if (!data.cycle) {
    return (
      <PageShell breadcrumb="HR Dashboard">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.02]">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Belum ada cycle yang dibuat.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Buat cycle baru di menu Cycles untuk memulai distribusi appraisal.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell breadcrumb="HR Dashboard">
      <CycleHeader cycle={data.cycle} pipeline={data.pipeline} />
      <StatCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DivisionTable divisions={data.divisions} />
        </div>
        <PipelineCard cycle={data.cycle} pipeline={data.pipeline} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ScoreDistributionCard buckets={data.scoreBuckets} />
        <AttentionCard items={data.attention} />
        <RecentSubmissions items={data.recentSubmissions} />
      </div>
    </PageShell>
  );
}
