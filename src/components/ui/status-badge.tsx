import { AppraisalStatus } from '../../data/mock-appraisals'
import { Badge, statusLabel, statusTone } from '../shell/badge'

export function StatusBadge({ status, size = 'sm' }: { status: AppraisalStatus | string; size?: 'sm' | 'md' }) {
  return (
    <Badge tone={statusTone(status)} size={size}>
      {statusLabel(status)}
    </Badge>
  )
}
