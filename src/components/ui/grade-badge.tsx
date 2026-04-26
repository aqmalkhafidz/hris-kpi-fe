import { Badge } from '../shell/badge'

export type Grade = 'A' | 'B+' | 'B' | 'C' | 'D'

export function GradeBadge({ grade, size = 'sm' }: { grade: Grade; size?: 'sm' | 'md' }) {
  const tone = grade === 'A' ? 'success' : grade === 'B+' ? 'brand' : grade === 'B' ? 'info' : grade === 'C' ? 'warning' : 'error'
  return <Badge tone={tone} size={size}>{grade}</Badge>
}
