import { EmptyState } from '@shared/ui/empty-state';
import { PageShell } from '@shared/layouts/page-shell';

export function AcknowledgePage() {
  return (
    <PageShell breadcrumb="Acknowledge">
      <EmptyState title="This step has been removed from the appraisal flow." />
    </PageShell>
  );
}
