import type { Appraisal } from '@shared/lib/types/appraisal';
import { STATUS_FLOW } from './constants';

export function weightedScore(a: Appraisal) {
  return a.kras.reduce((sum, k) => sum + (k.self_score * k.weight) / 100, 0);
}

export function getStatusLabel(s: string) {
  return STATUS_FLOW.find((f) => f.key === s)?.label ?? s;
}

export function roleLabel(role: string) {
  if (role === 'sl') return 'Squad Leader';
  if (role === 'hodept') return 'Head of Department';
  if (role === 'hodiv') return 'Head of Division';
  return role;
}
