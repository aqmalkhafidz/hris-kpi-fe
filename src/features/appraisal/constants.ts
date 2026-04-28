import type { Evidence } from '@shared/lib/types/appraisal';

export const SCORE_LABELS: Record<number, string> = {
  1: 'Far Below Expectation',
  2: 'Below Expectation',
  3: 'Meet Expectation',
  4: 'Exceed Expectation',
  5: 'Far Exceed Expectation',
};

export interface KraDraft {
  score: number;
  comment: string;
  evidence: Evidence[];
}
