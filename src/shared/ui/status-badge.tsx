import { AppraisalStatus } from '@shared/lib/types/appraisal';
import { Badge, statusLabel, statusTone } from '@shared/ui/badge';

export function StatusBadge({
  status,
  size = 'sm',
}: {
  status: AppraisalStatus | string;
  size?: 'sm' | 'md';
}) {
  return (
    <Badge tone={statusTone(status)} size={size}>
      {statusLabel(status)}
    </Badge>
  );
}
