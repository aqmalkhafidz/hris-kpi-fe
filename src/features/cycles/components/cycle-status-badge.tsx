import { Badge } from '@shared/ui/badge';
import type { CycleStatus } from '../types';

export function CycleStatusBadge({ status }: { status: CycleStatus }) {
  if (status === 'active') return <Badge tone="success">Active</Badge>;
  if (status === 'draft') return <Badge tone="warning">Draft</Badge>;
  return <Badge tone="gray">Closed</Badge>;
}
