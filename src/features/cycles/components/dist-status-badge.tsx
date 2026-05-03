import { Badge } from '@shared/ui/badge';
import type { DistStatus } from '../hooks/use-cycles';

export function DistStatusBadge({ status }: { status: DistStatus }) {
  if (status === 'matched') return <Badge tone="success">Matched</Badge>;
  if (status === 'skipped_no_template')
    return <Badge tone="warning">No template</Badge>;
  if (status === 'skipped_already') return <Badge tone="gray">Already</Badge>;
  if (status === 'skipped_not_staff')
    return <Badge tone="gray">Not Staff</Badge>;
  return <Badge tone="error">No reviewer</Badge>;
}
