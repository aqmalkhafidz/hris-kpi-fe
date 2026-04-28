import { Badge } from '@shared/ui/badge';
import type { TemplateStatus } from '../types';

export function StatusBadge({ status }: { status: TemplateStatus }) {
  if (status === 'published') return <Badge tone="success">Published</Badge>;
  if (status === 'draft') return <Badge tone="warning">Draft</Badge>;
  return <Badge tone="gray">Archived</Badge>;
}
