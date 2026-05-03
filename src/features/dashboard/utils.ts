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

export function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  if (!start || !end) return '—';
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()))
    return `${start} – ${end}`;
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const startStr = s.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endStr = e.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} – ${endStr}`;
}

export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  const diffMs =
    Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) -
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}
