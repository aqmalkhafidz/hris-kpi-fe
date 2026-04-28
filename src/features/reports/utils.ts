import type { CompletedAppraisal } from './hooks/use-reports';

export function effectiveScore(a: CompletedAppraisal) {
  return a.isCalibrated && a.calibratedScore !== null
    ? a.calibratedScore
    : a.finalScore;
}

export function gradeFromScore(s: number): string {
  if (s >= 4.5) return 'A';
  if (s >= 4.0) return 'B+';
  if (s >= 3.5) return 'B';
  if (s >= 3.0) return 'C';
  return 'D';
}

export function downloadCSV(filename: string, rows: string[][]) {
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
