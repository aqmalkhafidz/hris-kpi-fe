import { Badge } from '@shared/ui/badge';
import type { Employee } from '../../types';

export function StatusPill({ status }: { status: Employee['status'] }) {
  const map: Record<
    string,
    { label: string; tone: 'success' | 'warning' | 'info' | 'gray' }
  > = {
    active: { label: 'Active', tone: 'success' },
    probation: { label: 'Probation', tone: 'warning' },
    onboarding: { label: 'Onboarding', tone: 'info' },
    inactive: { label: 'Inactive', tone: 'gray' },
  };
  const m = map[status] ?? map.active;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
